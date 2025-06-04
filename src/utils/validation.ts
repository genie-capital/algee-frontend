export type ValidationRule = {
  validate: (value: any, formData?: any) => string;
};

export type ValidationRules = {
  [key: string]: ValidationRule[];
};

export type ValidationErrors = {
  [key: string]: string;
};

// Helper function to get nested object values
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

export const validateForm = (data: Record<string, any>, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach(fieldName => {
    const value = fieldName.includes('.') 
      ? fieldName.split('.').reduce((obj, key) => obj?.[key], data)
      : data[fieldName];
    
    const fieldRules = rules[fieldName];
    
    for (const rule of fieldRules) {
      const validationResult = rule.validate(value, data);
      if (validationResult) {
        errors[fieldName] = validationResult;
        break;
      }
    }
  });

  return errors;
};

// Common validation rules
export const required = (message: string): ValidationRule => ({
  validate: (value: any) => (!value ? message : '')
});

export const email = (): ValidationRule => ({
  validate: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !value || emailRegex.test(value) ? '' : 'Please enter a valid email address';
  }
});

export const minLength = (length: number, message: string): ValidationRule => ({
  validate: (value: string) => (!value || value.length >= length ? '' : message)
});

export const maxLength = (length: number, message = `Must be no more than ${length} characters`): ValidationRule => ({
  validate: (value: string) => (!value || value.length <= length ? '' : message)
});

export const matches = (pattern: RegExp, message: string): ValidationRule => ({
  validate: (value: string) => (!value || pattern.test(value) ? '' : message)
});

export const passwordsMatch = (passwordField: string, message: string): ValidationRule => ({
  validate: (value: string, formData: any) => {
    if (!value || !formData) return '';
    
    // Handle both nested and flat object structures
    const passwordValue = passwordField.includes('.') 
      ? getNestedValue(formData, passwordField)
      : formData[passwordField];
    
    return value === passwordValue ? '' : message;
  }
});

export const customValidation = (validator: (value: any, formData?: any) => string): ValidationRule => ({
  validate: validator
});