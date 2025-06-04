import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Add to User type
interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  role: string;
  permissions: string[];
  profilePhoto?: string;
  institutionName?: string;
  institutionLogo?: string;
}

// Add to AuthContextType
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  // Add these new functions
  register: (institutionData: Record<string, any>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
};

// Hardcoded credentials for development
const DEV_MODE = true; // Set to false in production

const ADMIN_CREDENTIALS = {
  email: 'admin@algee.com',
  password: 'Admin123!',
  userData: {
    id: 1,
    name: 'System Administrator',
    email: 'admin@algee.com',
    is_admin: true,
    is_active: true,
    role: 'admin',
    permissions: ['all']
  }
};

const INSTITUTION_CREDENTIALS = {
  email: 'institution@example.com',
  password: 'Password123!',
  userData: {
    id: 2,
    name: 'Test Institution',
    email: 'institution@example.com',
    is_admin: false,
    is_active: true,
    institutionName: 'Example Bank',
    institutionLogo: '/logo.png',
    role: 'institution_admin',
    permissions: ['manage_institution']
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        // Check if admin or institution user
        const isAdmin = sessionStorage.getItem('adminAuthenticated') === 'true';
        const isInstitution = sessionStorage.getItem('userLoggedIn') === 'true';
        
        if (!isAdmin && !isInstitution) {
          // Invalid state, clear everything
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('adminAuthenticated');
          sessionStorage.removeItem('userLoggedIn');
          setUser(null);
          setLoading(false);
          return;
        }
        
        // In DEV_MODE, set user based on stored credentials
        if (DEV_MODE) {
          if (isAdmin) {
            setUser(ADMIN_CREDENTIALS.userData);
          } else {
            setUser(INSTITUTION_CREDENTIALS.userData);
          }
          setLoading(false);
          return;
        }
        
        // Validate token with the server and get user profile
        try {
          const response = await api.get(isAdmin ? '/api/admin/update/{id}' : '/api/institution/update/{id}');
          if (response.data) {
            setUser({
              id: response.data.id,
              name: response.data.name,
              email: response.data.email,
              is_admin: isAdmin,
              is_active: response.data.is_active || true,
              institutionName: isInstitution ? response.data.name : undefined,
              institutionLogo: isInstitution ? response.data.logo : undefined,
              role: isAdmin ? 'admin' : 'institution_admin',
              permissions: isAdmin ? ['all'] : ['manage_institution']
            });
          }
        } catch (profileError) {
          console.error('Failed to fetch user profile:', profileError);
          // Token might be invalid, clear everything
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('adminAuthenticated');
          sessionStorage.removeItem('userLoggedIn');
          setUser(null);
        }
      } catch (err) {
        console.error('Auth status check failed:', err);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('userLoggedIn');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  const login = async (email: string, password: string, isAdmin = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // In development mode, check against hardcoded credentials
      if (DEV_MODE) {
        // Check admin credentials
        if (isAdmin && 
            email === ADMIN_CREDENTIALS.email && 
            password === ADMIN_CREDENTIALS.password) {
          
          // Set mock token and flags
          sessionStorage.setItem('token', 'dev-admin-token');
          sessionStorage.setItem('adminAuthenticated', 'true');
          
          // Set user data
          setUser(ADMIN_CREDENTIALS.userData);
          
          // Navigate to admin dashboard
          navigate('/admin/dashboard');
          setLoading(false);
          return;
        }
        
        // Check institution credentials
        if (!isAdmin && 
            email === INSTITUTION_CREDENTIALS.email && 
            password === INSTITUTION_CREDENTIALS.password) {
          
          // Set mock token and flags
          sessionStorage.setItem('token', 'dev-institution-token');
          sessionStorage.setItem('userLoggedIn', 'true');
          
          // Set user data
          setUser(INSTITUTION_CREDENTIALS.userData);
          
          // Navigate to institution dashboard
          navigate('/workspace-dashboard');
          setLoading(false);
          return;
        }
        
        // Invalid credentials
        setError('Invalid email or password');
        setLoading(false);
        return;
      }
      
      // Production mode - make API call
      const response = await api.post(isAdmin ? '/api/admin/login' : '/api/institution/login', {
        email,
        password
      });
      
      if (response.data.token) {
        // Store token and authentication flags
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem(isAdmin ? 'adminAuthenticated' : 'userLoggedIn', 'true');
        
        // Set user data
        setUser({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          is_admin: isAdmin,
          is_active: response.data.is_active || true,
          institutionName: !isAdmin ? response.data.name : undefined,
          institutionLogo: !isAdmin ? response.data.logo : undefined,
          role: isAdmin ? 'admin' : 'institution_admin',
          permissions: isAdmin ? ['all'] : ['manage_institution']
        });
        
        // Navigate based on user type
        navigate(isAdmin ? '/admin/dashboard' : '/workspace-dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('userLoggedIn');
    setUser(null);
    navigate('/');
  };
  
  const clearError = () => {
    setError(null);
  };
  
  // Add function to update user data
  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };
  
  // Add these new functions to the provider
  const register = async (institutionData: Record<string, any>) => {
    setLoading(true);
    setError(null);
    
    try {
      // In development mode, simulate successful registration
      if (DEV_MODE) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Success - no need to do anything else
        return;
      }
      
      // Normal API call for production
      await api.post('/api/institution/create', institutionData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In development mode, simulate successful password reset
      if (DEV_MODE) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Success - no need to do anything else
        return;
      }
      
      // Normal API call for production
      await api.post('/reset-password', { email });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Password reset failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    
    try {
      // In development mode, simulate successful profile update
      if (DEV_MODE) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Update user data directly
        setUser(prev => prev ? { ...prev, ...userData } : null);
        return;
      }
      
      // Normal API call for production
      const response = await api.put('/user/profile', userData);
      setUser(prev => prev ? { ...prev, ...response.data } : null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Profile update failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.is_admin || false,
        loading,
        error,
        login,
        logout,
        clearError,
        // Add new functions to the context value
        register,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};