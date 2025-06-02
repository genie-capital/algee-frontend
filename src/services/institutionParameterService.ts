import api from './api';

export const getParametersForInstitution = async (institutionId: any) => {
  return await api.post(`/institution/getParametersForInstitution/${institutionId}`);
};

export const setInstitutionParameters = async (institutionId: any, parameters: any) => {
  return await api.post(`/institution/setParameters/${institutionId}`, { parameters });
};

export const updateInstitutionParameterValue = async (id: string, value: any) => {
  return await api.post(`/institution/updateParameterValue/${id}`, { value });
};

export const updateInstitutionParameter = async (id: string, parameterId: string, value: any) => {
  return await api.post(`/institution/updateParameter/${id}`, { parameterId, value });
};

export const deleteInstitutionParameter = async (id: string) => {
  return await api.post(`/institution/deleteParameter/${id}`);
};