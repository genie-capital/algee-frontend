import { useState, useCallback } from 'react';
import { Result, resultsService, BatchResultsResponse } from '../services/resultsService';

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
  const [results, setResults] = useState<Result[]>([]);
  const [pagination, setPagination] = useState<ResultsResponse['data']['pagination'] | null>(null);
  const [summary, setSummary] = useState<ResultsResponse['data']['summary'] | null>(null);
  const [filters, setFilters] = useState<ResultsResponse['data']['filters']>(null);
  const [batchSummary, setBatchSummary] = useState<BatchResultsResponse['data']['batchSummary'] | null>(null);

  const fetchResults = useCallback(async (params: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await resultsService.getAllResults(params);
      if (response.success) {
        setResults(response.data.results);
        setPagination(response.data.pagination);
        setSummary(response.data.summary);
        setFilters(response.data.filters);
      } else {
        setError(response.message || 'Failed to fetch results');
      }
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
      const response = await resultsService.getLatestClientResult(clientId, uploadBatchId);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch client result');
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching client result');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getResultsByBatch = useCallback(async (uploadBatchId: number, params: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await resultsService.getResultsByBatch(uploadBatchId, params);
      if (response.success) {
        setResults(response.data.results);
        setPagination(response.data.pagination);
        setBatchSummary(response.data.batchSummary);
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch batch results');
        throw new Error(response.message);
      }
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
      const blob = await resultsService.exportResults(params);
      return blob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while exporting results');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    results,
    pagination,
    summary,
    batchSummary,
    filters,
    fetchResults,
    getLatestClientResult,
    getResultsByBatch,
    exportResults
  };
}; 