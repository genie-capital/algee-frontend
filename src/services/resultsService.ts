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

// New interfaces for new endpoints
type VariableBreakdown = Record<string, Array<{
  variableId: number;
  variableName: string;
  uniqueCode: number;
  responseType: string;
  rawValue: any;
  normalizedValue: number;
  creditLimitWeight: number;
  interestRateWeight: number;
  variableProportion?: number;
  categoryWeights?: {
    creditLimit: number;
    interestRate: number;
  };
}>>;

export interface ClientResultDetailedResponse {
  success: boolean;
  message: string;
  data: {
    clientResult: {
      id: number;
      creditLimit: number;
      interestRate: number;
    };
    variableBreakdown: VariableBreakdown;
    totalVariables: number;
    categoriesCount: number;
  };
}

export interface ClientResultHistoryResponse {
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
  };
}

export interface CompareResultsResponse {
  success: boolean;
  message: string;
  data: {
    dataset1: any;
    dataset2: any;
    differences: any;
  };
}

export const resultsService = {
  // Get all results with advanced filtering (client-centric, never by batch)
  getAllResults: async (params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    search?: string;
    // uploadBatchId?: number; // Removed, batch filtering is now frontend only
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
      params: uploadBatchId ? { uploadBatchId } : undefined
    });
    return response.data;
  },

  // Get client result history
  getClientResultHistory: async (clientId: number, params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    uploadBatchId?: number;
  }): Promise<ClientResultHistoryResponse> => {
    const response = await api.get(`/results/client/${clientId}/history`, { params });
    return response.data;
  },

  // Get detailed client result
  getClientResultDetailed: async (clientId: number, uploadBatchId?: number): Promise<ClientResultDetailedResponse> => {
    const response = await api.get(`/results/client/${clientId}/detailed`, {
      params: uploadBatchId ? { uploadBatchId } : undefined
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

  // Compare results
  compareResults: async (params: {
    batch1Id?: number;
    batch2Id?: number;
    dateFrom1?: string;
    dateTo1?: string;
    dateFrom2?: string;
    dateTo2?: string;
    clientIds?: string;
  }): Promise<CompareResultsResponse> => {
    const response = await api.get('/results/compare', { params });
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