import api from './api';

export const loginAdmin = async (username: string, password: string) => {
  // Update to match API endpoint which expects email, not username
  const response = await api.post('/admin/login', { email: username, password });
  if (response.data.token) {
    sessionStorage.setItem('token', response.data.token);
    sessionStorage.setItem('adminAuthenticated', 'true');
  }
  return response.data;
};

export const loginInstitution = async (email: string, password: string) => {
  // This is already correct
  const response = await api.post('/institution/login', { email, password });
  if (response.data.token) {
    sessionStorage.setItem('token', response.data.token);
    sessionStorage.setItem('userLoggedIn', 'true');
  }
  return response.data;
};

// Add these new functions
export const registerInstitution = async (institutionData: Record<string, any>) => {
  return await api.post('/institution/create', institutionData);
};
