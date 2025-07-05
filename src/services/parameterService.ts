import api from './api';

// Get all parameters
export const getAllParameters = async () => {
  return await api.get('/parameter/all');
};

// Get parameter by ID
export const getParameterById = async (id: string | number) => {
  return await api.get(`/parameter/${id}`);
};

// Create a new parameter
export const createParameter = async (data: any) => {
  return await api.post('/parameter/create', data);
};

// Update a parameter
export const updateParameter = async (id: string | number, data: any) => {
  return await api.put(`/parameter/update/${id}`, data);
};

// Delete a parameter
export const deleteParameter = async (id: string | number) => {
  return await api.delete(`/parameter/delete/${id}`);
};

// Admin: Update institution parameter (PUT /api/institution/updateParameter/{institutionParameterId})
export const updateInstitutionParameterByAdmin = async (
  institutionParameterId: string | number,
  data: { institutionId: number; parameterId: number; value: number }
) => {
  return await api.put(`/institution/updateParameter/${institutionParameterId}`, data);
};

// Get institution parameters (detailed)
export const getInstitutionParametersDetailed = async (institutionId: number | string) => {
  return await api.get(`/institution/getParameters/${institutionId}`);
};

// Get institution parameters (simple)
export const getInstitutionParametersSimple = async (institutionId: number | string) => {
  return await api.get(`/institution/getParametersForInstitution/${institutionId}`);
};