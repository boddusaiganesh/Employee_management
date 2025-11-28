import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {
    Search,
    UserPlus,
    Mail,
    Phone,
    Building2,
    DollarSign,
    Edit,
    Trash2,
    Eye,
    Grid3x3,
    List,
    Download,
    Upload,
    FileText
} from 'lucide-react';
import api from '../lib/api';
import {Employee} from '../types';
import EmployeeModal from '../components/EmployeeModal';
import ImportModal from '../components/ImportModal';
import Pagination from '../components/Pagination';
import {SkeletonCard} from '../components/SkeletonLoader';
import {useAuthStore} from '../store/authStore';
import {useDebounce} from '../hooks/useDebounce';
import {exportEmployeesToCSV} from '../lib/export';
import {generateEmployeeReport} from '../lib/pdf';
import {showToast} from '../lib/toast';

const EmployeesNew = () => {
    const {user} = useAuthStore();
    const isAdmin = user?.role === 'admin';
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(9);

    // Debounced search
    const debouncedSearch = useDebounce(searchTerm, 300);

    useEffect(() => {
        fetchEmployees();
    }, [debouncedSearch, departmentFilter, statusFilter, currentPage]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const params: any = {
                page: currentPage,
                limit: itemsPerPage
            };
            if (debouncedSearch) params.search = debouncedSearch;
            if (departmentFilter) params.department = departmentFilter;
            if (statusFilter) params.status = statusFilter;

            const response = await api.get('/employees', {params});
            setEmployees(response.data.data);

            if (response.data.pagination) {
                setTotalPages(response.data.pagination.totalPages);
                setTotalItems(response.data.pagination.total);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            showToast.error('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
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
            fetchEmployees();
        } catch (error: any) {
            showToast.dismiss(toastId);
            const message = error.response?.data?.message || 'Failed to delete employee';
            showToast.error(message);
        }
    };

    const handleEdit = (employee: Employee) => {
        if (!isAdmin) {
            showToast.error('Only administrators can edit employees');
            return;
        }
        setEditingEmployee(employee);
        setShowModal(true);
    };

    const handleAdd = () => {
        if (!isAdmin) {
            showToast.error('Only administrators can add employees');
            return;
        }
        setEditingEmployee(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingEmployee(null);
        fetchEmployees();
    };

    const handleExportCSV = () => {
        if (employees.length === 0) {
            showToast.error('No data to export');
            return;
        }
        exportEmployeesToCSV(employees);
        showToast.success('Employee data exported successfully!');
    };

    const handleExportPDF = () => {
        if (employees.length === 0) {
            showToast.error('No data to export');
            return;
        }
        generateEmployeeReport(employees);
        showToast.success('PDF report generated successfully!');
    };

    const handleImport = async (data: any[]) => {
        const toastId = showToast.loading('Importing employees...');
        let successCount = 0;
        let errorCount = 0;

        for (const row of data) {
            try {
                const employeeData = {
                    firstName: row['First Name'] || row.firstName,
                    lastName: row['Last Name'] || row.lastName,
                    email: row['Email'] || row.email,
                    phone: row['Phone'] || row.phone || '',
                    department: row['Department'] || row.department,
                    position: row['Position'] || row.position,
                    salary: parseFloat(row['Salary'] || row.salary),
                    hireDate: row['Hire Date'] || row.hireDate,
                    status: row['Status'] || row.status || 'active',
                };
                await api.post('/employees', employeeData);
                successCount++;
            } catch (error) {
                errorCount++;
                console.error('Error importing row:', error);
            }
        }

        showToast.dismiss(toastId);
        if (successCount > 0) {
            showToast.success(`Successfully imported ${successCount} employees`);
            fetchEmployees();
        }
        if (errorCount > 0) {
            showToast.error(`Failed to import ${errorCount} employees`);
        }
    };

    const departments = [...new Set(employees.map((e) => e.department))];

    const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
        active: {bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500'},
        inactive: {bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500'},
        'on-leave': {bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500'},
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-8">
            {/* Header */}
            <motion.div
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                className="bg-white border-b border-gray-200 px-8 py-6 mb-8"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            {isAdmin ? 'Employee Management' : 'Employee Directory'}
                        </h1>
                        <p className="text-gray-600">
                            {isAdmin
                                ? `Manage your organization's workforce`
                                : 'Browse and connect with your colleagues'}
                        </p>
                    </div>
                    <div className="flex items-center flex-wrap gap-3">
                        {isAdmin && (
                            <>
                                <motion.button
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                    onClick={handleExportCSV}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center"
                                >
                                    <Download className="w-4 h-4 mr-2"/>
                                    CSV
                                </motion.button>
                                <motion.button
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                    onClick={handleExportPDF}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center"
                                >
                                    <FileText className="w-4 h-4 mr-2"/>
                                    PDF
                                </motion.button>
                                <motion.button
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                    onClick={() => setShowImportModal(true)}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center"
                                >
                                    <Upload className="w-4 h-4 mr-2"/>
                                    Import
                                </motion.button>
                            </>
                        )}
                        {isAdmin && (
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={handleAdd}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center"
                            >
                                <UserPlus className="w-5 h-5 mr-2"/>
                                Add Employee
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="px-8">
                {/* Filters & Search */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.1}}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            <input
                                type="text"
                                placeholder="Search by name, email, or position..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <select
                            value={departmentFilter}
                            onChange={(e) => {
                                setDepartmentFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="on-leave">On Leave</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{totalItems}</span> employees
                        </p>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Grid3x3 className="w-5 h-5"/>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <List className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Employee Grid/List */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonCard key={i}/>
                        ))}
                    </div>
                ) : employees.length === 0 ? (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        className="text-center py-20"
                    >
                        <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 max-w-md mx-auto">
                            <div
                                className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-10 h-10 text-gray-400"/>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No employees found</h3>
                            <p className="text-gray-600">Try adjusting your search or filters</p>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        <div className={viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'
                            : 'space-y-4 mb-8'
                        }>
                            <AnimatePresence>
                                {employees.map((employee, index) => viewMode === 'grid' ? (
                                    // Grid View
                                    <motion.div
                                        key={employee.id}
                                        initial={{opacity: 0, y: 20}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: -20}}
                                        transition={{delay: index * 0.05}}
                                        whileHover={{y: -5}}
                                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden group"
                                    >
                                        <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                                            <div className="absolute -bottom-10 left-6">
                                                <div
                                                    className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                                                    <span
                                                        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                                                        {employee.firstName[0]}{employee.lastName[0]}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="absolute top-4 right-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[employee.status].bg} ${statusConfig[employee.status].text} flex items-center`}>
                                                    <span
                                                        className={`w-2 h-2 rounded-full ${statusConfig[employee.status].dot} mr-2`}></span>
                                                    {employee.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 pt-14">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                {employee.firstName} {employee.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4">{employee.position}</p>

                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Mail className="w-4 h-4 mr-3 text-blue-500"/>
                                                    <span className="truncate">{employee.email}</span>
                                                </div>
                                                {employee.phone && (
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Phone className="w-4 h-4 mr-3 text-green-500"/>
                                                        <span>{employee.phone}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Building2 className="w-4 h-4 mr-3 text-purple-500"/>
                                                    <span>{employee.department}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <DollarSign className="w-4 h-4 mr-3 text-green-500"/>
                                                    <span
                                                        className="font-semibold">${employee.salary.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div
                                                className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <Link
                                                    to={`/dashboard/employees/${employee.id}`}
                                                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center transition-colors"
                                                >
                                                    <Eye className="w-4 h-4 mr-1"/>
                                                    View Details
                                                </Link>
                                                {isAdmin && (
                                                    <div className="flex items-center space-x-2">
                                                        <motion.button
                                                            whileHover={{scale: 1.1}}
                                                            whileTap={{scale: 0.9}}
                                                            onClick={() => handleEdit(employee)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit className="w-4 h-4"/>
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{scale: 1.1}}
                                                            whileTap={{scale: 0.9}}
                                                            onClick={() => handleDelete(employee.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4"/>
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    // List View
                                    <motion.div
                                        key={employee.id}
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        exit={{opacity: 0, x: 20}}
                                        transition={{delay: index * 0.03}}
                                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 p-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 flex-1">
                                                <div
                                                    className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                                    {employee.firstName[0]}{employee.lastName[0]}
                                                </div>
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">
                                                            {employee.firstName} {employee.lastName}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">{employee.position}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">{employee.email}</p>
                                                        {employee.phone && (
                                                            <p className="text-sm text-gray-600">{employee.phone}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{employee.department}</p>
                                                        <p className="text-sm text-gray-600">${employee.salary.toLocaleString()}</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[employee.status].bg} ${statusConfig[employee.status].text}`}>
                                                            {employee.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 ml-4">
                                                <Link
                                                    to={`/dashboard/employees/${employee.id}`}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-5 h-5"/>
                                                </Link>
                                                {isAdmin && (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(employee)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit className="w-5 h-5"/>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(employee.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-5 h-5"/>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showModal && (
                    <EmployeeModal
                        employee={editingEmployee}
                        onClose={handleModalClose}
                    />
                )}
                {showImportModal && (
                    <ImportModal
                        type="employees"
                        onClose={() => setShowImportModal(false)}
                        onImport={handleImport}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmployeesNew;
