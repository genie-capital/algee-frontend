import { useState, useCallback } from 'react';
import { validateForm, ValidationRules, ValidationErrors } from '../utils/validation';

type FormHandlerReturn<T> = {
  formData: T;
  formErrors: ValidationErrors;
  loading: boolean;
  setFormData: (data: Partial<T>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  validateField: (fieldName: keyof T) => boolean;
  validateAllFields: () => boolean;
  resetForm: () => void;
  handleSubmit: (onSubmit: () => Promise<void>, onValidationFail?: () => void) => (e: React.FormEvent) => void;
};

export const useForm = <T extends Record<string, any>>(
  initialData: T,
  validationRules: ValidationRules
): FormHandlerReturn<T> => {
  const [formData, setFormDataState] = useState<T>(initialData);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const setFormData = useCallback((data: Partial<T>) => {
    setFormDataState(prev => ({ ...prev, ...data }));
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    const newValue = type === 'checkbox' ? checked : value;
    
    // Handle nested fields (e.g., "address.street")
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormDataState(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: newValue
        }
      }));
    } else {
      setFormDataState(prev => ({
        ...prev,
        [name]: newValue
      }));
    }
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [formErrors]);

  const validateField = useCallback((fieldName: keyof T) => {
    if (!validationRules[fieldName as string]) return true;
    
    const fieldErrors = validateForm(
      formData,
      { [fieldName as string]: validationRules[fieldName as string] }
    );
    
    setFormErrors(prev => ({
      ...prev,
      ...fieldErrors
    }));
    
    return !fieldErrors[fieldName as string];
  }, [formData, validationRules]);

  const validateAllFields = useCallback(() => {
    const errors = validateForm(formData, validationRules);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, validationRules]);

  const resetForm = useCallback(() => {
    setFormDataState(initialData);
    setFormErrors({});
  }, [initialData]);

  const handleSubmit = useCallback(
    (onSubmit: () => Promise<void>, onValidationFail?: () => void) => async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateAllFields()) {
        onValidationFail?.();
        return;
      }
      
      try {
        setLoading(true);
        await onSubmit();
      } finally {
        setLoading(false);
      }
    },
    [validateAllFields]
  );

  return {
    formData,
    formErrors,
    loading,
    setFormData,
    handleChange,
    validateField,
    validateAllFields,
    resetForm,
    handleSubmit
  };
};