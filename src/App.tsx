import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PasswordReset from './pages/PasswordReset';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import InstitutionApproval from './pages/admin/InstitutionApproval';
import VariableManagement from './pages/admin/VariableManagement';
import WorkspaceDashboard from './pages/WorkspaceDashboard';
import CreditParametersConfig from './pages/CreditParametersConfig';
import UserManagement from './pages/admin/UserManagement';
import AuditLogs from './pages/admin/AuditLogs';
import ClientAssessment from './pages/ClientAssessment';
import AssessmentResults from './pages/AssessmentResults';
import Layout from './components/Layout';
import BatchAssessment from './pages/BatchAssessment';

export function App() {
  // Mock user data - in a real app, this would come from authentication
  const [userData, setUserData] = useState({
    isLoggedIn: true,
    institutionName: "First National Bank",
    userName: "John Smith",
    institutionLogo: ""
  });

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      // In a real app, this would check session/token validity
      const isLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true';
      setUserData(prev => ({
        ...prev,
        isLoggedIn
      }));
    };
    
    checkLoginStatus();
  }, []);

  // Wrap protected routes with Layout
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!userData.isLoggedIn) {
      // In a real app, this would redirect to login
      return <Dashboard/>;
    }
    
    return (
      <Layout 
        institutionName={userData.institutionName}
        userName={userData.userName}
        institutionLogo={userData.institutionLogo}
      >
        {children}
      </Layout>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        
        {/* Protected institution routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/workspace-dashboard" element={
          <ProtectedRoute>
            <WorkspaceDashboard />
          </ProtectedRoute>
        } />
        <Route path="/credit-parameters-config" element={
          <ProtectedRoute>
            <CreditParametersConfig />
          </ProtectedRoute>
        } />
        <Route path="/client-assessment" element={
          <ProtectedRoute>
            <ClientAssessment />
          </ProtectedRoute>
        } />
        <Route path="/batch-assessment" element={
          <ProtectedRoute>
            <BatchAssessment />
          </ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute>
            <AssessmentResults />
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/institution" element={<InstitutionApproval />} />
        <Route path="/admin/variables" element={<VariableManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/audit" element={<AuditLogs />} />
      </Routes>
    </BrowserRouter>
  );
}