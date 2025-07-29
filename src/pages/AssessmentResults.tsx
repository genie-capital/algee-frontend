import React, { useEffect, useState } from 'react';
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
  const {
    loading,
    error,
    results,
    pagination,
    summary,
    fetchResults,
    exportResults,
    getLatestClientResult
  } = useResults();

  // Add new state for view mode (batch or client)
  const [viewMode, setViewMode] = useState<'batch' | 'client'>('batch');

  // Simplified filters state
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC' as SortOrder,
    search: '', // for client name, reference, or batch ID
  });

  // Add error handling and API call debugging
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Build params for API with better validation
        const params: any = {
          page: filters.page,
          limit: filters.limit,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        };

        // Handle search parameter more safely
        if (filters.search && filters.search.trim()) {
          if (viewMode === 'batch') {
            // In batch view: if search is numeric, treat as batch ID; else, as client name/reference
            if (/^\d+$/.test(filters.search.trim())) {
              params.uploadBatchId = Number(filters.search.trim());
            } else {
              params.search = filters.search.trim();
            }
          } else {
            // In client view: always treat as client name/reference
            params.search = filters.search.trim();
          }
        }

        console.log('API Params being sent:', params); // Debug log
        await fetchResults(params);
      } catch (err) {
        console.error('Error fetching results:', err);
      }
    };

    fetchData();
  }, [filters, fetchResults, viewMode]);

  const handleViewDetails = (batchId: number) => {
    navigate(`/results/batch/${batchId}`);
  };

  const handleExport = async (batchId: number) => {
    try {
      await exportResults({
        uploadBatchId: batchId,
        format: 'csv'
      });
    } catch (error) {
      console.error('Error exporting results:', error);
      // Add user-friendly error handling here
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

  // Group results by batch with better error handling
  const batchSummaries: BatchSummary[] = React.useMemo(() => {
    if (!results || results.length === 0) return [];
    
    return results.reduce((acc: BatchSummary[], result: Result) => {
      if (!result.uploadBatchId) return acc;
      
      const existingBatch = acc.find(batch => batch.id === result.uploadBatchId);
      if (existingBatch) {
        return acc;
      }
      
      const batchResults = results.filter(r => r.uploadBatchId === result.uploadBatchId);
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
  }, [results]);

  // Better loading state
  if (loading) {
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
            onClick={() => window.location.reload()} 
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
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage credit scoring results
          </p>
        </div>
      </div>

      {/* Filter controls */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 flex flex-wrap gap-4 items-end">
        {/* Search field */}
        <div>
          <label className="block text-xs font-medium text-gray-700" htmlFor="search-input">Search</label>
          <input
            id="search-input"
            type="text"
            className="form-input mt-1 block w-full"
            placeholder={viewMode === 'batch' ? "Client name, reference, or batch ID" : "Client name or reference"}
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
          />
        </div>
        {/* Batch/Client toggle dropdown */}
        <div>
          <label className="block text-xs font-medium text-gray-700" htmlFor="viewmode-select">View</label>
          <select
            id="viewmode-select"
            className="form-select mt-1 block w-full"
            value={viewMode}
            onChange={e => {
              setViewMode(e.target.value as 'batch' | 'client');
              setFilters(f => ({ ...f, search: '', page: 1 })); // Clear search when switching views
            }}
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
            onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value, page: 1 }))}
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
            onChange={e => setFilters(f => ({ ...f, sortOrder: e.target.value as 'ASC' | 'DESC', page: 1 }))}
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
            onChange={e => setFilters(f => ({ ...f, limit: Number(e.target.value), page: 1 }))}
            title="Page Size"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
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
                    onClick={() => setFilters(f => ({ ...f, search: '', page: 1 }))}
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
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
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
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
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
                    onClick={() => setFilters(f => ({ ...f, search: '', page: 1 }))}
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
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
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
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
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