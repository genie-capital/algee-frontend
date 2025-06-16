import { useState, useCallback } from 'react';
import { Result, resultsService, ComparisonResponse } from '../services/resultsService';
import { mockResults, mockSummary, mockPagination, mockClientHistory } from '../mocks/resultsData';

interface ResultsResponse {
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
    filters: any;
  };
}

interface UseResultsOptions {
  initialFilters?: any;
}

export const useResults = (options: UseResultsOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>(mockResults);
  const [pagination, setPagination] = useState<ResultsResponse['data']['pagination']>(mockPagination);
  const [summary, setSummary] = useState<ResultsResponse['data']['summary']>(mockSummary);
  const [filters, setFilters] = useState<ResultsResponse['data']['filters']>(null);

  const fetchResults = useCallback(async (params: any) => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setResults(mockResults);
      setPagination(mockPagination);
      setSummary(mockSummary);
      setFilters(params);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching results');
    } finally {
      setLoading(false);
    }
  }, []);

  const getLatestClientResult = useCallback(async (clientId: number, uploadBatchId?: number) => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockResults.find(r => r.clientId === clientId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching client result');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClientResultHistory = useCallback(async (clientId: number, params: any) => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockClientHistory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching client history');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDetailedClientResult = useCallback(async (clientId: number, uploadBatchId?: number) => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const result = mockResults.find(r => r.clientId === clientId);
      return {
        clientResult: {
          id: result?.id || 0,
          creditLimit: result?.credit_limit || 0,
          interestRate: result?.interest_rate || 0
        },
        variableBreakdown: {
          'Financial Information': [
            {
              variableId: 1,
              variableName: 'Monthly Income',
              uniqueCode: 1001,
              responseType: 'int_float',
              rawValue: 50000,
              normalizedValue: 0.85,
              creditLimitWeight: 0.75,
              interestRateWeight: 0.25,
              variableProportion: 0.3,
              categoryWeights: {
                creditLimit: 0.8,
                interestRate: 0.2
              }
            }
          ]
        },
        totalVariables: 1,
        categoriesCount: 1
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching detailed result');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getResultsByBatch = useCallback(async (uploadBatchId: number, params: any) => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        results: mockResults.filter(r => r.uploadBatchId === uploadBatchId),
        pagination: mockPagination
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching batch results');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportResults = useCallback(async (params: any) => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const blob = new Blob(['Mock CSV data'], { type: 'text/csv' });
      return blob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while exporting results');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const compareResults = async (params: {
    batch1Id?: number;
    batch2Id?: number;
    dateFrom1?: string;
    dateTo1?: string;
    dateFrom2?: string;
    dateTo2?: string;
    clientIds?: string;
  }): Promise<ComparisonResponse> => {
    try {
      setLoading(true);
      const response = await resultsService.compareResults(params);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error comparing results');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    results,
    pagination,
    summary,
    filters,
    fetchResults,
    getLatestClientResult,
    getClientResultHistory,
    getDetailedClientResult,
    getResultsByBatch,
    exportResults,
    compareResults
  };
}; 