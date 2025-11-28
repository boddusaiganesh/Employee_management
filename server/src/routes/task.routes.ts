import express from 'express';
import {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByEmployee,
    getTaskStats
} from '../controllers/task.controller';
import {authenticate, authorizeAdmin} from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public routes (all authenticated users can access)
router.get('/stats', getTaskStats);
router.get('/employee/:employeeId', getTasksByEmployee);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);

// Admin-only routes (only admins can create, update, delete tasks)
router.post('/', authorizeAdmin, createTask);
router.put('/:id', authorizeAdmin, updateTask);
router.delete('/:id', authorizeAdmin, deleteTask);

export default router;
