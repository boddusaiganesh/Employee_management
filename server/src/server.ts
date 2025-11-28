import express, {Request, Response} from 'express';
import cors from 'cors';
import {config} from './config/env';
import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employee.routes';
import taskRoutes from './routes/task.routes';
import {errorHandler} from './middleware/errorHandler';

const app = express();
const PORT = config.port;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || '*']
        : '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Employee Management API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            employees: '/api/employees',
            tasks: '/api/tasks'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
