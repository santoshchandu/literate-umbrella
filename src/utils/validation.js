// Form validation utilities

export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email format';
    return '';
  },

  password: (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  },

  name: (name) => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    return '';
  },

  phone: (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) return 'Phone number is required';
    if (!phoneRegex.test(phone)) return 'Phone number must be 10 digits';
    return '';
  },

  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return '';
  },

  minLength: (value, min, fieldName = 'This field') => {
    if (!value || value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return '';
  },

  maxLength: (value, max, fieldName = 'This field') => {
    if (value && value.length > max) {
      return `${fieldName} must not exceed ${max} characters`;
    }
    return '';
  },

  number: (value, fieldName = 'This field') => {
    if (isNaN(value)) {
      return `${fieldName} must be a number`;
    }
    return '';
  },

  positiveNumber: (value, fieldName = 'This field') => {
    if (isNaN(value) || value <= 0) {
      return `${fieldName} must be a positive number`;
    }
    return '';
  },

  date: (date, fieldName = 'Date') => {
    if (!date) return `${fieldName} is required`;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return `${fieldName} must be today or in the future`;
    }
    return '';
  },

  dateRange: (startDate, endDate) => {
    if (!startDate) return 'Start date is required';
    if (!endDate) return 'End date is required';

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) return 'Start date must be today or in the future';
    if (end < start) return 'End date must be after start date';

    return '';
  }
};

// Validate entire form
export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];

    for (let rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return errors;
};

// Check if form has errors
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};
