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
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // Allow all Vercel deployments and localhost
        if (
            origin.includes('vercel.app') ||
            origin.includes('localhost') ||
            origin.includes('127.0.0.1')
        ) {
            return callback(null, true);
        }

        // In development, allow all origins
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }

        // Otherwise allow it (can be restricted later)
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Length', 'X-Request-Id'],
    preflightContinue: false,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

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
