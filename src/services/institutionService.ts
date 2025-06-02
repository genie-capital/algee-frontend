import api from './api';

export const getAllInstitutions = async () => {
  return await api.post('/institution/getAllInstitutions');
};

export const updateInstitution = async (id: string, data: any) => {
  return await api.post(`/institution/update/${id}`, data);
};

export const deactivateInstitution = async (id: string) => {
  return await api.post(`/institution/deactivate/${id}`);
};