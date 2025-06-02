import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PasswordReset from './pages/PasswordReset';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import InstitutionApproval from './pages/admin/InstitutionApproval';
import VariableManagement from './pages/admin/VariableManagement';
import WorkspaceDashboard from './pages/WorkspaceDashboard';
import CreditParametersConfig from './pages/CreditParametersConfig';
import UserManagement from './pages/admin/UserManagement';
import AuditLogs from './pages/admin/AuditLogs';
// import ClientAssessment from './pages/ClientAssessment';
import AssessmentResults from './pages/AssessmentResults';
import BatchAssessment from './pages/BatchAssessment';
import AdminManagement from './pages/admin/AdminManagement';
import InstitutionParameterDetail from './pages/InstitutionParameterDetail';
import ParametersConfig from './pages/ParametersConfig';
import ProtectedRoute from './components/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/admin" element={<AdminLogin />} />
          
          {/* Protected institution routes */}
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
          {/* <Route path="/client-assessment" element={
            <ProtectedRoute>
              <ClientAssessment />
            </ProtectedRoute>
          } /> */}
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
          <Route path="/institution/:id/parameters" element={
            <ProtectedRoute>
              <InstitutionParameterDetail />
            </ProtectedRoute>
          } />
          <Route path="/parameters" element={
            <ProtectedRoute>
              <ParametersConfig />
            </ProtectedRoute>
          } /> 
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/institution" element={
            <ProtectedRoute requireAdmin={true}>
              <InstitutionApproval />
            </ProtectedRoute>
          } />
          <Route path="/admin/variables" element={
            <ProtectedRoute requireAdmin={true}>
              <VariableManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requireAdmin={true}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/audit" element={
            <ProtectedRoute requireAdmin={true}>
              <AuditLogs />
            </ProtectedRoute>
          } />
          <Route path="/admin/manage" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminManagement />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}