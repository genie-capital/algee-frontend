import api from './api';

export const getAllInstitutions = async () => {
  return await api.post('/api/institution/getAllInstitutions');
};

export const updateInstitution = async (id: string, data: any) => {
  return await api.post(`/api/institution/update/${id}`, data);
};

export const deactivateInstitution = async (id: string) => {
  return await api.post(`/api/institution/deactivate/${id}`);
};