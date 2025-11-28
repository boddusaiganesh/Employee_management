export interface ValidationError {
    field: string;
    message: string;
}

export const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email format';
    return null;
};

export const validatePhone = (phone: string): string | null => {
    if (!phone) return null; // Phone is optional
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) return 'Invalid phone format';
    if (phone.replace(/\D/g, '').length < 10) return 'Phone must be at least 10 digits';
    return null;
};

export const validateRequired = (value: any, fieldName: string): string | null => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return `${fieldName} is required`;
    }
    return null;
};

export const validateSalary = (salary: number | string): string | null => {
    const numSalary = typeof salary === 'string' ? parseFloat(salary) : salary;
    if (isNaN(numSalary)) return 'Salary must be a number';
    if (numSalary < 0) return 'Salary cannot be negative';
    if (numSalary > 10000000) return 'Salary seems unreasonably high';
    return null;
};

export const validateDate = (date: string, fieldName: string): string | null => {
    if (!date) return `${fieldName} is required`;
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return `Invalid ${fieldName.toLowerCase()}`;
    return null;
};

export const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
};

export const validateEmployeeForm = (data: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    const firstNameError = validateRequired(data.firstName, 'First Name');
    if (firstNameError) errors.push({field: 'firstName', message: firstNameError});

    const lastNameError = validateRequired(data.lastName, 'Last Name');
    if (lastNameError) errors.push({field: 'lastName', message: lastNameError});

    const emailError = validateEmail(data.email);
    if (emailError) errors.push({field: 'email', message: emailError});

    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.push({field: 'phone', message: phoneError});

    const departmentError = validateRequired(data.department, 'Department');
    if (departmentError) errors.push({field: 'department', message: departmentError});

    const positionError = validateRequired(data.position, 'Position');
    if (positionError) errors.push({field: 'position', message: positionError});

    const salaryError = validateSalary(data.salary);
    if (salaryError) errors.push({field: 'salary', message: salaryError});

    const hireDateError = validateDate(data.hireDate, 'Hire Date');
    if (hireDateError) errors.push({field: 'hireDate', message: hireDateError});

    return errors;
};

export const validateTaskForm = (data: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    const titleError = validateRequired(data.title, 'Title');
    if (titleError) errors.push({field: 'title', message: titleError});

    const employeeError = validateRequired(data.employeeId, 'Employee');
    if (employeeError) errors.push({field: 'employeeId', message: employeeError});

    if (data.dueDate) {
        const dueDateError = validateDate(data.dueDate, 'Due Date');
        if (dueDateError) errors.push({field: 'dueDate', message: dueDateError});
    }

    return errors;
};
