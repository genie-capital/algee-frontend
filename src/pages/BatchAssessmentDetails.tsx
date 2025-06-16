import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import ProcessingModal from '../components/ProcessingModal';
import { useResults } from '../hooks/useResults';
import { Result } from '../services/resultsService';

const BatchAssessmentDetails = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    loading,
    error,
    results,
    pagination,
    summary,
    getResultsByBatch,
    exportResults
  } = useResults();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'DESC' as const,
    search: ''
  });

  useEffect(() => {
    const fetchBatchResults = async () => {
      if (batchId) {
        await getResultsByBatch(parseInt(batchId), filters);
      }
    };

    fetchBatchResults();
  }, [batchId, filters, getResultsByBatch]);

  const handleViewResults = () => {
    navigate(`/batch/${batchId}/results`);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleExport = async () => {
    if (batchId) {
      await exportResults({
        uploadBatchId: parseInt(batchId),
        format: 'csv'
      });
    }
  };

  const getRiskLevelColor = (weight: number) => {
    if (weight >= 0.8) return 'bg-green-100 text-green-800';
    if (weight >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!results) {
    return <div>No batch details found</div>;
  }

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Batch Assessment Details
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View detailed results for batch {batchId}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Button
            variant="outline"
            onClick={handleExport}
          >
            Export Results
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Batch Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Records</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.totalResults}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Average Credit Limit</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.avgCreditLimit)}
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
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.creditLimitRange.min)} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.creditLimitRange.max)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Client Assessments
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Limit Weight
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Limit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interest Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#07002F]">{result.client.name}</div>
                    <div className="text-sm text-gray-500">{result.client.reference_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full mr-2 ${
                        getRiskLevelColor(result.sum_normalised_credit_limit_weights)
                      }`}></div>
                      <span className="text-sm text-gray-900">
                        {(result.sum_normalised_credit_limit_weights * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.credit_limit)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.interest_rate.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(result.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

export default BatchAssessmentDetails; 