import api from './api';

// Get all parameters
export const getAllParameters = async () => {
  return await api.get('/parameter/all');
};

export const getParameterById = async (id: string) => {
  return await api.post(`/api/parameter/${id}`);
};

// Create a new parameter
export const createParameter = async (data: any) => {
  return await api.post('/parameter/create', data);
};

export const updateParameter = async (id: string, data: any) => {
  return await api.post(`/api/parameter/update/${id}`, data);
};

export const deleteParameter = async (id: string) => {
  return await api.post(`/api/parameter/delete/${id}`);
};