import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {useAuthStore} from '../store/authStore';
import {showToast} from '../lib/toast';
import {motion} from 'framer-motion';
import {Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, Shield, Users, Building2} from 'lucide-react';

const LoginNew = () => {
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);
    const register = useAuthStore(state => state.register);

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.email, formData.password, formData.name);
            }
            showToast.success(isLogin ? 'Login successful!' : 'Account created successfully!');
            navigate('/dashboard');
        } catch (error: any) {
            showToast.error(error.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async (role: 'admin' | 'user') => {
        const credentials = {
            admin: {email: 'admin@example.com', password: '9392359Abc@'},
            user: {email: 'user@example.com', password: '9392359Abc@'},
        };

        setLoading(true);
        try {
            await login(credentials[role].email, credentials[role].password);
            showToast.success(`Logged in as ${role}!`);
            navigate('/dashboard');
        } catch (error) {
            showToast.error('Demo login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center"
            >
                {/* Left Side - Branding & Info */}
                <motion.div
                    initial={{opacity: 0, x: -50}}
                    animate={{opacity: 1, x: 0}}
                    transition={{delay: 0.2}}
                    className="hidden lg:block space-y-8"
                >
                    {/* Logo & Company Name */}
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <motion.div
                            whileHover={{scale: 1.05, rotate: 360}}
                            transition={{duration: 0.5}}
                            className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                        >
                            <Building2 className="text-white w-7 h-7"/>
                        </motion.div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                EmployeeMS
                            </h1>
                            <p className="text-sm text-slate-500">Management System</p>
                        </div>
                    </Link>

                    {/* Main Heading */}
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold text-slate-800 leading-tight">
                            Streamline Your
                            <span
                                className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Workforce Management
                            </span>
                        </h2>
                        <p className="text-lg text-slate-600">
                            Modern, secure, and powerful platform for managing employees and tasks efficiently.
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4">
                        {[
                            {icon: Shield, title: 'Secure Authentication', desc: 'Enterprise-grade security'},
                            {icon: Users, title: 'Team Management', desc: 'Manage employees effortlessly'},
                            {icon: Building2, title: 'Task Tracking', desc: 'Keep projects on track'},
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{delay: 0.3 + idx * 0.1}}
                                className="flex items-start gap-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div
                                    className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <feature.icon className="w-6 h-6 text-indigo-600"/>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">{feature.title}</h3>
                                    <p className="text-sm text-slate-600">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Trust Badge */}
                    <div
                        className="flex items-center gap-2 text-slate-600 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200">
                        <Shield className="w-5 h-5 text-green-600"/>
                        <span className="text-sm">Trusted by 500+ organizations worldwide</span>
                    </div>
                </motion.div>

                {/* Right Side - Login Form */}
                <motion.div
                    initial={{opacity: 0, x: 50}}
                    animate={{opacity: 1, x: 0}}
                    transition={{delay: 0.3}}
                    className="w-full"
                >
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 lg:p-10">
                        {/* Back Button */}
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors mb-6 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/>
                            <span className="text-sm font-medium">Back to Home</span>
                        </Link>

                        {/* Mobile Logo */}
                        <div className="lg:hidden mb-6 flex items-center gap-3">
                            <div
                                className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <Building2 className="text-white w-6 h-6"/>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">EmployeeMS</h1>
                                <p className="text-xs text-slate-500">Management System</p>
                            </div>
                        </div>

                        {/* Form Header */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-slate-600">
                                {isLogin
                                    ? 'Sign in to access your workspace'
                                    : 'Get started with your free account'}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required={!isLogin}
                                            className="w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 hover:bg-white"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 hover:bg-white"
                                        placeholder="you@company.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-12 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 hover:bg-white"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                    </button>
                                </div>
                            </div>

                            {isLogin && (
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox"
                                               className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"/>
                                        <span className="text-slate-600">Remember me</span>
                                    </label>
                                    <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                        Forgot password?
                                    </a>
                                </div>
                            )}

                            {/* Demo Accounts - After Password */}
                            {isLogin && (
                                <div className="pt-2">
                                    <p className="text-sm font-medium text-slate-700 mb-3 text-center">Quick Access -
                                        Demo Accounts</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <motion.button
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                            type="button"
                                            onClick={() => handleDemoLogin('admin')}
                                            disabled={loading}
                                            className="relative overflow-hidden p-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                        >
                                            <div className="relative z-10">
                                                <Shield className="w-6 h-6 mb-2 mx-auto"/>
                                                <p className="font-semibold text-sm">Admin Access</p>
                                                <p className="text-xs opacity-90">Full Control</p>
                                            </div>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                            type="button"
                                            onClick={() => handleDemoLogin('user')}
                                            disabled={loading}
                                            className="relative overflow-hidden p-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                        >
                                            <div className="relative z-10">
                                                <Users className="w-6 h-6 mb-2 mx-auto"/>
                                                <p className="font-semibold text-sm">User Access</p>
                                                <p className="text-xs opacity-90">View Only</p>
                                            </div>
                                        </motion.button>
                                    </div>
                                </div>
                            )}

                            {/* Divider */}
                            {isLogin && (
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span
                                            className="px-4 bg-white text-slate-500">Or continue with credentials</span>
                                    </div>
                                </div>
                            )}

                            <motion.button
                                whileHover={{scale: 1.01}}
                                whileTap={{scale: 0.99}}
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                ) : (
                                    <>
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <ArrowRight className="w-5 h-5"/>
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Toggle Login/Register */}
                        <p className="mt-6 text-center text-sm text-slate-600">
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-indigo-600 hover:text-indigo-700 font-semibold"
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginNew;
