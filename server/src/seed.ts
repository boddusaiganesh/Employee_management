import bcrypt from 'bcryptjs';
import prisma from './lib/prisma';

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: {email: 'admin@example.com'},
        update: {},
        create: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'admin'
        }
    });

    console.log('✅ Admin user created:', admin.email);

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);

    const user = await prisma.user.upsert({
        where: {email: 'user@example.com'},
        update: {},
        create: {
            email: 'user@example.com',
            password: userPassword,
            name: 'Regular User',
            role: 'user'
        }
    });

    console.log('✅ Regular user created:', user.email);

    // Create employees
    const employees = [
        {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@company.com',
            phone: '+1234567890',
            department: 'Engineering',
            position: 'Senior Software Engineer',
            salary: 120000,
            hireDate: new Date('2022-01-15'),
            status: 'active'
        },
        {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@company.com',
            phone: '+1234567891',
            department: 'Marketing',
            position: 'Marketing Manager',
            salary: 95000,
            hireDate: new Date('2021-06-20'),
            status: 'active'
        },
        {
            firstName: 'Michael',
            lastName: 'Johnson',
            email: 'michael.johnson@company.com',
            phone: '+1234567892',
            department: 'Sales',
            position: 'Sales Representative',
            salary: 75000,
            hireDate: new Date('2023-03-10'),
            status: 'active'
        },
        {
            firstName: 'Emily',
            lastName: 'Williams',
            email: 'emily.williams@company.com',
            phone: '+1234567893',
            department: 'HR',
            position: 'HR Manager',
            salary: 85000,
            hireDate: new Date('2020-09-05'),
            status: 'active'
        },
        {
            firstName: 'David',
            lastName: 'Brown',
            email: 'david.brown@company.com',
            phone: '+1234567894',
            department: 'Engineering',
            position: 'Frontend Developer',
            salary: 90000,
            hireDate: new Date('2022-11-01'),
            status: 'active'
        },
        {
            firstName: 'Sarah',
            lastName: 'Davis',
            email: 'sarah.davis@company.com',
            phone: '+1234567895',
            department: 'Finance',
            position: 'Financial Analyst',
            salary: 80000,
            hireDate: new Date('2021-04-15'),
            status: 'active'
        },
        {
            firstName: 'Robert',
            lastName: 'Wilson',
            email: 'robert.wilson@company.com',
            phone: '+1234567896',
            department: 'Engineering',
            position: 'DevOps Engineer',
            salary: 110000,
            hireDate: new Date('2022-07-20'),
            status: 'on-leave'
        },
        {
            firstName: 'Lisa',
            lastName: 'Anderson',
            email: 'lisa.anderson@company.com',
            phone: '+1234567897',
            department: 'Design',
            position: 'UI/UX Designer',
            salary: 85000,
            hireDate: new Date('2023-01-10'),
            status: 'active'
        }
    ];

    const createdEmployees = [];
    for (const employee of employees) {
        const created = await prisma.employee.upsert({
            where: {email: employee.email},
            update: {},
            create: employee
        });
        createdEmployees.push(created);
        console.log(`✅ Employee created: ${created.firstName} ${created.lastName}`);
    }

    // Create tasks
    const tasks = [
        {
            title: 'Implement user authentication',
            description: 'Add JWT-based authentication to the API',
            status: 'completed',
            priority: 'high',
            dueDate: new Date('2024-01-20'),
            employeeId: createdEmployees[0].id
        },
        {
            title: 'Design new landing page',
            description: 'Create wireframes and mockups for the new landing page',
            status: 'in-progress',
            priority: 'high',
            dueDate: new Date('2024-02-15'),
            employeeId: createdEmployees[7].id
        },
        {
            title: 'Update marketing campaign',
            description: 'Review and update Q1 marketing campaign materials',
            status: 'pending',
            priority: 'medium',
            dueDate: new Date('2024-02-28'),
            employeeId: createdEmployees[1].id
        },
        {
            title: 'Prepare sales report',
            description: 'Compile monthly sales report for management',
            status: 'completed',
            priority: 'medium',
            dueDate: new Date('2024-01-31'),
            employeeId: createdEmployees[2].id
        },
        {
            title: 'Conduct employee training',
            description: 'Organize and conduct onboarding training for new hires',
            status: 'in-progress',
            priority: 'high',
            dueDate: new Date('2024-02-10'),
            employeeId: createdEmployees[3].id
        },
        {
            title: 'Refactor frontend code',
            description: 'Improve code structure and performance',
            status: 'in-progress',
            priority: 'medium',
            dueDate: new Date('2024-02-20'),
            employeeId: createdEmployees[4].id
        },
        {
            title: 'Financial audit preparation',
            description: 'Prepare documents for annual financial audit',
            status: 'pending',
            priority: 'urgent',
            dueDate: new Date('2024-02-05'),
            employeeId: createdEmployees[5].id
        },
        {
            title: 'Setup CI/CD pipeline',
            description: 'Configure automated deployment pipeline',
            status: 'pending',
            priority: 'high',
            dueDate: new Date('2024-02-25'),
            employeeId: createdEmployees[6].id
        },
        {
            title: 'Database optimization',
            description: 'Optimize database queries and indexing',
            status: 'pending',
            priority: 'medium',
            dueDate: new Date('2024-03-01'),
            employeeId: createdEmployees[0].id
        },
        {
            title: 'User testing session',
            description: 'Conduct user testing for new features',
            status: 'pending',
            priority: 'low',
            dueDate: new Date('2024-03-10'),
            employeeId: createdEmployees[7].id
        }
    ];

    for (const task of tasks) {
        const created = await prisma.task.create({
            data: task
        });
        console.log(`✅ Task created: ${created.title}`);
    }

    console.log('🎉 Database seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
