import api from './api';

export const getAllParameters = async () => {
  return await api.post('/api/parameter/all');
};

export const getParameterById = async (id: string) => {
  return await api.post(`/api/parameter/${id}`);
};

export const createParameter = async (data: any) => {
  return await api.post('/api/parameter/create', data);
};

export const updateParameter = async (id: string, data: any) => {
  return await api.post(`/api/parameter/update/${id}`, data);
};

export const deleteParameter = async (id: string) => {
  return await api.post(`/api/parameter/delete/${id}`);
};