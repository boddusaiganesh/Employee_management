import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {Employee, Task, Stats, TaskStats} from '../types';

export const generateDashboardReport = (
    employeeStats: Stats,
    taskStats: TaskStats,
    _employees: Employee[],
    _tasks: Task[]
) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235); // Blue color
    doc.text('Employee Management System', 14, 20);
    doc.text('Dashboard Report', 14, 30);

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 38);

    // Employee Statistics
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Employee Statistics', 14, 50);

    const employeeStatsData = [
        ['Total Employees', employeeStats.totalEmployees.toString()],
        ['Active Employees', employeeStats.activeEmployees.toString()],
        ['Inactive Employees', employeeStats.inactiveEmployees.toString()],
    ];

    autoTable(doc, {
        startY: 55,
        head: [['Metric', 'Value']],
        body: employeeStatsData,
        theme: 'grid',
        headStyles: {fillColor: [37, 99, 235]},
    });

    // Department Breakdown
    doc.setFontSize(14);
    doc.text('Department Breakdown', 14, (doc as any).lastAutoTable.finalY + 15);

    const deptData = employeeStats.departmentStats.map(dept => [
        dept.department,
        dept._count.toString()
    ]);

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Department', 'Employees']],
        body: deptData,
        theme: 'striped',
        headStyles: {fillColor: [37, 99, 235]},
    });

    // Task Statistics
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Task Statistics', 14, 20);

    const taskStatsData = [
        ['Total Tasks', taskStats.totalTasks.toString()],
        ['Overdue Tasks', taskStats.overdueTasks.toString()],
    ];

    autoTable(doc, {
        startY: 25,
        head: [['Metric', 'Value']],
        body: taskStatsData,
        theme: 'grid',
        headStyles: {fillColor: [139, 92, 246]}, // Purple
    });

    // Task Status Breakdown
    doc.setFontSize(14);
    doc.text('Task Status Breakdown', 14, (doc as any).lastAutoTable.finalY + 15);

    const statusData = taskStats.statusStats.map(status => [
        status.status.replace('-', ' ').toUpperCase(),
        status._count.toString()
    ]);

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Status', 'Tasks']],
        body: statusData,
        theme: 'striped',
        headStyles: {fillColor: [139, 92, 246]},
    });

    // Priority Breakdown
    doc.setFontSize(14);
    doc.text('Priority Breakdown', 14, (doc as any).lastAutoTable.finalY + 15);

    const priorityData = taskStats.priorityStats.map(priority => [
        priority.priority.toUpperCase(),
        priority._count.toString()
    ]);

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Priority', 'Tasks']],
        body: priorityData,
        theme: 'striped',
        headStyles: {fillColor: [139, 92, 246]},
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            {align: 'center'}
        );
    }

    // Save
    doc.save(`dashboard_report_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateEmployeeReport = (employees: Employee[]) => {
    const doc = new jsPDF('landscape');

    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.text('Employee Directory Report', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Total Employees: ${employees.length}`, 14, 34);

    const tableData = employees.map(emp => [
        `${emp.firstName} ${emp.lastName}`,
        emp.email,
        emp.department,
        emp.position,
        `$${emp.salary.toLocaleString()}`,
        emp.status,
    ]);

    autoTable(doc, {
        startY: 40,
        head: [['Name', 'Email', 'Department', 'Position', 'Salary', 'Status']],
        body: tableData,
        theme: 'striped',
        headStyles: {fillColor: [37, 99, 235]},
        styles: {fontSize: 8},
    });

    doc.save(`employees_report_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateTaskReport = (tasks: Task[]) => {
    const doc = new jsPDF('landscape');

    doc.setFontSize(18);
    doc.setTextColor(139, 92, 246);
    doc.text('Task Report', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Total Tasks: ${tasks.length}`, 14, 34);

    const tableData = tasks.map(task => [
        task.title,
        task.status.replace('-', ' '),
        task.priority,
        task.employee ? `${task.employee.firstName} ${task.employee.lastName}` : 'N/A',
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A',
    ]);

    autoTable(doc, {
        startY: 40,
        head: [['Title', 'Status', 'Priority', 'Assigned To', 'Due Date']],
        body: tableData,
        theme: 'striped',
        headStyles: {fillColor: [139, 92, 246]},
        styles: {fontSize: 9},
    });

    doc.save(`tasks_report_${new Date().toISOString().split('T')[0]}.pdf`);
};
