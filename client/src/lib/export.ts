import {Employee, Task} from '../types';
import Papa from 'papaparse';

export const exportToCSV = (data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportEmployeesToCSV = (employees: Employee[]) => {
    const data = employees.map((emp) => ({
        'First Name': emp.firstName,
        'Last Name': emp.lastName,
        'Email': emp.email,
        'Phone': emp.phone || '',
        'Department': emp.department,
        'Position': emp.position,
        'Salary': emp.salary,
        'Hire Date': new Date(emp.hireDate).toLocaleDateString(),
        'Status': emp.status,
    }));
    exportToCSV(data, 'employees');
};

export const exportTasksToCSV = (tasks: Task[]) => {
    const data = tasks.map((task) => ({
        'Title': task.title,
        'Description': task.description || '',
        'Status': task.status,
        'Priority': task.priority,
        'Due Date': task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
        'Employee': task.employee ? `${task.employee.firstName} ${task.employee.lastName}` : '',
        'Department': task.employee?.department || '',
        'Created At': new Date(task.createdAt).toLocaleDateString(),
    }));
    exportToCSV(data, 'tasks');
};

export const parseCSV = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error) => {
                reject(error);
            },
        });
    });
};
