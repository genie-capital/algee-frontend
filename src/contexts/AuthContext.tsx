import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, loginInstitution, registerInstitution } from '../services/auth';
import api from '../services/api';

// Add to User type
export interface User {
  id: number;
  email: string;
  name: string;
  institutionId: number;
  role: string;
  is_admin: boolean;
  is_active: boolean;
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
  token: string | null;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  // Add these new functions
  register: (institutionData: Record<string, any>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
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
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('token'));
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
        
        // Validate token with the server and get user profile
        try {
          // For now, we'll set basic user data based on stored flags
          // In a real implementation, you'd validate the token with the server
          if (isAdmin) {
            setUser({
              id: 1,
              name: 'System Administrator',
              email: 'admin@algee.com',
              is_admin: true,
              is_active: true,
              role: 'admin',
              permissions: ['all'],
              institutionId: 0
            });
          } else {
            setUser({
              id: 2,
              name: 'Institution User',
              email: 'institution@example.com',
              is_admin: false,
              is_active: true,
              institutionName: 'Example Institution',
              institutionLogo: '/logo.png',
              role: 'institution_admin',
              permissions: ['manage_institution'],
              institutionId: 1
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
      let response;
      if (isAdmin) {
        response = await loginAdmin(email, password);
      } else {
        response = await loginInstitution(email, password);
      }
      
      // Set user data based on response
      setUser({
        id: response.id || (isAdmin ? 1 : 2),
        name: response.name || (isAdmin ? 'System Administrator' : 'Institution User'),
        email: email,
        is_admin: isAdmin,
        is_active: response.is_active || true,
        institutionName: !isAdmin ? response.name : undefined,
        institutionLogo: !isAdmin ? response.logo : undefined,
        role: isAdmin ? 'admin' : 'institution_admin',
        permissions: isAdmin ? ['all'] : ['manage_institution'],
        institutionId: isAdmin ? 0 : response.institutionId || 1
      });
      
      // Navigate based on user type
      navigate(isAdmin ? '/admin/dashboard' : '/workspace-dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
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
      const response = await registerInstitution(institutionData);
      // Registration successful - no need to do anything else
      return response;
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // This endpoint doesn't exist in the current API docs
      // You'll need to implement this when the backend provides it
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
      // This endpoint doesn't exist in the current API docs
      // You'll need to implement this when the backend provides it
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
        token,
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