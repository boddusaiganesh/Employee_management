import express, {Request, Response} from 'express';
import cors from 'cors';
import {config} from './config/env';
import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employee.routes';
import taskRoutes from './routes/task.routes';
import {errorHandler} from './middleware/errorHandler';

const app = express();
const PORT = config.port;

// Middleware - CORS Configuration
const allowedOrigins: string[] = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://employee-management-rcej.vercel.app'
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

// Enable CORS for all routes
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Length', 'X-Request-Id'],
    preflightContinue: false,
    optionsSuccessStatus: 204
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
