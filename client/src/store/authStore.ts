import {create} from 'zustand';
import {User} from '../types';
import api from '../lib/api';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,

    login: async (email: string, password: string) => {
        set({isLoading: true});
        try {
            const response = await api.post('/auth/login', {email, password});
            const {user, token} = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            set({user, token, isAuthenticated: true, isLoading: false});
        } catch (error: any) {
            set({isLoading: false});
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    register: async (email: string, password: string, name: string) => {
        set({isLoading: true});
        try {
            const response = await api.post('/auth/register', {email, password, name});
            const {user, token} = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            set({user, token, isAuthenticated: true, isLoading: false});
        } catch (error: any) {
            set({isLoading: false});
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({user: null, token: null, isAuthenticated: false});
    },

    checkAuth: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                set({user, token, isAuthenticated: true});
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    },
}));
