import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {X, Loader} from 'lucide-react';
import api from '../lib/api';
import {Employee} from '../types';
import {validateEmployeeForm} from '../lib/validation';
import {showToast} from '../lib/toast';

interface EmployeeModalProps {
    employee: Employee | null;
    onClose: () => void;
}

const EmployeeModal = ({employee, onClose}: EmployeeModalProps) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        salary: '',
        hireDate: '',
        status: 'active',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (employee) {
            setFormData({
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                phone: employee.phone || '',
                department: employee.department,
                position: employee.position,
                salary: employee.salary.toString(),
                hireDate: employee.hireDate.split('T')[0],
                status: employee.status,
            });
        }
    }, [employee]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const validationErrors = validateEmployeeForm(formData);
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
            if (employee) {
                await api.put(`/employees/${employee.id}`, formData);
                showToast.success('Employee updated successfully!');
            } else {
                await api.post('/employees', formData);
                showToast.success('Employee created successfully!');
            }
            onClose();
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to save employee';
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
                    className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {employee ? 'Edit Employee' : 'Add New Employee'}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name *
                            </label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => {
                                    setFormData({...formData, firstName: e.target.value});
                                    setErrors({...errors, firstName: ''});
                                }}
                                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                                    errors.firstName
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => {
                                    setFormData({...formData, lastName: e.target.value});
                                    setErrors({...errors, lastName: ''});
                                }}
                                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                                    errors.lastName
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({...formData, email: e.target.value});
                                    setErrors({...errors, email: ''});
                                }}
                                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                                    errors.email
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => {
                                    setFormData({...formData, phone: e.target.value});
                                    setErrors({...errors, phone: ''});
                                }}
                                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                                    errors.phone
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department *
                            </label>
                            <select
                                value={formData.department}
                                onChange={(e) => {
                                    setFormData({...formData, department: e.target.value});
                                    setErrors({...errors, department: ''});
                                }}
                                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                                    errors.department
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            >
                                <option value="">Select Department</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Sales">Sales</option>
                                <option value="HR">HR</option>
                                <option value="Finance">Finance</option>
                                <option value="Design">Design</option>
                                <option value="Operations">Operations</option>
                            </select>
                            {errors.department && (
                                <p className="text-red-500 text-xs mt-1">{errors.department}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Position *
                            </label>
                            <input
                                type="text"
                                value={formData.position}
                                onChange={(e) => {
                                    setFormData({...formData, position: e.target.value});
                                    setErrors({...errors, position: ''});
                                }}
                                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                                    errors.position
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.position && (
                                <p className="text-red-500 text-xs mt-1">{errors.position}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Salary *
                            </label>
                            <input
                                type="number"
                                value={formData.salary}
                                onChange={(e) => {
                                    setFormData({...formData, salary: e.target.value});
                                    setErrors({...errors, salary: ''});
                                }}
                                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                                    errors.salary
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hire Date *
                            </label>
                            <input
                                type="date"
                                value={formData.hireDate}
                                onChange={(e) => {
                                    setFormData({...formData, hireDate: e.target.value});
                                    setErrors({...errors, hireDate: ''});
                                }}
                                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                                    errors.hireDate
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            />
                            {errors.hireDate && (
                                <p className="text-red-500 text-xs mt-1">{errors.hireDate}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status *
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="on-leave">On Leave</option>
                            </select>
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
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-4 h-4 mr-2 animate-spin"/>
                                    Saving...
                                </>
                            ) : (
                                <>{employee ? 'Update Employee' : 'Create Employee'}</>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default EmployeeModal;
