import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { validateForm, required } from '../../utils/validation';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  const { login, error, clearError, isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from);
    } else if (isAuthenticated && !isAdmin) {
      // If authenticated but not admin, redirect to institution dashboard
      navigate('/workspace-dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate, location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear global error when user makes changes
    if (error) clearError();
  };

  const validateFormData = () => {
    const rules = {
      username: [required('Username is required')],
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
    
    try {
      // Call the login function from AuthContext with isAdmin=true
      // Note: The API expects 'email' but the form field is named 'username'
      await login(formData.username, formData.password, true);
      // Navigation is handled in the useEffect
    } catch (err) {
      // Error is handled by the auth context
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#07002F]">
          System Administrator Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Secure access for system administrators only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <ErrorAlert message={error} onDismiss={clearError} />}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Admin Email
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  placeholder="Enter your admin email"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${formErrors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#07002F] focus:border-[#07002F] sm:text-sm`}
                />
              </div>
              {formErrors.username && (
                <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#07002F] focus:border-[#07002F] sm:text-sm`}
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
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#07002F] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008401] disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="small" text="" /> : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">System Security Notice</span>
              </div>
            </div>
            <div className="mt-6 text-center text-xs text-gray-500">
              <p>Unauthorized access is strictly prohibited and may result in legal action.</p>
              <p className="mt-1">All activities are logged and monitored.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;