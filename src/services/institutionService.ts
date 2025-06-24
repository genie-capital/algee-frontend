import api from './api';

export const getAllInstitutions = async () => {
  return await api.get('/institution/getAllInstitutions');
};

export const updateInstitution = async (id: string, data: any) => {
  return await api.put(`/institution/update/${id}`, data);
};

export const deactivateInstitution = async (id: string, data: { comment: string }) => {
  return await api.post(`/institution/deactivate/${id}`, data);
};