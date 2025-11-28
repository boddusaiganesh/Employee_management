import express from 'express';
import {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeStats
} from '../controllers/employee.controller';
import {authenticate, authorizeAdmin} from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public routes (all authenticated users can access)
router.get('/stats', getEmployeeStats);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);

// Admin-only routes (only admins can create, update, delete)
router.post('/', authorizeAdmin, createEmployee);
router.put('/:id', authorizeAdmin, updateEmployee);
router.delete('/:id', authorizeAdmin, deleteEmployee);

export default router;
