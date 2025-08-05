import { useState, useCallback, useRef, useMemo } from 'react';
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
  
  // Caching states
  const [allResults, setAllResults] = useState<Result[]>([]);
  const [isDataCached, setIsDataCached] = useState(false);
  
  // Display states (now derived from cached data)
  const [results, setResults] = useState<Result[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [filters, setFilters] = useState<any>(null);
  const [batchSummary, setBatchSummary] = useState<any>(null);
  const [clientHistory, setClientHistory] = useState<ClientResultHistoryResponse['data'] | null>(null);
  const [clientDetailed, setClientDetailed] = useState<ClientResultDetailedResponse['data'] | null>(null);
  const [compareData, setCompareData] = useState<CompareResultsResponse['data'] | null>(null);
  
  // Remove debounce ref since we're doing client-side filtering
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to calculate summary from results
  const calculateSummary = useCallback((resultsData: Result[]) => {
    if (!resultsData || resultsData.length === 0) {
      return {
        totalResults: 0,
        avgCreditLimit: 0,
        creditLimitRange: { min: 0, max: 0 },
        avgInterestRate: 0,
        interestRateRange: { min: 0, max: 0 }
      };
    }

    const creditLimits = resultsData.map(r => r.credit_limit || 0).filter(limit => limit > 0);
    const interestRates = resultsData.map(r => r.interest_rate || 0).filter(rate => rate > 0);

    return {
      totalResults: resultsData.length,
      avgCreditLimit: creditLimits.length > 0 ? creditLimits.reduce((sum, limit) => sum + limit, 0) / creditLimits.length : 0,
      creditLimitRange: {
        min: creditLimits.length > 0 ? Math.min(...creditLimits) : 0,
        max: creditLimits.length > 0 ? Math.max(...creditLimits) : 0
      },
      avgInterestRate: interestRates.length > 0 ? interestRates.reduce((sum, rate) => sum + rate, 0) / interestRates.length : 0,
      interestRateRange: {
        min: interestRates.length > 0 ? Math.min(...interestRates) : 0,
        max: interestRates.length > 0 ? Math.max(...interestRates) : 0
      }
    };
  }, []);

  // Client-side filtering function
  const filterResults = useCallback((
    data: Result[],
    searchTerm: string,
    minCreditLimit?: number,
    maxCreditLimit?: number,
    minInterestRate?: number,
    maxInterestRate?: number,
    dateFrom?: string,
    dateTo?: string
  ) => {
    return data.filter(result => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesClient = result.client?.name?.toLowerCase().includes(search) ||
                            result.client?.reference_number?.toLowerCase().includes(search) ||
                            result.client?.phoneNumber?.toLowerCase().includes(search);
        const matchesBatch = result.uploadBatch?.name?.toLowerCase().includes(search) ||
                           result.uploadBatchId?.toString().includes(search);
        
        if (!matchesClient && !matchesBatch) return false;
      }

      // Credit limit filters
      if (minCreditLimit !== undefined && (result.credit_limit || 0) < minCreditLimit) return false;
      if (maxCreditLimit !== undefined && (result.credit_limit || 0) > maxCreditLimit) return false;

      // Interest rate filters
      if (minInterestRate !== undefined && (result.interest_rate || 0) < minInterestRate) return false;
      if (maxInterestRate !== undefined && (result.interest_rate || 0) > maxInterestRate) return false;

      // Date filters
      if (dateFrom && new Date(result.createdAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(result.createdAt) > new Date(dateTo)) return false;

      return true;
    });
  }, []);

  // Client-side sorting function
  const sortResults = useCallback((data: Result[], sortBy: string, sortOrder: 'ASC' | 'DESC') => {
    return [...data].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortBy) {
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case 'credit_limit':
          aVal = a.credit_limit || 0;
          bVal = b.credit_limit || 0;
          break;
        case 'interest_rate':
          aVal = a.interest_rate || 0;
          bVal = b.interest_rate || 0;
          break;
        default:
          aVal = a.createdAt;
          bVal = b.createdAt;
      }

      if (aVal < bVal) return sortOrder === 'ASC' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'ASC' ? 1 : -1;
      return 0;
    });
  }, []);

  // Client-side pagination function
  const paginateResults = useCallback((data: Result[], page: number, limit: number) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      results: paginatedData,
      pagination: {
        total: data.length,
        page,
        limit,
        totalPages: Math.ceil(data.length / limit)
      }
    };
  }, []);

  // Initial data fetch with large limit for caching
  const fetchResults = useCallback(async (params: any, forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting fetchResults call with params:', params);
      
      // If data is already cached and not forcing refresh, use cached data
      if (isDataCached && !forceRefresh) {
        console.log('Using cached data for filtering');
        const filtered = filterResults(
          allResults,
          params.search || '',
          params.minCreditLimit,
          params.maxCreditLimit,
          params.minInterestRate,
          params.maxInterestRate,
          params.dateFrom,
          params.dateTo
        );
        
        const sorted = sortResults(filtered, params.sortBy || 'createdAt', params.sortOrder || 'DESC');
        const paginated = paginateResults(sorted, params.page || 1, params.limit || 10);
        
        setResults(paginated.results);
        setPagination(paginated.pagination);
        setSummary(calculateSummary(filtered));
        setFilters({ applied: params });
        setLoading(false);
        return;
      }

      // Fetch all data with large limit for caching
      const fetchParams = {
        ...params,
        page: 1,
        limit: 1000, // Fetch up to 1000 records for caching
        // Remove client-side filterable params from API call
        search: undefined,
        minCreditLimit: undefined,
        maxCreditLimit: undefined,
        minInterestRate: undefined,
        maxInterestRate: undefined,
        dateFrom: undefined,
        dateTo: undefined
      };

      const response = await resultsService.getAllResults(fetchParams);
      console.log('API response received:', response);
      
      if (response.success) {
        // Cache all results
        setAllResults(response.data.results);
        setIsDataCached(true);

        // Apply client-side filtering to cached data
        const filtered = filterResults(
          response.data.results,
          params.search || '',
          params.minCreditLimit,
          params.maxCreditLimit,
          params.minInterestRate,
          params.maxInterestRate,
          params.dateFrom,
          params.dateTo
        );
        
        const sorted = sortResults(filtered, params.sortBy || 'createdAt', params.sortOrder || 'DESC');
        const paginated = paginateResults(sorted, params.page || 1, params.limit || 10);
        
        setResults(paginated.results);
        setPagination(paginated.pagination);
        setSummary(calculateSummary(filtered));
        setFilters({ applied: params });
      } else {
        console.error('API returned success: false with message:', response.message);
        setError(response.message || 'Failed to fetch results');
      }
    } catch (err) {
      console.error('Error in fetchResults:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching results');
    } finally {
      setLoading(false);
    }
  }, [allResults, isDataCached, filterResults, sortResults, paginateResults, calculateSummary]);

  // Institution-specific fetch with caching
  const fetchInstitutionResults = useCallback(async (institutionId: number, params: any, forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting fetchInstitutionResults call with institutionId:', institutionId, 'params:', params);
      
      // If data is already cached and not forcing refresh, use cached data
      if (isDataCached && !forceRefresh) {
        console.log('Using cached data for filtering');
        const filtered = filterResults(
          allResults,
          params.search || '',
          params.minCreditLimit,
          params.maxCreditLimit,
          params.minInterestRate,
          params.maxInterestRate,
          params.dateFrom,
          params.dateTo
        );
        
        const sorted = sortResults(filtered, params.sortBy || 'createdAt', params.sortOrder || 'DESC');
        const paginated = paginateResults(sorted, params.page || 1, params.limit || 10);
        
        setResults(paginated.results);
        setPagination(paginated.pagination);
        setSummary(calculateSummary(filtered));
        setFilters({ applied: params });
        setLoading(false);
        return;
      }

      // Fetch all data with large limit for caching
      const fetchParams = {
        ...params,
        page: 1,
        limit: 1000, // Fetch up to 1000 records for caching
        // Remove client-side filterable params from API call
        search: undefined,
        minCreditLimit: undefined,
        maxCreditLimit: undefined,
        minInterestRate: undefined,
        maxInterestRate: undefined,
        dateFrom: undefined,
        dateTo: undefined
      };

      const response = await resultsService.getInstitutionResults(institutionId, fetchParams);
      console.log('API response received:', response);
      
      if (response.success) {
        // Cache all results
        setAllResults(response.data.results);
        setIsDataCached(true);

        // Apply client-side filtering to cached data
        const filtered = filterResults(
          response.data.results,
          params.search || '',
          params.minCreditLimit,
          params.maxCreditLimit,
          params.minInterestRate,
          params.maxInterestRate,
          params.dateFrom,
          params.dateTo
        );
        
        const sorted = sortResults(filtered, params.sortBy || 'createdAt', params.sortOrder || 'DESC');
        const paginated = paginateResults(sorted, params.page || 1, params.limit || 10);
        
        setResults(paginated.results);
        setPagination(paginated.pagination);
        setSummary(calculateSummary(filtered));
        setFilters({ applied: params });
      } else {
        console.error('API returned success: false with message:', response.message);
        setError(response.message || 'Failed to fetch institution results');
      }
    } catch (err) {
      console.error('Error in fetchInstitutionResults:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching institution results');
    } finally {
      setLoading(false);
    }
  }, [allResults, isDataCached, filterResults, sortResults, paginateResults, calculateSummary]);

  // Instant client-side search (no API calls)
  const instantSearch = useCallback((searchTerm: string, currentFilters: any) => {
    if (!isDataCached) return; // Wait for data to be cached first

    const filtered = filterResults(
      allResults,
      searchTerm,
      currentFilters.minCreditLimit,
      currentFilters.maxCreditLimit,
      currentFilters.minInterestRate,
      currentFilters.maxInterestRate,
      currentFilters.dateFrom,
      currentFilters.dateTo
    );
    
    const sorted = sortResults(filtered, currentFilters.sortBy || 'createdAt', currentFilters.sortOrder || 'DESC');
    const paginated = paginateResults(sorted, 1, currentFilters.limit || 10); // Reset to page 1 for new search
    
    setResults(paginated.results);
    setPagination(paginated.pagination);
    setSummary(calculateSummary(filtered));
  }, [allResults, isDataCached, filterResults, sortResults, paginateResults, calculateSummary]);

  // Legacy debounced search (kept for compatibility, but now instant)
  const debouncedSearch = useCallback((searchTerm: string, currentFilters: any, institutionId?: number) => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // No timeout needed for instant search
    instantSearch(searchTerm, currentFilters);
  }, [instantSearch]);

  // Force refresh function for when we need fresh data
  const refreshData = useCallback(async (params: any, institutionId?: number) => {
    setIsDataCached(false); // Clear cache
    if (institutionId) {
      await fetchInstitutionResults(institutionId, params, true);
    } else {
      await fetchResults(params, true);
    }
  }, [fetchResults, fetchInstitutionResults]);

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
    isDataCached,
    fetchResults,
    fetchInstitutionResults,
    debouncedSearch, // Legacy compatibility
    instantSearch, // New instant search
    refreshData, // Force refresh cached data
    getLatestClientResult,
    getClientResultHistory,
    getClientResultDetailed,
    getResultsByBatch,
    compareResults,
    exportResults
  };
};