import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {X, Loader} from 'lucide-react';
import api from '../lib/api';
import {Task, Employee} from '../types';
import {validateTaskForm} from '../lib/validation';
import {showToast} from '../lib/toast';

interface TaskModalProps {
    task: Task | null;
    employees: Employee[];
    onClose: () => void;
}

const TaskModal = ({task, employees, onClose}: TaskModalProps) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
        employeeId: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                employeeId: task.employeeId,
            });
        }
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const validationErrors = validateTaskForm(formData);
        if (validationErrors.length > 0) {
            const errorMap: Record<string, string> = {};
            validationErrors.forEach(err => {
                errorMap[err.field] = err.message;
            });
            setErrors(errorMap);
            showToast.error('Please fix the validation errors');
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            if (task) {
                await api.put(`/tasks/${task.id}`, formData);
                showToast.success('Task updated successfully!');
            } else {
                await api.post('/tasks', formData);
                showToast.success('Task created successfully!');
            }
            onClose();
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to save task';
            showToast.error(message);
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{scale: 0.95, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                exit={{scale: 0.95, opacity: 0}}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div
                    className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {task ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => {
                                    setFormData({...formData, title: e.target.value});
                                    setErrors({...errors, title: ''});
                                }}
                                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                                    errors.title
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-purple-500'
                                }`}
                                placeholder="Enter task title"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter task description (optional)"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status *
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Priority *
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => {
                                        setFormData({...formData, dueDate: e.target.value});
                                        setErrors({...errors, dueDate: ''});
                                    }}
                                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                                        errors.dueDate
                                            ? 'border-red-300 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-purple-500'
                                    }`}
                                />
                                {errors.dueDate && (
                                    <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assign to Employee *
                                </label>
                                <select
                                    value={formData.employeeId}
                                    onChange={(e) => {
                                        setFormData({...formData, employeeId: e.target.value});
                                        setErrors({...errors, employeeId: ''});
                                    }}
                                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                                        errors.employeeId
                                            ? 'border-red-300 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-purple-500'
                                    }`}
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.firstName} {emp.lastName} - {emp.department}
                                        </option>
                                    ))}
                                </select>
                                {errors.employeeId && (
                                    <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-4 h-4 mr-2 animate-spin"/>
                                    Saving...
                                </>
                            ) : (
                                <>{task ? 'Update Task' : 'Create Task'}</>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default TaskModal;
