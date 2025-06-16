import api from './api';
import { API_BASE_URL } from '../config';

export interface CreditParameter {
  parameterId: number;
  value: number;
}

export interface InstitutionParameter {
  id: number;
  name: string;
  description: string;
  recommendedRange: string;
  impact: string;
  uniqueCode: string;
  isActive: boolean;
}

export interface CreditParametersResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    institutionId: number;
    parameterId: number;
    value: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface InstitutionParametersResponse {
  success: boolean;
  message: string;
  data: InstitutionParameter[];
}

const creditParametersService = {
  // Get all parameters for an institution
  getInstitutionParameters: async (institutionId: number): Promise<CreditParametersResponse> => {
    const response = await api.get(`${API_BASE_URL}/institution/getParametersForInstitution/${institutionId}`);
    return response.data;
  },

  // Get all available institution parameters
  getAllInstitutionParameters: async (): Promise<InstitutionParametersResponse> => {
    const response = await api.get(`${API_BASE_URL}/institution/getParameters`);
    return response.data;
  },

  // Set multiple parameters for an institution
  setInstitutionParameters: async (institutionId: number, parameters: CreditParameter[]): Promise<CreditParametersResponse> => {
    const response = await api.post(`${API_BASE_URL}/institution/setParameters/${institutionId}`, {
      parameters
    });
    return response.data;
  },

  // Update a single parameter value
  updateParameterValue: async (institutionParameterId: number, value: number): Promise<CreditParametersResponse> => {
    const response = await api.put(`${API_BASE_URL}/institution/updateParameterValue/${institutionParameterId}`, {
      value
    });
    return response.data;
  }
};

export default creditParametersService; 