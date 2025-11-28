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
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://employee-management-rcej.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? allowedOrigins
        : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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

const HOST = process.env.HOST || '0.0.0.0';

app.listen(Number(PORT), HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});
