import {useEffect, useState} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {
    ArrowLeft,
    Mail,
    Phone,
    Building2,
    DollarSign,
    Calendar,
    Edit,
    Trash2,
    Briefcase,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import api from '../lib/api';
import {Employee, Task} from '../types';
import {useAuthStore} from '../store/authStore';
import {showToast} from '../lib/toast';

const EmployeeDetails = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {user} = useAuthStore();
    const isAdmin = user?.role === 'admin';
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const response = await api.get(`/employees/${id}`);
            setEmployee(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employee:', error);
            showToast.error('Failed to fetch employee details');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!isAdmin) {
            showToast.error('Only administrators can delete employees');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this employee?')) return;

        const toastId = showToast.loading('Deleting employee...');
        try {
            await api.delete(`/employees/${id}`);
            showToast.dismiss(toastId);
            showToast.success('Employee deleted successfully!');
            navigate('/dashboard/employees');
        } catch (error) {
            showToast.dismiss(toastId);
            showToast.error('Failed to delete employee');
        }
    };

    if (loading) {
        return (
            <div
                className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <motion.div
                    animate={{rotate: 360}}
                    transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                    className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!employee) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-12 shadow-xl border border-slate-200 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600"/>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4 text-center">Employee not found</h3>
                    <Link to="/dashboard/employees"
                          className="block text-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                        ← Back to Employees
                    </Link>
                </div>
            </div>
        );
    }

    const statusConfig: Record<string, { bg: string; text: string; icon: any }> = {
        active: {bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2},
        inactive: {bg: 'bg-slate-100', text: 'text-slate-700', icon: AlertCircle},
        'on-leave': {bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock},
    };

    const taskStatusColors: Record<string, string> = {
        pending: 'bg-amber-50 text-amber-700 border-amber-200',
        'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
        completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        cancelled: 'bg-red-50 text-red-700 border-red-200',
    };

    const priorityColors: Record<string, string> = {
        low: 'bg-slate-100 text-slate-700',
        medium: 'bg-amber-100 text-amber-700',
        high: 'bg-orange-100 text-orange-700',
        urgent: 'bg-red-100 text-red-700',
    };

    const StatusIcon = statusConfig[employee.status]?.icon || AlertCircle;

    const calculateTenure = () => {
        const hireDate = new Date(employee.hireDate);
        const now = new Date();
        const years = now.getFullYear() - hireDate.getFullYear();
        const months = now.getMonth() - hireDate.getMonth();
        const totalMonths = years * 12 + months;

        if (totalMonths < 12) {
            return `${totalMonths} month${totalMonths !== 1 ? 's' : ''}`;
        } else {
            const y = Math.floor(totalMonths / 12);
            const m = totalMonths % 12;
            return `${y} year${y !== 1 ? 's' : ''}${m > 0 ? `, ${m} month${m !== 1 ? 's' : ''}` : ''}`;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-12">
            {/* Header */}
            <motion.div
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                className="bg-white border-b border-slate-200 shadow-sm"
            >
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <Link
                            to="/dashboard/employees"
                            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform"/>
                            Back to Employees
                        </Link>
                        {isAdmin && (
                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                    onClick={() => navigate(`/dashboard/employees/${id}/edit`)}
                                    className="px-5 py-2.5 bg-white border-2 border-slate-300 rounded-xl font-medium text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center gap-2"
                                >
                                    <Edit className="w-4 h-4"/>
                                    Edit
                                </motion.button>
                                <motion.button
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                    onClick={handleDelete}
                                    className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-600/30"
                                >
                                    <Trash2 className="w-4 h-4"/>
                                    Delete
                                </motion.button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 mt-8">
                {/* Profile Header Card */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8"
                >
                    {/* Gradient Header */}
                    <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    <div className="px-8 pb-8">
                        {/* Avatar & Name Section */}
                        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 mb-8">
                            {/* Avatar */}
                            <motion.div
                                initial={{scale: 0.8, opacity: 0}}
                                animate={{scale: 1, opacity: 1}}
                                transition={{delay: 0.2}}
                                className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-2xl border-4 border-white relative"
                            >
                                {employee.firstName[0]}{employee.lastName[0]}
                                <div
                                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                    <StatusIcon className={`w-6 h-6 ${statusConfig[employee.status]?.text}`}/>
                                </div>
                            </motion.div>

                            {/* Name & Title */}
                            <div className="flex-1 md:pb-2">
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                    {employee.firstName} {employee.lastName}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Briefcase className="w-5 h-5"/>
                                        <span className="text-lg font-medium">{employee.position}</span>
                                    </div>
                                    <span className="text-slate-300">•</span>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Building2 className="w-5 h-5"/>
                                        <span className="text-lg font-medium">{employee.department}</span>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <span
                                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl ${statusConfig[employee.status]?.bg} ${statusConfig[employee.status]?.text}`}>
                                        <StatusIcon className="w-4 h-4"/>
                                        {employee.status.replace('-', ' ').toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Email */}
                            <motion.div
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.1}}
                                className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <Mail className="w-5 h-5 text-blue-600"/>
                                    </div>
                                    <p className="text-sm font-semibold text-blue-900 uppercase tracking-wide">Email</p>
                                </div>
                                <p className="text-slate-800 font-medium break-all">{employee.email}</p>
                            </motion.div>

                            {/* Phone */}
                            {employee.phone && (
                                <motion.div
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: 0.2}}
                                    className="group bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-lg"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div
                                            className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                            <Phone className="w-5 h-5 text-emerald-600"/>
                                        </div>
                                        <p className="text-sm font-semibold text-emerald-900 uppercase tracking-wide">Phone</p>
                                    </div>
                                    <p className="text-slate-800 font-medium">{employee.phone}</p>
                                </motion.div>
                            )}

                            {/* Salary */}
                            <motion.div
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.3}}
                                className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-lg"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                        <DollarSign className="w-5 h-5 text-green-600"/>
                                    </div>
                                    <p className="text-sm font-semibold text-green-900 uppercase tracking-wide">Annual
                                        Salary</p>
                                </div>
                                <p className="text-2xl font-bold text-slate-900">
                                    ${employee.salary.toLocaleString()}
                                </p>
                            </motion.div>

                            {/* Hire Date */}
                            <motion.div
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.4}}
                                className="group bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border-2 border-orange-100 hover:border-orange-300 transition-all hover:shadow-lg"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                        <Calendar className="w-5 h-5 text-orange-600"/>
                                    </div>
                                    <p className="text-sm font-semibold text-orange-900 uppercase tracking-wide">Hire
                                        Date</p>
                                </div>
                                <p className="text-slate-800 font-medium">
                                    {new Date(employee.hireDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </motion.div>

                            {/* Tenure */}
                            <motion.div
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.5}}
                                className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-lg"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                        <Clock className="w-5 h-5 text-purple-600"/>
                                    </div>
                                    <p className="text-sm font-semibold text-purple-900 uppercase tracking-wide">Tenure</p>
                                </div>
                                <p className="text-slate-800 font-medium text-xl">
                                    {calculateTenure()}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Tasks Section */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.3}}
                    className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Assigned Tasks</h2>
                        <span
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-xl text-sm font-bold border-2 border-indigo-200">
                            {employee.tasks?.length || 0} Task{employee.tasks?.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {employee.tasks && employee.tasks.length > 0 ? (
                        <div className="space-y-4">
                            {employee.tasks.map((task: Task, index: number) => (
                                <motion.div
                                    key={task.id}
                                    initial={{opacity: 0, x: -20}}
                                    animate={{opacity: 1, x: 0}}
                                    transition={{delay: 0.1 * index}}
                                    whileHover={{scale: 1.01, x: 4}}
                                    className="bg-gradient-to-r from-slate-50 to-white border-2 border-slate-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                                {task.title}
                                            </h3>
                                            {task.description && (
                                                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                                    {task.description}
                                                </p>
                                            )}
                                            {task.dueDate && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-slate-500"/>
                                                    <span className="text-slate-600 font-medium">
                                                        Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                    </span>
                                                    {new Date(task.dueDate) < new Date() && task.status !== 'completed' && (
                                                        <span
                                                            className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md uppercase">
                                                            Overdue
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span
                                                className={`px-4 py-2 text-xs font-bold rounded-lg border-2 uppercase tracking-wide whitespace-nowrap ${taskStatusColors[task.status]}`}>
                                                {task.status.replace('-', ' ')}
                                            </span>
                                            <span
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wide text-center ${priorityColors[task.priority]}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <motion.div
                                initial={{scale: 0}}
                                animate={{scale: 1}}
                                className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner"
                            >
                                <Calendar className="w-12 h-12 text-slate-400"/>
                            </motion.div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No tasks assigned</h3>
                            <p className="text-slate-600">This employee doesn't have any tasks yet.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default EmployeeDetails;
