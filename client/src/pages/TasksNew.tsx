import {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {DragDropContext, Droppable, Draggable, DropResult} from '@hello-pangea/dnd';
import {
    Plus,
    Calendar,
    User,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle,
    Edit,
    Trash2,
    Download,
    FileText
} from 'lucide-react';
import api from '../lib/api';
import {Task, Employee} from '../types';
import TaskModal from '../components/TaskModal';
import ImportModal from '../components/ImportModal';
import {SkeletonKanban} from '../components/SkeletonLoader';
import {useAuthStore} from '../store/authStore';
import {exportTasksToCSV} from '../lib/export';
import {generateTaskReport} from '../lib/pdf';
import {showToast} from '../lib/toast';

const TasksNew = () => {
    const {user} = useAuthStore();
    const isAdmin = user?.role === 'admin';
    const [tasks, setTasks] = useState<Task[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useEffect(() => {
        fetchData();
    }, [statusFilter, priorityFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params: any = {limit: 100};
            if (statusFilter) params.status = statusFilter;
            if (priorityFilter) params.priority = priorityFilter;

            const [tasksRes, employeesRes] = await Promise.all([
                api.get('/tasks', {params}),
                api.get('/employees', {params: {limit: 100}}),
            ]);

            setTasks(tasksRes.data.data);
            setEmployees(employeesRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            showToast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (result: DropResult) => {
        if (!isAdmin) {
            showToast.error('Only administrators can move tasks');
            return;
        }

        const {destination, source, draggableId} = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId;
        const taskId = draggableId;

        // Optimistic update
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? {...task, status: newStatus as any} : task
            )
        );

        try {
            await api.put(`/tasks/${taskId}`, {status: newStatus});
            showToast.success('Task status updated!');
        } catch (error: any) {
            showToast.error('Failed to update task status');
            // Revert on error
            fetchData();
        }
    };

    const handleDelete = async (id: string) => {
        if (!isAdmin) {
            showToast.error('Only administrators can delete tasks');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this task?')) return;

        const toastId = showToast.loading('Deleting task...');
        try {
            await api.delete(`/tasks/${id}`);
            showToast.dismiss(toastId);
            showToast.success('Task deleted successfully!');
            fetchData();
        } catch (error: any) {
            showToast.dismiss(toastId);
            const message = error.response?.data?.message || 'Failed to delete task';
            showToast.error(message);
        }
    };

    const handleEdit = (task: Task) => {
        if (!isAdmin) {
            showToast.error('Only administrators can edit tasks');
            return;
        }
        setEditingTask(task);
        setShowModal(true);
    };

    const handleAdd = () => {
        if (!isAdmin) {
            showToast.error('Only administrators can create tasks');
            return;
        }
        setEditingTask(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingTask(null);
        fetchData();
    };

    const handleExportCSV = () => {
        if (tasks.length === 0) {
            showToast.error('No data to export');
            return;
        }
        exportTasksToCSV(tasks);
        showToast.success('Task data exported successfully!');
    };

    const handleExportPDF = () => {
        if (tasks.length === 0) {
            showToast.error('No data to export');
            return;
        }
        generateTaskReport(tasks);
        showToast.success('PDF report generated successfully!');
    };

    const handleImport = async (data: any[]) => {
        const toastId = showToast.loading('Importing tasks...');
        let successCount = 0;
        let errorCount = 0;

        for (const row of data) {
            try {
                const taskData = {
                    title: row['Title'] || row.title,
                    description: row['Description'] || row.description || '',
                    status: row['Status'] || row.status || 'pending',
                    priority: row['Priority'] || row.priority || 'medium',
                    dueDate: row['Due Date'] || row.dueDate || null,
                    employeeId: row['Employee ID'] || row.employeeId,
                };
                await api.post('/tasks', taskData);
                successCount++;
            } catch (error) {
                errorCount++;
                console.error('Error importing row:', error);
            }
        }

        showToast.dismiss(toastId);
        if (successCount > 0) {
            showToast.success(`Successfully imported ${successCount} tasks`);
            fetchData();
        }
        if (errorCount > 0) {
            showToast.error(`Failed to import ${errorCount} tasks`);
        }
    };

    const statusConfig: Record<string, {
        icon: any;
        bg: string;
        border: string;
        text: string;
        iconColor: string;
    }> = {
        pending: {
            icon: Clock,
            bg: 'bg-yellow-50',
            border: 'border-l-yellow-400',
            text: 'text-yellow-700',
            iconColor: 'text-yellow-500'
        },
        'in-progress': {
            icon: AlertCircle,
            bg: 'bg-blue-50',
            border: 'border-l-blue-400',
            text: 'text-blue-700',
            iconColor: 'text-blue-500'
        },
        completed: {
            icon: CheckCircle2,
            bg: 'bg-green-50',
            border: 'border-l-green-400',
            text: 'text-green-700',
            iconColor: 'text-green-500'
        },
        cancelled: {
            icon: XCircle,
            bg: 'bg-red-50',
            border: 'border-l-red-400',
            text: 'text-red-700',
            iconColor: 'text-red-500'
        },
    };

    const priorityConfig: Record<string, { bg: string; text: string; dot: string }> = {
        low: {bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500'},
        medium: {bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500'},
        high: {bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500'},
        urgent: {bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500'},
    };

    const columns = [
        {id: 'pending', title: 'Pending', color: 'yellow'},
        {id: 'in-progress', title: 'In Progress', color: 'blue'},
        {id: 'completed', title: 'Completed', color: 'green'},
        {id: 'cancelled', title: 'Cancelled', color: 'red'},
    ];

    const getTasksByStatus = (status: string) => {
        return tasks.filter(task => task.status === status);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                <SkeletonKanban/>
            </div>
        );
    }

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
                            {isAdmin ? 'Task Management' : 'My Tasks'}
                        </h1>
                        <p className="text-gray-600">
                            {isAdmin
                                ? 'Drag and drop tasks to update their status'
                                : 'View and track your assigned tasks'}
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
                            </>
                        )}
                        {isAdmin && (
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={handleAdd}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center"
                            >
                                <Plus className="w-5 h-5 mr-2"/>
                                Create Task
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="px-8">
                {/* Filters */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.1}}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                        >
                            <option value="">All Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                        <div
                            className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                            <span className="text-sm font-semibold text-gray-700">Total Tasks:</span>
                            <span className="text-lg font-bold text-gray-900">{tasks.length}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Kanban Board */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {columns.map((column, columnIndex) => {
                            const columnTasks = getTasksByStatus(column.id);
                            const config = statusConfig[column.id];
                            const Icon = config.icon;

                            return (
                                <motion.div
                                    key={column.id}
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: columnIndex * 0.1}}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col"
                                    style={{minHeight: '600px'}}
                                >
                                    {/* Column Header */}
                                    <div className={`${config.bg} px-6 py-4 border-b ${config.border} border-l-4`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Icon className={`w-5 h-5 ${config.iconColor} mr-2`}/>
                                                <h3 className={`font-bold ${config.text}`}>
                                                    {column.title}
                                                </h3>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text} border ${config.border}`}>
                                                {columnTasks.length}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Droppable Area */}
                                    <Droppable droppableId={column.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`p-4 space-y-3 flex-1 overflow-y-auto transition-colors ${
                                                    snapshot.isDraggingOver ? 'bg-blue-50' : ''
                                                }`}
                                            >
                                                <AnimatePresence>
                                                    {columnTasks.length === 0 ? (
                                                        <motion.div
                                                            initial={{opacity: 0}}
                                                            animate={{opacity: 1}}
                                                            exit={{opacity: 0}}
                                                            className="text-center py-12 text-gray-400"
                                                        >
                                                            <Icon className="w-12 h-12 mx-auto mb-2 opacity-30"/>
                                                            <p className="text-sm">No tasks</p>
                                                        </motion.div>
                                                    ) : (
                                                        columnTasks.map((task, index) => (
                                                            <Draggable
                                                                key={task.id}
                                                                draggableId={task.id}
                                                                index={index}
                                                                isDragDisabled={!isAdmin}
                                                            >
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={`${config.bg} rounded-xl p-4 border-l-4 ${config.border} hover:shadow-md transition-all cursor-pointer group ${
                                                                            snapshot.isDragging ? 'shadow-2xl scale-105' : ''
                                                                        }`}
                                                                    >
                                                                        <div
                                                                            className="flex items-start justify-between mb-3">
                                                                            <h4 className="font-semibold text-gray-900 text-sm flex-1 pr-2">
                                                                                {task.title}
                                                                            </h4>
                                                                            <span
                                                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityConfig[task.priority].bg} ${priorityConfig[task.priority].text} flex items-center whitespace-nowrap`}>
                                                                                <span
                                                                                    className={`w-1.5 h-1.5 rounded-full ${priorityConfig[task.priority].dot} mr-1.5`}></span>
                                                                                {task.priority}
                                                                            </span>
                                                                        </div>

                                                                        {task.description && (
                                                                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                                                                {task.description}
                                                                            </p>
                                                                        )}

                                                                        {task.employee && (
                                                                            <div
                                                                                className="flex items-center text-xs text-gray-600 mb-2">
                                                                                <User className="w-3 h-3 mr-1.5"/>
                                                                                <span className="truncate">
                                                                                    {task.employee.firstName} {task.employee.lastName}
                                                                                </span>
                                                                            </div>
                                                                        )}

                                                                        {task.dueDate && (
                                                                            <div
                                                                                className="flex items-center text-xs text-gray-600 mb-3">
                                                                                <Calendar className="w-3 h-3 mr-1.5"/>
                                                                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                                                            </div>
                                                                        )}

                                                                        {isAdmin && (
                                                                            <div
                                                                                className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                <motion.button
                                                                                    whileHover={{scale: 1.1}}
                                                                                    whileTap={{scale: 0.9}}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleEdit(task);
                                                                                    }}
                                                                                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                                                >
                                                                                    <Edit className="w-3.5 h-3.5"/>
                                                                                </motion.button>
                                                                                <motion.button
                                                                                    whileHover={{scale: 1.1}}
                                                                                    whileTap={{scale: 0.9}}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleDelete(task.id);
                                                                                    }}
                                                                                    className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                                                >
                                                                                    <Trash2 className="w-3.5 h-3.5"/>
                                                                                </motion.button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))
                                                    )}
                                                </AnimatePresence>
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </motion.div>
                            );
                        })}
                    </div>
                </DragDropContext>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showModal && (
                    <TaskModal
                        task={editingTask}
                        employees={employees}
                        onClose={handleModalClose}
                    />
                )}
                {showImportModal && (
                    <ImportModal
                        type="tasks"
                        onClose={() => setShowImportModal(false)}
                        onImport={handleImport}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default TasksNew;
