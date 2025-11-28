import {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {
    Users,
    CheckCircle,
    ClipboardList,
    AlertTriangle,
    TrendingUp,
    Building2,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import api from '../lib/api';
import {Stats, TaskStats, Employee, Task} from '../types';
import {SkeletonStats} from '../components/SkeletonLoader';
import {generateDashboardReport} from '../lib/pdf';
import {showToast} from '../lib/toast';

const DashboardNew = () => {
    const [employeeStats, setEmployeeStats] = useState<Stats | null>(null);
    const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [empRes, taskRes] = await Promise.all([
                api.get('/employees/stats'),
                api.get('/tasks/stats'),
            ]);
            setEmployeeStats(empRes.data.data);
            setTaskStats(taskRes.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            showToast.error('Failed to fetch dashboard stats');
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        if (!employeeStats || !taskStats) {
            showToast.error('No data available to generate report');
            return;
        }

        const toastId = showToast.loading('Generating report...');
        try {
            // Fetch all employees and tasks for the report
            const [employeesRes, tasksRes] = await Promise.all([
                api.get('/employees', {params: {limit: 1000}}),
                api.get('/tasks', {params: {limit: 1000}}),
            ]);

            const employees: Employee[] = employeesRes.data.data;
            const tasks: Task[] = tasksRes.data.data;

            generateDashboardReport(employeeStats, taskStats, employees, tasks);
            showToast.dismiss(toastId);
            showToast.success('Dashboard report generated successfully!');
        } catch (error) {
            showToast.dismiss(toastId);
            showToast.error('Failed to generate report');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                <SkeletonStats/>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Employees',
            value: employeeStats?.totalEmployees || 0,
            change: '+12%',
            trend: 'up',
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-500'
        },
        {
            title: 'Active Employees',
            value: employeeStats?.activeEmployees || 0,
            change: '+5%',
            trend: 'up',
            icon: CheckCircle,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
            iconColor: 'text-green-500'
        },
        {
            title: 'Total Tasks',
            value: taskStats?.totalTasks || 0,
            change: '+8%',
            trend: 'up',
            icon: ClipboardList,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10',
            iconColor: 'text-purple-500'
        },
        {
            title: 'Overdue Tasks',
            value: taskStats?.overdueTasks || 0,
            change: '-3%',
            trend: 'down',
            icon: AlertTriangle,
            color: 'from-red-500 to-orange-500',
            bgColor: 'bg-red-500/10',
            iconColor: 'text-red-500'
        },
    ];

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    const departmentData = employeeStats?.departmentStats.map(dept => ({
        name: dept.department,
        value: dept._count
    })) || [];

    const taskStatusData = taskStats?.statusStats.map(status => ({
        name: status.status.replace('-', ' '),
        value: status._count
    })) || [];

    const priorityData = taskStats?.priorityStats.map(priority => ({
        name: priority.priority,
        value: priority._count
    })) || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header Section */}
            <motion.div
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                className="bg-white border-b border-gray-200 px-8 py-6 mb-8"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
                        <p className="text-gray-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-2"/>
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={handleGenerateReport}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        <TrendingUp className="w-5 h-5 inline mr-2"/>
                        Generate Report
                    </motion.button>
                </div>
            </motion.div>

            <div className="px-8 pb-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: index * 0.1}}
                            whileHover={{y: -5, scale: 1.02}}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                    <stat.icon className={`w-8 h-8 ${stat.iconColor}`}/>
                                </div>
                                <div className={`flex items-center text-sm font-semibold ${
                                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                                }`}>
                                    {stat.trend === 'up' ? (
                                        <ArrowUpRight className="w-4 h-4 mr-1"/>
                                    ) : (
                                        <ArrowDownRight className="w-4 h-4 mr-1"/>
                                    )}
                                    {stat.change}
                                </div>
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Department Distribution */}
                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.4}}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Employees by Department</h2>
                                <p className="text-sm text-gray-500">Distribution across teams</p>
                            </div>
                            <Building2 className="w-6 h-6 text-blue-500"/>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={departmentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                                <XAxis dataKey="name" stroke="#6b7280" fontSize={12}/>
                                <YAxis stroke="#6b7280" fontSize={12}/>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]}/>
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6"/>
                                        <stop offset="100%" stopColor="#8b5cf6"/>
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Task Status Distribution */}
                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.5}}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Tasks by Status</h2>
                                <p className="text-sm text-gray-500">Current progress overview</p>
                            </div>
                            <ClipboardList className="w-6 h-6 text-purple-500"/>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={taskStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {taskStatusData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Priority Distribution */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.6}}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Tasks by Priority</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {priorityData.map((priority, index) => {
                            const colors: Record<string, string> = {
                                low: 'from-green-400 to-emerald-500',
                                medium: 'from-yellow-400 to-orange-500',
                                high: 'from-orange-500 to-red-500',
                                urgent: 'from-red-500 to-pink-600',
                            };
                            return (
                                <motion.div
                                    key={index}
                                    whileHover={{scale: 1.05}}
                                    className={`bg-gradient-to-br ${colors[priority.name] || 'from-gray-400 to-gray-500'} rounded-xl p-6 text-white text-center shadow-lg`}
                                >
                                    <p className="text-4xl font-bold mb-2">{priority.value}</p>
                                    <p className="text-sm font-semibold uppercase opacity-90">{priority.name}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DashboardNew;
