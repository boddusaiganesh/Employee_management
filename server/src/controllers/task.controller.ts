import {Response} from 'express';
import {AuthRequest} from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

export const getAllTasks = async (req: AuthRequest, res: Response) => {
    try {
        const {
            page = 1,
            limit = 10,
            status = '',
            priority = '',
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (priority) {
            where.priority = priority;
        }

        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                skip,
                take,
                orderBy: {[sortBy as string]: order},
                include: {
                    employee: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            department: true
                        }
                    }
                }
            }),
            prisma.task.count({where})
        ]);

        res.json({
            success: true,
            data: tasks,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.params;

        const task = await prisma.task.findUnique({
            where: {id},
            include: {
                employee: true
            }
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.json({
            success: true,
            data: task
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getTasksByEmployee = async (req: AuthRequest, res: Response) => {
    try {
        const {employeeId} = req.params;

        const tasks = await prisma.task.findMany({
            where: {employeeId},
            orderBy: {createdAt: 'desc'},
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        res.json({
            success: true,
            data: tasks
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            dueDate,
            employeeId
        } = req.body;

        // Validate required fields
        if (!title || !employeeId) {
            return res.status(400).json({
                success: false,
                message: 'Title and employeeId are required'
            });
        }

        // Check if employee exists
        const employee = await prisma.employee.findUnique({
            where: {id: employeeId}
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: status || 'pending',
                priority: priority || 'medium',
                dueDate: dueDate ? new Date(dueDate) : null,
                employeeId
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.params;
        const updateData = req.body;

        // Check if task exists
        const existingTask = await prisma.task.findUnique({
            where: {id}
        });

        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // If employeeId is being updated, check if employee exists
        if (updateData.employeeId && updateData.employeeId !== existingTask.employeeId) {
            const employee = await prisma.employee.findUnique({
                where: {id: updateData.employeeId}
            });

            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }
        }

        // Convert dueDate if provided
        if (updateData.dueDate) {
            updateData.dueDate = new Date(updateData.dueDate);
        }

        const task = await prisma.task.update({
            where: {id},
            data: updateData,
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Task updated successfully',
            data: task
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.params;

        // Check if task exists
        const task = await prisma.task.findUnique({
            where: {id}
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        await prisma.task.delete({
            where: {id}
        });

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getTaskStats = async (req: AuthRequest, res: Response) => {
    try {
        const [
            totalTasks,
            statusStats,
            priorityStats,
            overdueTasks
        ] = await Promise.all([
            prisma.task.count(),
            prisma.task.groupBy({
                by: ['status'],
                _count: true
            }),
            prisma.task.groupBy({
                by: ['priority'],
                _count: true
            }),
            prisma.task.count({
                where: {
                    dueDate: {
                        lt: new Date()
                    },
                    status: {
                        not: 'completed'
                    }
                }
            })
        ]);

        res.json({
            success: true,
            data: {
                totalTasks,
                statusStats,
                priorityStats,
                overdueTasks
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
