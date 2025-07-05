import api from './api';

export const getParametersForInstitution = async (institutionId: any) => {
  return await api.post(`/institution/getParametersForInstitution/${institutionId}`);
};

// Set/update all parameter values for an institution
export const setInstitutionParameters = async (
  institutionId: number,
  parameters: CreditParameterInput[]
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.post(`/institution/setParameters/${institutionId}`, { parameters });
  return response.data;
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