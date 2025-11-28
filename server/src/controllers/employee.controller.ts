import {Response} from 'express';
import {AuthRequest} from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

export const getAllEmployees = async (req: AuthRequest, res: Response) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            department = '',
            status = '',
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        // Build where clause
        const where: any = {};

        if (search) {
            where.OR = [
                {firstName: {contains: search as string}},
                {lastName: {contains: search as string}},
                {email: {contains: search as string}},
                {position: {contains: search as string}}
            ];
        }

        if (department) {
            where.department = department;
        }

        if (status) {
            where.status = status;
        }

        // Get employees with pagination
        const [employees, total] = await Promise.all([
            prisma.employee.findMany({
                where,
                skip,
                take,
                orderBy: {[sortBy as string]: order},
                include: {
                    tasks: {
                        select: {
                            id: true,
                            title: true,
                            status: true,
                            priority: true
                        }
                    }
                }
            }),
            prisma.employee.count({where})
        ]);

        res.json({
            success: true,
            data: employees,
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

export const getEmployeeById = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.params;

        const employee = await prisma.employee.findUnique({
            where: {id},
            include: {
                tasks: {
                    orderBy: {createdAt: 'desc'}
                }
            }
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.json({
            success: true,
            data: employee
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createEmployee = async (req: AuthRequest, res: Response) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            department,
            position,
            salary,
            hireDate,
            status,
            avatar
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !department || !position || !salary || !hireDate) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Check if email already exists
        const existingEmployee = await prisma.employee.findUnique({
            where: {email}
        });

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: 'Employee with this email already exists'
            });
        }

        const employee = await prisma.employee.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                department,
                position,
                salary: parseFloat(salary),
                hireDate: new Date(hireDate),
                status: status || 'active',
                avatar
            }
        });

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: employee
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateEmployee = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.params;
        const updateData = req.body;

        // Check if employee exists
        const existingEmployee = await prisma.employee.findUnique({
            where: {id}
        });

        if (!existingEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // If email is being updated, check if it's already taken
        if (updateData.email && updateData.email !== existingEmployee.email) {
            const emailTaken = await prisma.employee.findUnique({
                where: {email: updateData.email}
            });

            if (emailTaken) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
        }

        // Convert salary and hireDate if provided
        if (updateData.salary) {
            updateData.salary = parseFloat(updateData.salary);
        }
        if (updateData.hireDate) {
            updateData.hireDate = new Date(updateData.hireDate);
        }

        const employee = await prisma.employee.update({
            where: {id},
            data: updateData
        });

        res.json({
            success: true,
            message: 'Employee updated successfully',
            data: employee
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteEmployee = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.params;

        // Check if employee exists
        const employee = await prisma.employee.findUnique({
            where: {id}
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        await prisma.employee.delete({
            where: {id}
        });

        res.json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getEmployeeStats = async (req: AuthRequest, res: Response) => {
    try {
        const [
            totalEmployees,
            activeEmployees,
            departmentStats,
            statusStats
        ] = await Promise.all([
            prisma.employee.count(),
            prisma.employee.count({where: {status: 'active'}}),
            prisma.employee.groupBy({
                by: ['department'],
                _count: true
            }),
            prisma.employee.groupBy({
                by: ['status'],
                _count: true
            })
        ]);

        res.json({
            success: true,
            data: {
                totalEmployees,
                activeEmployees,
                inactiveEmployees: totalEmployees - activeEmployees,
                departmentStats,
                statusStats
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
