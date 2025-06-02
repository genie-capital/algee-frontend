import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';
import LoadingSpinner from './common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to institution dashboard if trying to access admin page
    return <Navigate to="/workspace-dashboard" replace />;
  }

  // For admin routes, we might want a different layout
  if (isAdmin) {
    return <>{children}</>;
  }

  // For institution users, wrap with the Layout component
  return (
    <Layout
      institutionName={user?.institutionName || ''}
      userName={user?.name || ''}
      institutionLogo={user?.institutionLogo || ''}
    >
      {children}
    </Layout>
  );
};

export default ProtectedRoute;