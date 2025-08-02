import { useState, useCallback, useRef } from 'react';
import {
  Result,
  resultsService,
  BatchResultsResponse,
  ClientResultHistoryResponse,
  ClientResultDetailedResponse,
  CompareResultsResponse
} from '../services/resultsService';

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
  const [pagination, setPagination] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [filters, setFilters] = useState<any>(null);
  const [batchSummary, setBatchSummary] = useState<any>(null);
  const [clientHistory, setClientHistory] = useState<ClientResultHistoryResponse['data'] | null>(null);
  const [clientDetailed, setClientDetailed] = useState<ClientResultDetailedResponse['data'] | null>(null);
  const [compareData, setCompareData] = useState<CompareResultsResponse['data'] | null>(null);
  
  // Add debounce ref for search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchResults = useCallback(async (params: any) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting fetchResults call with params:', params);
      
      // Use the actual parameters passed to the function
      const response = await resultsService.getAllResults(params);
      console.log('API response received:', response);
      
      if (response.success) {
        setResults(response.data.results);
        setPagination(response.data.pagination);
        setSummary(response.data.summary);
        setFilters(response.data.filters);
      } else {
        console.error('API returned success: false with message:', response.message);
        setError(response.message || 'Failed to fetch results');
      }
    } catch (err) {
      console.error('Error in fetchResults:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        response: (err as any)?.response?.data
      });
      setError(err instanceof Error ? err.message : 'An error occurred while fetching results');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add debounced search function
  const debouncedSearch = useCallback((searchTerm: string, currentFilters: any) => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      const newFilters = { ...currentFilters, search: searchTerm, page: 1 };
      fetchResults(newFilters);
    }, 500); // 500ms delay
  }, [fetchResults]);

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

  const getClientResultHistory = useCallback(async (clientId: number, params: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await resultsService.getClientResultHistory(clientId, params);
      if (response.success) {
        setClientHistory(response.data);
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch client result history');
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching client result history');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClientResultDetailed = useCallback(async (clientId: number, uploadBatchId?: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await resultsService.getClientResultDetailed(clientId, uploadBatchId);
      if (response.success) {
        setClientDetailed(response.data);
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch detailed client result');
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching detailed client result');
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

  const compareResults = useCallback(async (params: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await resultsService.compareResults(params);
      if (response.success) {
        setCompareData(response.data);
        return response.data;
      } else {
        setError(response.message || 'Failed to compare results');
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while comparing results');
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
    clientHistory,
    clientDetailed,
    compareData,
    fetchResults,
    debouncedSearch,
    getLatestClientResult,
    getClientResultHistory,
    getClientResultDetailed,
    getResultsByBatch,
    compareResults,
    exportResults
  };
}; 