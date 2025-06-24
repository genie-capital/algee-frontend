import api from "./api";

export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await api.post('/admin/login', { email, password });
    
    if (response.data.success && response.data.token) {
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('adminAuthenticated', 'true');
      return response.data;
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const loginInstitution = async (email: string, password: string) => {
  try {
    const response = await api.post('/institution/login', { email, password });
    
    if (response.data.success && response.data.token) {
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('userLoggedIn', 'true');
      return response.data;
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const registerInstitution = async (institutionData: Record<string, any>) => {
  try {
    const response = await api.post('/institution/create', institutionData);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Registration failed');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// Admin management functions
export const createAdmin = async (adminData: { name: string; email: string; password: string }) => {
  try {
    const response = await api.post('/admin/create', adminData);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to create admin');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const getAllAdmins = async () => {
  try {
    const response = await api.get('/admin/getAllAdmins');
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch admins');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const updateAdmin = async (id: string, adminData: { name?: string; email: string; password: string }) => {
  try {
    const response = await api.put(`/admin/update/${id}`, adminData);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to update admin');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const deactivateAdmin = async (id: string) => {
  try {
    const response = await api.delete(`/admin/deactivate/${id}`);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to deactivate admin');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const updateAdminStatus = async (id: string, isActive: boolean) => {
  try {
    const response = await api.patch(`/admin/update-admin-status/${id}`, { is_active: isActive });
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to update admin status');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// Institution management functions
export const getAllInstitutions = async () => {
  try {
    const response = await api.get('/institution/getAllInstitutions');
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch institutions');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const updateInstitution = async (id: string, institutionData: { name?: string; email: string; password: string }) => {
  try {
    const response = await api.put(`/institution/update/${id}`, institutionData);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to update institution');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const deactivateInstitution = async (id: string, data: { comment: string }) => {
  try {
    const response = await api.post(`/institution/deactivate/${id}`, data);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to deactivate institution');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const updateInstitutionStatus = async (id: string, isActive: boolean) => {
  try {
    const response = await api.patch(`/admin/update-institution-status/${id}`, { is_active: isActive });
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to update institution status');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
