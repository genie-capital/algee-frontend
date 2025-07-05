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

type ViewMode = 'batches' | 'clients';

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

  const [viewMode, setViewMode] = useState<ViewMode>('batches');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC' as const,
    search: '',
    uploadBatchId: undefined as number | undefined
  });

  useEffect(() => {
    fetchResults(filters);
  }, [filters, fetchResults]);

  const handleViewDetails = (batchId: number) => {
    setSelectedBatchId(batchId);
    setViewMode('clients');
    setFilters(prev => ({ ...prev, uploadBatchId: batchId }));
  };

  const handleExport = async (batchId: number) => {
    try {
      await exportResults({
        uploadBatchId: batchId,
        format: 'csv'
      });
    } catch (error) {
      console.error('Error exporting results:', error);
    }
  };

  const handleViewClientDetails = async (clientId: number) => {
    try {
      const result = await getLatestClientResult(clientId);
      navigate(`/client/${clientId}`, { state: { result } });
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };

  const getRiskLevelColor = (avgCreditLimit: number) => {
    if (avgCreditLimit >= 1000000) return 'bg-green-100 text-green-800';
    if (avgCreditLimit >= 500000) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Group results by batch
  const batchSummaries: BatchSummary[] = results.reduce((acc: BatchSummary[], result: Result) => {
    const existingBatch = acc.find(batch => batch.id === result.uploadBatchId);
    
    if (existingBatch) {
      return acc;
    }

    const batchResults = results.filter(r => r.uploadBatchId === result.uploadBatchId);
    const avgCreditLimit = batchResults.reduce((sum, r) => sum + r.credit_limit, 0) / batchResults.length;
    const avgInterestRate = batchResults.reduce((sum, r) => sum + r.interest_rate, 0) / batchResults.length;
    const creditLimits = batchResults.map(r => r.credit_limit);

    acc.push({
      id: result.uploadBatchId,
      name: result.uploadBatch.name,
      filename: result.uploadBatch.filename,
      createdAt: result.createdAt,
      totalResults: batchResults.length,
      avgCreditLimit,
      avgInterestRate,
      creditLimitRange: {
        min: Math.min(...creditLimits),
        max: Math.max(...creditLimits)
      }
    });

    return acc;
  }, []);

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading results...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </>
    );
  }

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
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          {viewMode === 'clients' && (
            <Button
              variant="outline"
              onClick={() => {
                setViewMode('batches');
                setSelectedBatchId(null);
                setFilters(prev => ({ ...prev, uploadBatchId: undefined }));
              }}
            >
              Back to Batches
            </Button>
          )}
        </div>
      </div>

      {summary && viewMode === 'batches' && (
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Overall Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Results</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.totalResults}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Average Credit Limit</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(summary.avgCreditLimit)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Average Interest Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {summary.avgInterestRate.toFixed(2)}%
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Credit Limit Range</p>
                <p className="text-sm font-medium">
                  {formatCurrency(summary.creditLimitRange.min)} - {formatCurrency(summary.creditLimitRange.max)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              {viewMode === 'batches' ? 'Batch Assessment Results' : 'Client Assessment Results'}
            </h3>
            {viewMode === 'clients' && (
              <div className="flex-1 max-w-xs ml-4">
                <input
                  type="text"
                  placeholder="Search clients..."
                  className="form-input w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {viewMode === 'batches' ? (
          <div className="overflow-x-auto">
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
                  <tr key={batch.id}>
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
                          onClick={() => handleViewDetails(batch.id)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(batch.id)}
                        >
                          Export
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assessment Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit Limit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results
                  .filter(result => 
                    searchQuery === '' ||
                    result.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    result.client.reference_number.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((result) => (
                    <tr key={result.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#07002F]">{result.client.name}</div>
                        <div className="text-sm text-gray-500">{result.client.reference_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(result.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(result.credit_limit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.interest_rate.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.uploadBatch.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewClientDetails(result.clientId)}
                          >
                            View Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && (
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
                  Showing <span className="font-medium">{pagination.page}</span> to{' '}
                  <span className="font-medium">{pagination.totalPages}</span> of{' '}
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
    </>
  );
};

export default AssessmentResults;