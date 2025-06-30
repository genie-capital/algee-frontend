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

export interface DetailedResult {
  clientResult: {
    id: number;
    creditLimit: number;
    interestRate: number;
  };
  variableBreakdown: Record<string, Array<{
    variableId: number;
    variableName: string;
    uniqueCode: number;
    responseType: string;
    rawValue: any;
    normalizedValue: number;
    creditLimitWeight: number;
    interestRateWeight: number;
    variableProportion: number;
    categoryWeights: {
      creditLimit: number;
      interestRate: number;
    };
  }>>;
  totalVariables: number;
  categoriesCount: number;
}

export interface ComparisonResponse {
  success: boolean;
  message: string;
  data: {
    dataset1: {
      count: number;
      avgCreditLimit: number;
      avgInterestRate: number;
      creditLimitRange: { min: number; max: number };
      interestRateRange: { min: number; max: number };
    };
    dataset2: {
      count: number;
      avgCreditLimit: number;
      avgInterestRate: number;
      creditLimitRange: { min: number; max: number };
      interestRateRange: { min: number; max: number };
    };
    differences: {
      countDiff: number;
      avgCreditLimitDiff: number;
      avgInterestRateDiff: number;
      avgCreditLimitPercentChange: number;
      avgInterestRatePercentChange: number;
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

  // Get client result history
  getClientResultHistory: async (clientId: number, params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    uploadBatchId?: number;
  }) => {
    const response = await api.get(`/results/client/${clientId}/history`, {
      params
    });
    return response.data;
  },

  // Get detailed client result
  getDetailedClientResult: async (clientId: number, uploadBatchId?: number): Promise<DetailedResult> => {
    const response = await api.get(`/results/client/${clientId}/detailed`, {
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
  }) => {
    const response = await api.get(`/results/batch/${uploadBatchId}`, {
      params
    });
    return response.data;
  },

  // Compare results between batches or time periods
  compareResults: async (params: {
    batch1Id?: number;
    batch2Id?: number;
    dateFrom1?: string;
    dateTo1?: string;
    dateFrom2?: string;
    dateTo2?: string;
    clientIds?: string;
  }): Promise<ComparisonResponse> => {
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