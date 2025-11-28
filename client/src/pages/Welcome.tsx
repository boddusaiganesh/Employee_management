import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {
    Users,
    ClipboardList,
    BarChart3,
    Shield,
    Zap,
    CheckCircle,
    ArrowRight,
    Sparkles,
    TrendingUp
} from 'lucide-react';

const Welcome = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Users className="w-8 h-8"/>,
            title: 'Employee Management',
            description: 'Streamline your workforce with comprehensive employee profiles and real-time data.',
            color: 'from-indigo-500 to-purple-600'
        },
        {
            icon: <ClipboardList className="w-8 h-8"/>,
            title: 'Task Tracking',
            description: 'Assign, monitor, and track tasks with our intuitive Kanban-style board.',
            color: 'from-cyan-500 to-blue-600'
        },
        {
            icon: <BarChart3 className="w-8 h-8"/>,
            title: 'Analytics & Reports',
            description: 'Get actionable insights with powerful analytics and visual reporting tools.',
            color: 'from-emerald-500 to-teal-600'
        },
        {
            icon: <Shield className="w-8 h-8"/>,
            title: 'Role-Based Security',
            description: 'Enterprise-grade security with granular role-based access control.',
            color: 'from-orange-500 to-red-600'
        },
        {
            icon: <Zap className="w-8 h-8"/>,
            title: 'Real-Time Updates',
            description: 'Stay synchronized with instant updates across all devices and users.',
            color: 'from-yellow-500 to-orange-600'
        },
        {
            icon: <CheckCircle className="w-8 h-8"/>,
            title: 'Easy to Use',
            description: 'Intuitive interface designed for efficiency with minimal training required.',
            color: 'from-pink-500 to-rose-600'
        }
    ];

    const stats = [
        {value: '10K+', label: 'Active Users'},
        {value: '50K+', label: 'Tasks Managed'},
        {value: '99.9%', label: 'Uptime'},
        {value: '24/7', label: 'Support'}
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-20 right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div
                        className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                {/* Navigation */}
                <nav className="relative z-10 container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <motion.div
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            className="flex items-center space-x-3"
                        >
                            <div
                                className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Users className="w-7 h-7 text-white"/>
                            </div>
                            <span className="text-2xl font-bold text-slate-800">EmployeeMS</span>
                        </motion.div>
                        <motion.button
                            initial={{opacity: 0, x: 20}}
                            animate={{opacity: 1, x: 0}}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            onClick={() => navigate('/login')}
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Sign In
                        </motion.button>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.2}}
                            className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md mb-6 border border-indigo-100"
                        >
                            <Sparkles className="w-4 h-4 text-indigo-600 mr-2"/>
                            <span
                                className="text-sm font-semibold text-slate-700">Trusted by 10,000+ organizations</span>
                        </motion.div>

                        <motion.h1
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.3}}
                            className="text-6xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight"
                        >
                            Manage Your Workforce
                            <span
                                className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mt-2">
                                With Intelligence
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.4}}
                            className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed"
                        >
                            The complete employee management solution trusted by leading organizations worldwide.
                            Streamline operations, boost productivity, and empower your team.
                        </motion.p>

                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.5}}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center group"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"/>
                            </motion.button>
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-indigo-200 hover:bg-slate-50 transition-all shadow-lg"
                            >
                                Watch Demo
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="relative z-10 -mt-16">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{opacity: 0, y: 40}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{opacity: 0, y: 20}}
                                    whileInView={{opacity: 1, y: 0}}
                                    viewport={{once: true}}
                                    transition={{delay: index * 0.1}}
                                    className="text-center"
                                >
                                    <div
                                        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-slate-600 text-sm font-medium">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative z-10 py-24">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Powerful features designed to help you manage your workforce efficiently
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{opacity: 0, y: 20}}
                                whileInView={{opacity: 1, y: 0}}
                                viewport={{once: true}}
                                transition={{delay: index * 0.1}}
                                whileHover={{y: -5, scale: 1.02}}
                                className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-indigo-200 hover:shadow-xl transition-all group"
                            >
                                <div
                                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg text-white`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative z-10 py-24">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden"
                    >
                        {/* Background decoration */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div
                                className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>
                            <div
                                className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>
                        </div>

                        <div className="relative z-10">
                            <div
                                className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                                <TrendingUp className="w-4 h-4 text-white mr-2"/>
                                <span className="text-sm font-semibold text-white">Start your 30-day free trial</span>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                Ready to Transform Your Workforce Management?
                            </h2>
                            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                Join thousands of organizations that trust EmployeeMS for their workforce needs
                            </p>
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={() => navigate('/login')}
                                className="px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all inline-flex items-center group"
                            >
                                Start Your Free Trial
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"/>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-200 py-8 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-slate-600 mb-4 md:mb-0">
                            © 2025 EmployeeMS. All rights reserved.
                        </div>
                        <div className="flex space-x-6 text-slate-600">
                            <a href="#" className="hover:text-indigo-600 transition-colors font-medium">Privacy</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors font-medium">Terms</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors font-medium">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Welcome;
