import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import SystemSettings from './pages/admin/SystemSettings';
import AssessmentResults from './pages/AssessmentResults';
import BatchAssessment from './pages/BatchAssessment';
import AdminManagement from './pages/admin/AdminManagement';
import InstitutionParameterDetail from './pages/InstitutionParameterDetail';
import ParametersConfig from './pages/ParametersConfig';
import ProtectedRoute from './components/ProtectedRoute';
import BatchAssessmentDetails from './pages/BatchAssessmentDetails';
import ClientResultDetails from './components/ClientResultDetails';
import ClientResultHistory from './components/ClientResultHistory';
import CategoryManagement from './pages/admin/CategoryManagement';
import InstitutionParameterManagement from './pages/admin/InstitutionParameterManagement';
import ParameterManagement from './pages/admin/ParameterManagement';


const ClientResultHistoryWrapper = () => {
  const location = useLocation();
  const { history } = location.state || {};
  const { results, clientName, clientReference } = history || {};

  return <ClientResultHistory 
    results={results || []} 
    clientName={clientName || ''} 
    clientReference={clientReference || ''} 
  />;
};

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
           
          {/* Don't forget to ad the ID to the unique batches "/${batchId}" 
              Also adjust it in batch assessment and assessment results */}
          <Route path="/batch/${batchId}" element={
            <ProtectedRoute>
              <BatchAssessmentDetails />
            </ProtectedRoute>
          } />
          <Route path="/client/:clientId" element={
            <ProtectedRoute>
              <ClientResultDetails />
            </ProtectedRoute>
          } />
          <Route path="/client/:clientId/history" element={
            <ProtectedRoute>
              <ClientResultHistoryWrapper />
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
          <Route path="/admin/parameters" element={
            <ProtectedRoute requireAdmin={true}>
              <InstitutionParameterManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/formula" element={
            <ProtectedRoute requireAdmin={true}>
              <ParameterManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/manage" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requireAdmin={true}>
              <SystemSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute requireAdmin={true}>
              <CategoryManagement />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}