import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, loginInstitution, registerInstitution } from '../services/auth';
import api from '../services/api';
import { 
  isTokenExpired, 
  getUserFromToken, 
  validateSessionFlags, 
  clearAuthSession,
  getCurrentToken,
  TokenPayload
} from '../utils/tokenUtils';

// Add to User type
export interface User {
  id: number;
  email: string;
  name: string;
  institutionId?: number;
  role: string;
  is_admin: boolean;
  is_active: boolean;
  permissions?: string[];
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
  const [token, setToken] = useState<string | null>(getCurrentToken());
  const navigate = useNavigate();
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const storedToken = getCurrentToken();
        if (!storedToken) {
          setUser(null);
          setToken(null);
          setLoading(false);
          return;
        }

        // Check if token is expired
        if (isTokenExpired(storedToken)) {
          console.log('Token expired, clearing session');
          clearAuthSession();
          setUser(null);
          setToken(null);
          setLoading(false);
          return;
        }

        // Extract user data from token
        const tokenUser = getUserFromToken(storedToken);
        if (!tokenUser) {
          console.log('Invalid token format, clearing session');
          clearAuthSession();
          setUser(null);
          setToken(null);
          setLoading(false);
          return;
        }

        // Validate session flags
        if (!validateSessionFlags(tokenUser.is_admin || false)) {
          console.log('Invalid session flags, clearing session');
          clearAuthSession();
          setUser(null);
          setToken(null);
          setLoading(false);
          return;
        }

        // Try to validate token with backend by making a test request
        try {
          // Use a lightweight endpoint to validate token
          const testEndpoint = tokenUser.is_admin ? '/admin/getAllAdmins' : '/institution/getAllInstitutions';
          await api.get(testEndpoint);
          
          // If request succeeds, token is valid - set user data from token
          const userData: User = {
            id: tokenUser.id!,
            name: tokenUser.name!,
            email: tokenUser.email!,
            role: tokenUser.role!,
            is_admin: tokenUser.is_admin!,
            is_active: tokenUser.is_active!,
            permissions: tokenUser.is_admin ? ['all'] : ['manage_institution'],
            institutionId: tokenUser.is_admin ? undefined : tokenUser.id
          };

          setUser(userData);
          setToken(storedToken);
        } catch (error: any) {
          console.log('Token validation failed:', error.response?.status);
          // If 401/403, token is invalid or user is inactive
          if (error.response?.status === 401 || error.response?.status === 403) {
            clearAuthSession();
            setUser(null);
            setToken(null);
          } else {
            // For other errors (network, server), keep session but log error
            console.error('Network error during token validation:', error);
            // Still set user data from token to allow offline functionality
            const userData: User = {
              id: tokenUser.id!,
              name: tokenUser.name!,
              email: tokenUser.email!,
              role: tokenUser.role!,
              is_admin: tokenUser.is_admin!,
              is_active: tokenUser.is_active!,
              permissions: tokenUser.is_admin ? ['all'] : ['manage_institution'],
              institutionId: tokenUser.is_admin ? undefined : tokenUser.id
            };
            setUser(userData);
            setToken(storedToken);
          }
        }
      } catch (err) {
        console.error('Auth status check failed:', err);
        clearAuthSession();
        setUser(null);
        setToken(null);
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
      
      // Extract user data from the new token
      const newToken = response.token;
      const tokenUser = getUserFromToken(newToken);
      
      if (!tokenUser) {
        throw new Error('Invalid token received from server');
      }

      // Set user data from token payload
      const userData: User = {
        id: tokenUser.id!,
        name: tokenUser.name!,
        email: tokenUser.email!,
        role: tokenUser.role!,
        is_admin: tokenUser.is_admin!,
        is_active: tokenUser.is_active!,
        permissions: tokenUser.is_admin ? ['all'] : ['manage_institution'],
        institutionId: tokenUser.is_admin ? undefined : tokenUser.id,
        // Add any additional data from response if available
        institutionName: !tokenUser.is_admin ? (response.institutionName || tokenUser.name) : undefined,
        institutionLogo: !tokenUser.is_admin ? response.institutionLogo : undefined
      };
      
      setUser(userData);
      setToken(newToken);
      
      // Navigate based on user type
      navigate(isAdmin ? '/admin/dashboard' : '/workspace-dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    clearAuthSession();
    setUser(null);
    setToken(null);
    navigate('/');
  };
  
  const clearError = () => {
    setError(null);
  };
  
  // Add these new functions to the provider
  const register = async (institutionData: Record<string, any>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await registerInstitution(institutionData);
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
      // This endpoint doesn't exist in the current API
      // You'll need to implement this when the backend provides it
      await api.post('/auth/reset-password', { email });
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
      // This endpoint doesn't exist in the current API
      // You'll need to implement this when the backend provides it
      const endpoint = user?.is_admin ? '/admin/profile' : '/institution/profile';
      const response = await api.put(endpoint, userData);
      
      // Update user state with new data
      setUser(prev => prev ? { ...prev, ...response.data.data } : null);
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
        isAuthenticated: !!user && !!token,
        isAdmin: user?.is_admin || false,
        loading,
        error,
        token,
        login,
        logout,
        clearError,
        register,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};