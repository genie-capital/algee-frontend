export type ValidationRule = {
    test: (value: any, allValues?: Record<string, any>) => boolean;
    message: string;
  };
  
  export type ValidationRules = {
    [key: string]: ValidationRule[];
  };
  
  export type ValidationErrors = {
    [key: string]: string;
  };
  
  export const validateForm = (values: Record<string, any>, rules: ValidationRules): ValidationErrors => {
    const errors: ValidationErrors = {};
  
    Object.entries(rules).forEach(([field, fieldRules]) => {
      // Get the value to validate
      const value = values[field];
  
      // Apply each rule until one fails
      for (const rule of fieldRules) {
        if (!rule.test(value, values)) {
          errors[field] = rule.message;
          break;
        }
      }
    });
  
    return errors;
  };
  
  // Common validation rules
  export const required = (message = 'This field is required'): ValidationRule => ({
    test: (value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      return true;
    },
    message
  });
  
  export const email = (message = 'Please enter a valid email address'): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // Let required handle empty values
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    message
  });
  
  export const minLength = (length: number, message = `Must be at least ${length} characters`): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // Let required handle empty values
      return value.length >= length;
    },
    message
  });
  
  export const maxLength = (length: number, message = `Must be no more than ${length} characters`): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // Let required handle empty values
      return value.length <= length;
    },
    message
  });
  
  export const matches = (pattern: RegExp, message = 'Invalid format'): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // Let required handle empty values
      return pattern.test(value);
    },
    message
  });
  
  export const passwordsMatch = (passwordField: string, message = 'Passwords do not match'): ValidationRule => ({
    test: (value, allValues) => {
      if (!value) return true; // Let required handle empty values
      return value === allValues?.[passwordField];
    },
    message
  });