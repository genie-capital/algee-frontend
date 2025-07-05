import axios from 'axios';
import { API_BASE_URL } from '../config';

interface ClientResult {
  clientId: number;
  creditLimit: number;
  interestRate: number;
  originalCreditLimit: number;
  creditLimitCapped: boolean;
  sumNormalisedCreditLimitWeights: number;
  sumNormalisedInterestRateWeights: number;
  clientResultId: number;
  calculationDetails: {
    clientIncome: number;
    institutionParams: {
      incomeMultiple: number;
      minLoanAmount: number;
      maxLoanAmount: number;
      maxInterestRate: number;
      minInterestRate: number;
    };
    weightScores: {
      creditLimitWeight: number;
      interestRateWeight: number;
      totalVariablesProcessed: number;
    };
  };
}

interface BatchResult {
  totalClients: number;
  successfulCalculations: number;
  failedCalculations: number;
  results: Array<{
    clientId: number;
    success: boolean;
    data?: ClientResult;
    error?: string;
  }>;
}

export const creditScoringService = {
  // Calculate result for a single client
  calculateClientResult: async (clientId: number, uploadBatchId?: number, institutionId?: number) => {
    const response = await axios.post(`${API_BASE_URL}/variables/calculate-client-result/${clientId}`, {
      uploadBatchId,
      institutionId
    });
    return response.data;
  },

  // Calculate results for multiple clients
  calculateBatchResults: async (clientIds: number[], uploadBatchId?: number, institutionId?: number) => {
    const response = await axios.post(`${API_BASE_URL}/variables/calculate-batch`, {
      clientIds,
      uploadBatchId,
      institutionId
    });
    return response.data;
  },

  // Get client result
  getClientResult: async (clientId: number, uploadBatchId?: number) => {
    const response = await axios.get(`${API_BASE_URL}/variables/client-result/${clientId}`, {
      params: { uploadBatchId }
    });
    return response.data;
  }
}; 

// endpoint: /api/results/getAllResult