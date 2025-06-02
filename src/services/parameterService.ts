import api from './api';

export const getAllParameters = async () => {
  return await api.post('/parameter/all');
};

export const getParameterById = async (id: string) => {
  return await api.post(`/parameter/${id}`);
};

export const createParameter = async (data: any) => {
  return await api.post('/parameter/create', data);
};

export const updateParameter = async (id: string, data: any) => {
  return await api.post(`/parameter/update/${id}`, data);
};

export const deleteParameter = async (id: string) => {
  return await api.post(`/parameter/delete/${id}`);
};