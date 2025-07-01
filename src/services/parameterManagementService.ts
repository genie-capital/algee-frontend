import { createApiService } from './apiService';
import { API_BASE_URL } from '../config';

// Define interfaces for our data types
export interface Category {
  id: number;
  name: string;
  description: string;
  creditLimitWeight: number;
  interestRateWeight: number;
  createdAt: string;
  updatedAt: string;
}

export interface Variable {
  id: number;
  name: string;
  description: string;
  uniqueCode: string;
  isRequired: boolean;
  mask: boolean;
  isUsedInFormula: boolean;
  minValue: number;
  maxValue: number;
  responseType: 'int_float' | 'boolean' | 'categorical';
  normalizationFormula: string;
  variableCategoryId: number;
  variableProportion: number;
  categoryMappings?: Array<{
    category: string;
    value: number;
  }>;
}

export interface Parameter {
  id: number;
  name: string;
  description: string;
  recommendedRange: string;
  impact: string;
  normalizationFormula: string;
  uniqueCode: string;
  isActive: boolean;
  isInstitutionSpecific: boolean;
  institutionValue?: number;
}

// Create API service functions
const parameterManagementService = {
  // Category operations
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/variable/categories`);
    return response.json();
  },

  createCategory: async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch(`${API_BASE_URL}/variable/category/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    return response.json();
  },

  updateCategory: async (id: number, categoryData: Partial<Category>) => {
    const response = await fetch(`${API_BASE_URL}/variable/category/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    return response.json();
  },

  deleteCategory: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/variable/category/delete/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Variable operations
  getVariables: async () => {
    const response = await fetch(`${API_BASE_URL}/variable/list`);
    return response.json();
  },

  createVariable: async (variableData: Omit<Variable, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/variable/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(variableData),
    });
    return response.json();
  },

  updateVariable: async (id: number, variableData: Partial<Variable>) => {
    const response = await fetch(`${API_BASE_URL}/variable/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(variableData),
    });
    return response.json();
  },

  deleteVariable: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/variable/delete/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Parameter operations
  getParameters: async () => {
    const response = await fetch(`${API_BASE_URL}/institution/getParameters`);
    return response.json();
  },

  createParameter: async (parameterData: Omit<Parameter, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/api/institution/setParameters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parameters: [{
          parameterId: parameterData.uniqueCode,
          value: parameterData.normalizationFormula
        }]
      }),
    });
    return response.json();
  },

  updateParameter: async (id: number, parameterData: Partial<Parameter>) => {
    const response = await fetch(`${API_BASE_URL}/api/institution/updateParameter/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        institutionId: 1, // This should be dynamic based on the current institution
        parameterId: parameterData.uniqueCode,
        value: parameterData.normalizationFormula
      }),
    });
    return response.json();
  },

  deleteParameter: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/api/institution/deleteParameter/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Formula validation
  validateFormula: async (formula: string, responseType: string, variableId?: number) => {
    const response = await fetch(`${API_BASE_URL}/api/variable/validate-normalization-formula`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formula,
        responseType,
        variableId,
      }),
    });
    return response.json();
  },

  // Test normalization
  testNormalization: async (variableId: number, testValue: number) => {
    const response = await fetch(`${API_BASE_URL}/api/variable/test-variable-normalization`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variableId,
        testValue,
      }),
    });
    return response.json();
  },
};

export default parameterManagementService; 