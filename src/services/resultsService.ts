import api from './api';

export interface Client {
  reference_number: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface UploadBatch {
  name: string;
  filename: string;
}

export interface Result {
  id: number;
  clientId: number;
  credit_limit: number;
  interest_rate: number;
  sum_normalised_credit_limit_weights: number;
  sum_normalised_interest_rate_weights: number;
  uploadBatchId: number;
  createdAt: string;
  client: Client;
  uploadBatch: UploadBatch;
}

export interface ResultsResponse {
  success: boolean;
  message: string;
  data: {
    results: Result[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    summary: {
      totalResults: number;
      avgCreditLimit: number;
      creditLimitRange: {
        min: number;
        max: number;
      };
      avgInterestRate: number;
      interestRateRange: {
        min: number;
        max: number;
      };
    };
    filters: {
      applied: Record<string, any>;
    };
  };
}

export interface BatchResultsResponse {
  success: boolean;
  message: string;
  data: {
    results: Result[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    batchSummary: {
      totalClients: number;
      avgCreditLimit: number;
      avgInterestRate: number;
      totalCreditLimit: number;
    };
  };
}

export const resultsService = {
  // Get all results with advanced filtering
  getAllResults: async (params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    search?: string;
    uploadBatchId?: number;
    minCreditLimit?: number;
    maxCreditLimit?: number;
    minInterestRate?: number;
    maxInterestRate?: number;
    dateFrom?: string;
    dateTo?: string;
    clientId?: number;
  }): Promise<ResultsResponse> => {
    const response = await api.get('/results', { params });
    return response.data;
  },

  // Get latest client result
  getLatestClientResult: async (clientId: number, uploadBatchId?: number) => {
    const response = await api.get(`/results/client/${clientId}/latest`, {
      params: { uploadBatchId }
    });
    return response.data;
  },

  // Get results by upload batch
  getResultsByBatch: async (uploadBatchId: number, params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    search?: string;
  }): Promise<BatchResultsResponse> => {
    const response = await api.get(`/results/batch/${uploadBatchId}`, {
      params
    });
    return response.data;
  },

  // Export results
  exportResults: async (params: {
    uploadBatchId?: number;
    clientIds?: string;
    dateFrom?: string;
    dateTo?: string;
    format?: 'csv' | 'json';
  }) => {
    const response = await api.get('/results/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }
};

export default resultsService; 