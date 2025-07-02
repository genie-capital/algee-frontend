import api from './api';

// Parameter template (system-wide definition)
export interface ParameterTemplate {
  id: number;
  name: string;
  uniqueCode: string;
  description: string;
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
  return await api.get('/parameter/all');
};

// Get all parameter values for an institution (with details)
export const getParametersForInstitution = async (institutionId: number): Promise<{ success: boolean; data: InstitutionParameter[] }> => {
  return await api.get(`/institution/getParameters/${institutionId}`);
};

// Set/update all parameter values for an institution
export const setInstitutionParameters = async (
  institutionId: number,
  parameters: CreditParameterInput[]
): Promise<{ success: boolean; message?: string }> => {
  return await api.post(`/institution/setParameters/${institutionId}`, { parameters });
};

// Update a single parameter value
export const updateInstitutionParameterValue = async (
  id: number,
  value: number
): Promise<{ success: boolean; message?: string }> => {
  return await api.put(`/institution/updateParameterValue/${id}`, { value });
};

// Update a full parameter record (admin)
export const updateInstitutionParameter = async (
  id: number,
  institutionId: number,
  parameterId: number,
  value: number
): Promise<{ success: boolean; message?: string }> => {
  return await api.put(`/institution/updateParameter/${id}`, { institutionId, parameterId, value });
};

// Delete a parameter record (admin)
export const deleteInstitutionParameter = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  return await api.delete(`/institution/deleteParameter/${id}`);
};