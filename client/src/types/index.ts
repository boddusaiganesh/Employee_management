export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    department: string;
    position: string;
    salary: number;
    hireDate: string;
    status: 'active' | 'inactive' | 'on-leave';
    avatar?: string;
    tasks?: Task[];
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: string;
    employeeId: string;
    employee?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        department: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface Stats {
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    departmentStats: Array<{
        department: string;
        _count: number;
    }>;
    statusStats: Array<{
        status: string;
        _count: number;
    }>;
}

export interface TaskStats {
    totalTasks: number;
    statusStats: Array<{
        status: string;
        _count: number;
    }>;
    priorityStats: Array<{
        priority: string;
        _count: number;
    }>;
    overdueTasks: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
