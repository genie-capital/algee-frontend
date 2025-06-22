import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { validateForm, required, email, minLength } from '../../utils/validation';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const RegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const validationRules = {
    name: [
      required('Institution name is required'),
      minLength(2, 'Institution name must be at least 2 characters')
    ],
    email: [
      required('Email is required'),
      email()
    ],
    password: [
      required('Password is required'),
      minLength(8, 'Password must be at least 8 characters')
    ],
    confirmPassword: [
      required('Please confirm your password')
    ],
    acceptTerms: [
      required('You must accept the terms and conditions')
    ]
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear global error when user makes changes
    if (authError) clearError();
  };

  const validateField = (fieldName: keyof FormData): boolean => {
    const rules = validationRules[fieldName];
    if (!rules) return true;

    // Handle password confirmation separately
    if (fieldName === 'confirmPassword') {
      if (!formData.confirmPassword) {
        setFormErrors(prev => ({ ...prev, confirmPassword: 'Please confirm your password' }));
        return false;
      }
      if (formData.confirmPassword !== formData.password) {
        setFormErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        return false;
      }
      setFormErrors(prev => ({ ...prev, confirmPassword: '' }));
      return true;
    }

    // Handle accept terms separately
    if (fieldName === 'acceptTerms') {
      if (!formData.acceptTerms) {
        setFormErrors(prev => ({ ...prev, acceptTerms: 'You must accept the terms and conditions' }));
        return false;
      }
      setFormErrors(prev => ({ ...prev, acceptTerms: '' }));
      return true;
    }

    // Handle other fields with standard validation rules
    for (const rule of rules) {
      const error = rule.validate(formData[fieldName], formData);
      if (error) {
        setFormErrors(prev => ({ ...prev, [fieldName]: error }));
        return false;
      }
    }
    
    setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
    return true;
  };

  const validateForm = (): boolean => {
    const fields = Object.keys(validationRules) as (keyof FormData)[];
    const results = fields.map(field => validateField(field));
    return results.every(result => result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send only the fields that the backend expects
      const institutionData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      
      await register(institutionData);
      
      // Show success message
      alert(
        'Registration successful!\n\n' +
        'Your institution account has been created and is pending approval. ' +
        'You will receive an email at ' + formData.email + ' once your account is approved by the administrators.\n\n' +
        'Please note that your account is currently inactive until approved.'
      );
      
      // Redirect to login page
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {authError && <ErrorAlert message={authError} onDismiss={clearError} />}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Institution Name *
          </label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            className={`mt-1 block w-full px-4 py-3 border ${
              formErrors.name ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
            value={formData.name} 
            onChange={handleChange} 
            onBlur={() => validateField('name')}
            placeholder="Enter your institution name"
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Business Email *
          </label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            className={`mt-1 block w-full px-4 py-3 border ${
              formErrors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
            value={formData.email} 
            onChange={handleChange} 
            onBlur={() => validateField('email')}
            placeholder="admin@yourbank.com"
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password *
          </label>
          <div className="mt-1 relative">
            <input 
              type={showPassword ? 'text' : 'password'} 
              id="password" 
              name="password" 
              required 
              className={`block w-full px-4 py-3 pr-10 border ${
                formErrors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
              value={formData.password} 
              onChange={handleChange} 
              onBlur={() => validateField('password')}
              placeholder="••••••••"
            />
            <button 
              type="button" 
              className="absolute inset-y-0 right-0 pr-3 flex items-center" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password *
          </label>
          <div className="mt-1 relative">
            <input 
              type={showConfirmPassword ? 'text' : 'password'} 
              id="confirmPassword" 
              name="confirmPassword" 
              required 
              className={`block w-full px-4 py-3 pr-10 border ${
                formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              onBlur={() => validateField('confirmPassword')}
              placeholder="••••••••"
            />
            <button 
              type="button" 
              className="absolute inset-y-0 right-0 pr-3 flex items-center" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {formErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
          )}
        </div>

        <div className="flex items-start">
          <input 
            id="acceptTerms" 
            name="acceptTerms"
            type="checkbox" 
            checked={formData.acceptTerms} 
            onChange={handleChange} 
            className="w-4 h-4 mt-1 border border-gray-300 rounded text-[#008401] focus:ring-[#008401]" 
          />
          <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
            I accept the{' '}
            <a href="/terms" className="text-[#008401] hover:underline" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="/privacy" className="text-[#008401] hover:underline" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            {' '}*
          </label>
        </div>
        {formErrors.acceptTerms && (
          <p className="text-sm text-red-500">{formErrors.acceptTerms}</p>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full px-4 py-3 text-white bg-[#008401] rounded-md hover:bg-[#006601] focus:outline-none focus:ring-2 focus:ring-[#008401] focus:ring-opacity-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="small" />
              <span className="ml-2">Creating Account...</span>
            </div>
          ) : (
            'Create Institution Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>All fields marked with * are required</p>
        <p className="mt-2">
          Your account will be reviewed and approved by system administrators
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;