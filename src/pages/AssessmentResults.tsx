import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Layout from '../components/Layout';
import { useResults } from '../hooks/useResults';
import { Result } from '../services/resultsService';
import { formatCurrency } from '../utils/formatters';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

interface BatchSummary {
  id: number;
  name: string;
  filename: string;
  createdAt: string;
  totalResults: number;
  avgCreditLimit: number;
  avgInterestRate: number;
  creditLimitRange: {
    min: number;
    max: number;
  };
}

type SortOrder = 'ASC' | 'DESC';

const AssessmentResults = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const {
    loading,
    error,
    results,
    pagination,
    summary,
    isDataCached,
    fetchResults,
    fetchInstitutionResults,
    instantSearch, // Use instant search instead of debounced
    refreshData, // For force refresh
    exportResults,
    getLatestClientResult
  } = useResults({}, user);

  // Add new state for view mode (batch or client)
  const [viewMode, setViewMode] = useState<'batch' | 'client'>('batch');

  // Enhanced filters state with all backend parameters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC' as SortOrder,
    search: '',
    minCreditLimit: undefined as number | undefined,
    maxCreditLimit: undefined as number | undefined,
    minInterestRate: undefined as number | undefined,
    maxInterestRate: undefined as number | undefined,
    dateFrom: undefined as string | undefined,
    dateTo: undefined as string | undefined,
    clientId: undefined as number | undefined,
  });

  // Add loading state for non-search filter changes
  const [filterLoading, setFilterLoading] = useState(false);

  // Group results by batch - now works with cached/filtered data
  const batchSummaries: BatchSummary[] = useMemo(() => {
    if (!results || results.length === 0) return [];

    const filteredResults = results.filter(r => {
      if (!viewMode || viewMode !== 'batch' || !filters.search || !/\d+/.test(filters.search.trim())) {
        return true;
      }
      const batchId = Number(filters.search.trim());
      return r.uploadBatchId === batchId;
    });

    return filteredResults.reduce((acc: BatchSummary[], result: Result) => {
      if (!result.uploadBatchId) return acc;

      const existingBatch = acc.find(batch => batch.id === result.uploadBatchId);
      if (existingBatch) {
        return acc;
      }

      const batchResults = filteredResults.filter(r => r.uploadBatchId === result.uploadBatchId);
      if (batchResults.length === 0) return acc;

      const avgCreditLimit = batchResults.reduce((sum, r) => sum + (r.credit_limit || 0), 0) / batchResults.length;
      const avgInterestRate = batchResults.reduce((sum, r) => sum + (r.interest_rate || 0), 0) / batchResults.length;
      const creditLimits = batchResults.map(r => r.credit_limit || 0).filter(limit => limit > 0);

      acc.push({
        id: result.uploadBatchId,
        name: result.uploadBatch?.name || 'Unknown Batch',
        filename: result.uploadBatch?.filename || 'Unknown File',
        createdAt: result.createdAt,
        totalResults: batchResults.length,
        avgCreditLimit,
        avgInterestRate,
        creditLimitRange: {
          min: creditLimits.length > 0 ? Math.min(...creditLimits) : 0,
          max: creditLimits.length > 0 ? Math.max(...creditLimits) : 0
        }
      });
      return acc;
    }, []);
  }, [results, filters.search, viewMode]);

  // Initial data fetch - now with caching
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        if (isAdmin) {
          await fetchResults(filters);
        } else {
          if (user.institutionId) {
            await fetchInstitutionResults(user.institutionId, filters);
          } else {
            console.error('Institution user missing institutionId');
          }
        }
      } catch (err) {
        console.error('Error fetching results:', err);
        if ((err as any)?.response?.status === 500) {
          console.error('Server error - this might be a backend issue. Please check server logs.');
        }
      }
    };

    fetchData();
  }, [user, isAdmin]); // Only depend on user and isAdmin for initial load

  // Handle non-search filter changes that require API calls or cache refresh
  const handleFilterChange = useCallback(async (newFilters: typeof filters, requiresApiCall = false) => {
    if (!user) return;
    
    if (requiresApiCall || !isDataCached) {
      setFilterLoading(true);
      try {
        if (isAdmin) {
          await fetchResults(newFilters);
        } else {
          if (user.institutionId) {
            await fetchInstitutionResults(user.institutionId, newFilters);
          }
        }
      } catch (err) {
        console.error('Error updating filters:', err);
      } finally {
        setFilterLoading(false);
      }
    } else {
      // Use cached data with instant filtering
      instantSearch(newFilters.search || '', newFilters);
    }
  }, [fetchResults, fetchInstitutionResults, user, isAdmin, isDataCached, instantSearch]);

  // Handle search with instant client-side filtering
  const handleSearchChange = useCallback((searchTerm: string) => {
    if (!user) return;
    
    const newFilters = { ...filters, search: searchTerm, page: 1 };
    setFilters(newFilters);
    
    // Use instant search if data is cached, otherwise fallback to API
    if (isDataCached) {
      instantSearch(searchTerm, newFilters);
    } else {
      // Data not cached yet, use API call
      const institutionId = !isAdmin && user.institutionId ? user.institutionId : undefined;
      if (institutionId) {
        fetchInstitutionResults(institutionId, newFilters);
      } else {
        fetchResults(newFilters);
      }
    }
  }, [filters, instantSearch, isDataCached, user, isAdmin, fetchInstitutionResults, fetchResults]);

  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    handleFilterChange(newFilters);
  }, [filters, handleFilterChange]);

  // Handle sort changes - requires fresh data fetch
  const handleSortChange = useCallback((sortBy: string, sortOrder: SortOrder) => {
    const newFilters = { ...filters, sortBy, sortOrder, page: 1 };
    setFilters(newFilters);
    handleFilterChange(newFilters, true); // Force API call for sorting
  }, [filters, handleFilterChange]);

  // Handle view mode change
  const handleViewModeChange = useCallback((newViewMode: 'batch' | 'client') => {
    setViewMode(newViewMode);
    const resetFilters = {
      ...filters,
      search: '',
      page: 1,
      minCreditLimit: undefined,
      maxCreditLimit: undefined,
      minInterestRate: undefined,
      maxInterestRate: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      clientId: undefined,
    };
    setFilters(resetFilters);
    handleFilterChange(resetFilters);
  }, [filters, handleFilterChange]);

  // Handle advanced filter changes that might require API calls
  const handleAdvancedFilterChange = useCallback((filterKey: string, value: any) => {
    const newFilters = { ...filters, [filterKey]: value, page: 1 };
    setFilters(newFilters);
    
    // Advanced filters like date ranges might need fresh data
    const requiresApiCall = ['dateFrom', 'dateTo', 'minCreditLimit', 'maxCreditLimit', 'minInterestRate', 'maxInterestRate'].includes(filterKey);
    handleFilterChange(newFilters, requiresApiCall);
  }, [filters, handleFilterChange]);

  const handleViewDetails = (batchId: number) => {
    navigate(`/result/batch/${batchId}`);
  };

  const handleExport = async (batchId: number) => {
    try {
      await exportResults({
        uploadBatchId: batchId,
        format: 'csv'
      });
    } catch (error) {
      console.error('Error exporting results:', error);
      alert('Failed to export results. Please try again.');
    }
  };

  const handleViewClientDetails = async (clientId: number) => {
    try {
      const result = await getLatestClientResult(clientId);
      navigate(`/client/${clientId}`, { state: { result } });
    } catch (error) {
      console.error('Error fetching client details:', error);
      alert('Failed to fetch client details. Please try again.');
    }
  };

  const getRiskLevelColor = (avgCreditLimit: number) => {
    if (avgCreditLimit >= 1000000) return 'bg-green-100 text-green-800';
    if (avgCreditLimit >= 500000) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Force refresh data function
  const handleRefreshData = useCallback(async () => {
    if (!user) return;
    
    setFilterLoading(true);
    try {
      if (isAdmin) {
        await refreshData(filters);
      } else if (user.institutionId) {
        await refreshData(filters, user.institutionId);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setFilterLoading(false);
    }
  }, [user, isAdmin, filters, refreshData]);

  // Don't render if user is not loaded yet
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-gray-500 mt-4">Loading user data...</div>
        </div>
      </div>
    );
  }

  // Better loading state - only show for initial load or non-cached operations
  if (loading && !isDataCached) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-gray-500 mt-4">Loading results...</div>
        </div>
      </div>
    );
  }

  // Better error state with retry option
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Button 
            onClick={handleRefreshData}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Handle empty results
  const hasResults = results && results.length > 0;
  const hasBatchSummaries = batchSummaries.length > 0;

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Assessment Results
            {!isAdmin && user.institutionName && (
              <span className="text-lg font-normal text-gray-500 ml-2">
                - {user.institutionName}
              </span>
            )}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage credit scoring results
            {!isAdmin && " for your institution"}
            {isDataCached && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Data Cached - Instant Search
              </span>
            )}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button
            onClick={handleRefreshData}
            variant="outline"
            size="sm"
            disabled={filterLoading}
          >
            {filterLoading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      {/* Filter controls */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        {/* Loading indicator for filter changes (not search) */}
        {filterLoading && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm text-blue-700">Updating results...</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-4 items-end">
          {/* Search field - now with instant search indicator */}
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-gray-700" htmlFor="search-input">
              Search {isDataCached && <span className="text-green-600">(Instant)</span>}
            </label>
            <input
              id="search-input"
              type="text"
              className="form-input mt-1 block w-full"
              placeholder={viewMode === 'batch' ? "Client name, reference, or batch ID" : "Client name or reference"}
              value={filters.search}
              onChange={e => handleSearchChange(e.target.value)}
              disabled={filterLoading}
            />
          </div>
          
          {/* View mode toggle */}
          <div>
            <label className="block text-xs font-medium text-gray-700" htmlFor="viewmode-select">View</label>
            <select
              id="viewmode-select"
              className="form-select mt-1 block w-full"
              value={viewMode}
              onChange={e => handleViewModeChange(e.target.value as 'batch' | 'client')}
              disabled={filterLoading}
              title="View Mode"
            >
              <option value="batch">Batch Uploads</option>
              <option value="client">All Clients</option>
            </select>
          </div>
          
          {/* Sort By dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-700" htmlFor="sortby-select">Sort By</label>
            <select
              id="sortby-select"
              className="form-select mt-1 block w-full"
              value={filters.sortBy}
              onChange={e => handleSortChange(e.target.value, filters.sortOrder)}
              disabled={filterLoading}
              title="Sort By"
            >
              <option value="createdAt">Date Processed</option>
              <option value="credit_limit">Credit Limit</option>
              <option value="interest_rate">Interest Rate</option>
            </select>
          </div>
          
          {/* Sort Order dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-700" htmlFor="order-select">Order</label>
            <select
              id="order-select"
              className="form-select mt-1 block w-full"
              value={filters.sortOrder}
              onChange={e => handleSortChange(filters.sortBy, e.target.value as 'ASC' | 'DESC')}
              disabled={filterLoading}
              title="Order"
            >
              <option value="DESC">Descending</option>
              <option value="ASC">Ascending</option>
            </select>
          </div>
          
          {/* Page Size dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-700" htmlFor="pagesize-select">Page Size</label>
            <select
              id="pagesize-select"
              className="form-select mt-1 block w-full"
              value={filters.limit}
              onChange={e => handleAdvancedFilterChange('limit', Number(e.target.value))}
              disabled={filterLoading}
              title="Page Size"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Advanced filters - expandable section */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
            Advanced Filters
          </summary>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Credit Limit Range */}
            <div>
              <label className="block text-xs font-medium text-gray-700">Min Credit Limit (FCFA)</label>
              <input
                type="number"
                className="form-input mt-1 block w-full"
                placeholder="Min amount"
                value={filters.minCreditLimit || ''}
                onChange={e => {
                  const value = e.target.value ? Number(e.target.value) : undefined;
                  handleAdvancedFilterChange('minCreditLimit', value);
                }}
                disabled={filterLoading}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Max Credit Limit (FCFA)</label>
              <input
                type="number"
                className="form-input mt-1 block w-full"
                placeholder="Max amount"
                value={filters.maxCreditLimit || ''}
                onChange={e => {
                  const value = e.target.value ? Number(e.target.value) : undefined;
                  handleAdvancedFilterChange('maxCreditLimit', value);
                }}
                disabled={filterLoading}
              />
            </div>
            
            {/* Interest Rate Range */}
            <div>
              <label className="block text-xs font-medium text-gray-700">Min Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                className="form-input mt-1 block w-full"
                placeholder="Min rate"
                value={filters.minInterestRate || ''}
                onChange={e => {
                  const value = e.target.value ? Number(e.target.value) : undefined;
                  handleAdvancedFilterChange('minInterestRate', value);
                }}
                disabled={filterLoading}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Max Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                className="form-input mt-1 block w-full"
                placeholder="Max rate"
                value={filters.maxInterestRate || ''}
                onChange={e => {
                  const value = e.target.value ? Number(e.target.value) : undefined;
                  handleAdvancedFilterChange('maxInterestRate', value);
                }}
                disabled={filterLoading}
              />
            </div>
            
            {/* Date Range */}
            <div>
              <label className="block text-xs font-medium text-gray-700">Date From</label>
              <input
                type="date"
                className="form-input mt-1 block w-full"
                value={filters.dateFrom || ''}
                onChange={e => handleAdvancedFilterChange('dateFrom', e.target.value || undefined)}
                disabled={filterLoading}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Date To</label>
              <input
                type="date"
                className="form-input mt-1 block w-full"
                value={filters.dateTo || ''}
                onChange={e => handleAdvancedFilterChange('dateTo', e.target.value || undefined)}
                disabled={filterLoading}
              />
            </div>
            
            {/* Clear filters button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const resetFilters = {
                    ...filters,
                    search: '',
                    page: 1,
                    minCreditLimit: undefined,
                    maxCreditLimit: undefined,
                    minInterestRate: undefined,
                    maxInterestRate: undefined,
                    dateFrom: undefined,
                    dateTo: undefined,
                    clientId: undefined,
                  };
                  setFilters(resetFilters);
                  handleFilterChange(resetFilters);
                }}
                disabled={filterLoading}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </details>
      </div>

      {/* Summary section - only show if we have data */}
      {summary && (
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Overall Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Results</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.totalResults || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Average Credit Limit</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(summary.avgCreditLimit || 0)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Average Interest Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(summary.avgInterestRate || 0).toFixed(2)}%
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Credit Limit Range</p>
                <p className="text-sm font-medium">
                  {formatCurrency(summary.creditLimitRange?.min || 0)} - {formatCurrency(summary.creditLimitRange?.max || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Render either batch view or client view */}
      {viewMode === 'batch' ? (
        // Batch view: batch summary and table rendering
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Batch Assessment Results
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            {hasBatchSummaries ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Clients
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Credit Limit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Interest Rate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {batchSummaries.map((batch) => (
                    <tr key={batch.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleViewDetails(batch.id)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#07002F]">{batch.name}</div>
                        <div className="text-sm text-gray-500">{batch.filename}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(batch.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {batch.totalResults}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(batch.avgCreditLimit)}`}>
                          {formatCurrency(batch.avgCreditLimit)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {batch.avgInterestRate.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={e => { e.stopPropagation(); handleExport(batch.id); }}
                          >
                            Export
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500">No batch results found</div>
                {filters.search && (
                  <button 
                    className="mt-2 text-blue-600 hover:text-blue-800"
                    onClick={() => handleSearchChange('')}
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Pagination for batch view */}
          {pagination && hasBatchSummaries && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // All Clients view: flat table of all clients
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                All Clients
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            {hasResults ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Limit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Processed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Name</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{client.client?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{client.client?.reference_number || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{client.client?.phoneNumber || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {client.credit_limit !== undefined ? formatCurrency(client.credit_limit) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {client.interest_rate !== undefined ? `${client.interest_rate.toFixed(2)}%` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{client.createdAt ? formatDate(client.createdAt) : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{client.uploadBatch?.name || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500">No client results found</div>
                {filters.search && (
                  <button 
                    className="mt-2 text-blue-600 hover:text-blue-800"
                    onClick={() => handleSearchChange('')}
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Pagination for client view */}
          {pagination && hasResults && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AssessmentResults;