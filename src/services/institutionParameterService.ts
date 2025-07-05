import api from './api';

// Parameter template (system-wide definition)
export interface ParameterTemplate {
  id: number;
  name: string;
  uniqueCode: string;
  description: string;
  recommendedRange: string; 
  impact: string; 
  isActive: boolean;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

// Institution parameter (value set by institution)
export interface InstitutionParameter {
  id: number;
  institutionId: number;
  parameterId: number;
  value: number;
  createdAt: string;
  updatedAt: string;
  parameter?: ParameterTemplate;
}

// For setting/updating parameters
export interface CreditParameterInput {
  parameterId: number;
  value: number;
}

// Get all parameter templates (definitions)
export const getAllParameters = async (): Promise<{ success: boolean; data: ParameterTemplate[] }> => {
  const response = await api.get('/parameter/all');
  return response.data;
};

// Get all parameter values for an institution (with details)
export const getParametersForInstitution = async (institutionId: number): Promise<{ success: boolean; data: InstitutionParameter[] }> => {
  const response = await api.get(`/institution/getParameters/${institutionId}`);
  return response.data;
};

// Set/update all parameter values for an institution
export const setInstitutionParameters = async (
  institutionId: number,
  parameters: CreditParameterInput[]
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.post(`/institution/setParameters/${institutionId}`, { parameters });
  return response.data;
};

// Update a single parameter value
export const updateInstitutionParameterValue = async (
  id: number,
  value: number
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.put(`/institution/updateParameterValue/${id}`, { value });
  return response.data;
};

// Update a full parameter record (admin)
export const updateInstitutionParameter = async (
  id: number,
  institutionId: number,
  parameterId: number,
  value: number
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.put(`/institution/updateParameter/${id}`, { institutionId, parameterId, value });
  return response.data;
};

// Delete a parameter record (admin)
export const deleteInstitutionParameter = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  const response = await api.delete(`/institution/deleteParameter/${id}`);
  return response.data;
};