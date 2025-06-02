import api from './api';

type ApiResponse<T> = {
  data: T;
  status: number;
  message?: string;
};

export const createApiService = <T>(resourceUrl: string) => {
  return {
    getAll: async (): Promise<ApiResponse<T[]>> => {
      const response = await api.get(resourceUrl);
      return response.data;
    },
    
    getById: async (id: number | string): Promise<ApiResponse<T>> => {
      const response = await api.get(`${resourceUrl}/${id}`);
      return response.data;
    },
    
    create: async (data: Partial<T>): Promise<ApiResponse<T>> => {
      const response = await api.post(resourceUrl, data);
      return response.data;
    },
    
    update: async (id: number | string, data: Partial<T>): Promise<ApiResponse<T>> => {
      const response = await api.put(`${resourceUrl}/${id}`, data);
      return response.data;
    },
    
    remove: async (id: number | string): Promise<ApiResponse<void>> => {
      const response = await api.delete(`${resourceUrl}/${id}`);
      return response.data;
    },
    
    // Custom method for specific endpoints
    custom: async (method: 'get' | 'post' | 'put' | 'delete', endpoint: string, data?: any): Promise<ApiResponse<any>> => {
      const response = await api[method](`${resourceUrl}/${endpoint}`, data);
      return response.data;
    }
  };
};