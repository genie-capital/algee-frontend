import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import Logo from '../components/common/Logo';
import { useAuth } from '../contexts/AuthContext';
import ErrorAlert from '../components/common/ErrorAlert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { validateForm, required, email } from '../utils/validation';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/workspace-dashboard';
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setRememberMe(checked);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear error when user types
      if (formErrors[name]) {
        setFormErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
    // Clear global error when user makes changes
    if (error) clearError();
  };

  const validateFormData = () => {
    const rules = {
      email: [required('Email is required'), email()],
      password: [required('Password is required')]
    };
    
    const errors = validateForm(formData, rules);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateFormData()) return;
    
    setIsSubmitting(true);
    
    try {
      // Call the login function from AuthContext with isAdmin=false (institution login)
      await login(formData.email, formData.password, false);
      // Navigation is handled in the useEffect
    } catch (err) {
      // Error is handled by the auth context
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <AuthLayout>
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
        <Logo title="Algee" />
          <h1 className="mt-4 text-2xl font-bold text-center text-[#07002F]">
            Financial Institution Secure Login
          </h1>
        </div>
        
        {error && <ErrorAlert message={error} onDismiss={clearError} />}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Business Email
            </label>
            <input 
              id="email" 
              name="email"
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              className={`w-full px-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F] focus:border-transparent`} 
              placeholder="your.name@company.com" 
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input 
                id="password" 
                name="password"
                type={showPassword ? 'text' : 'password'} 
                value={formData.password} 
                onChange={handleChange} 
                className={`w-full px-4 py-3 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F] focus:border-transparent`} 
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
            <div className="mt-1 text-right">
              <Link to="/reset-password" className="text-sm text-[#008401] hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>
          <div className="flex items-center mb-6">
            <input 
              id="remember-me" 
              type="checkbox" 
              checked={rememberMe} 
              onChange={handleChange} 
              className="w-4 h-4 border border-gray-300 rounded text-[#008401] focus:ring-[#008401]" 
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
              Keep me signed in on this device
            </label>
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-3 text-white bg-[#07002F] rounded-md hover:bg-[#05001a] focus:outline-none focus:ring-2 focus:ring-[#07002F] focus:ring-opacity-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="small" />
                <span className="ml-2">Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        <div className="mt-8 text-center">
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-gray-300"></div>
            <span className="relative px-4 bg-white text-sm text-gray-500">
              New to the platform?
            </span>
          </div>
          <Link to="/register" className="block w-full mt-4 px-4 py-3 text-[#07002F] bg-white border border-[#07002F] rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#008401] focus:ring-opacity-50 transition duration-200">
            Register Your Institution
          </Link>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <div className="flex justify-center space-x-4">
            <Link to="/terms" className="hover:text-[#008401]">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-[#008401]">
              Privacy Policy
            </Link>
            <Link to="/support" className="hover:text-[#008401]">
              Support
            </Link>
          </div>
          <div className="mt-2 text-xs">
            <p>
              System will automatically log you out after 15 minutes of
              inactivity
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>;
};

export default Login;