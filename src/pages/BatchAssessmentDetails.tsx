import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { resultsService, Result, BatchResultsResponse } from '../services/resultsService';

const BatchAssessmentDetails = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log('BatchAssessmentDetails mounted. batchId:', batchId);

  // Filters and state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [batchSummary, setBatchSummary] = useState<BatchResultsResponse['data']['batchSummary'] | null>(null);
  const [pagination, setPagination] = useState<BatchResultsResponse['data']['pagination'] | null>(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch batch results
  useEffect(() => {
    const fetchBatchResults = async () => {
      if (!batchId) {
        return;
      }
      const batchIdNum = typeof batchId === 'string' ? parseInt(batchId, 10) : batchId;
      setLoading(true);
      setError(null);
      try {
        const params: any = {
          page,
          limit,
          sortBy,
          sortOrder,
        };
        if (search) params.search = search;
        if (dateFrom) params.dateFrom = dateFrom;
        if (dateTo) params.dateTo = dateTo;
        const response = await resultsService.getResultsByBatch(batchIdNum, params);
        setResults(response.data.results);
        setBatchSummary(response.data.batchSummary);
        setPagination(response.data.pagination);
      } catch (err: any) {
        setError(err.message || 'Error fetching batch results');
      } finally {
        setLoading(false);
      }
    };
    fetchBatchResults();
  }, [batchId, search, sortBy, sortOrder, dateFrom, dateTo, page, limit]);

  const handleExport = async () => {
    try {
      const batchIdNum = typeof batchId === 'string' ? parseInt(batchId, 10) : batchId;
      await resultsService.exportResults({ uploadBatchId: batchIdNum, format: 'csv' });
    } catch (err) {
      setError('Error exporting results');
    }
  };

  // Date helpers
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading batch details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
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

      {/* Batch summary */}
      {batchSummary && (
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Batch Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Clients</p>
                <p className="text-2xl font-semibold text-gray-900">{batchSummary.totalClients}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Average Credit Limit</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {batchSummary.avgCreditLimit ? `${Number(batchSummary.avgCreditLimit).toFixed(2)} FCFA` : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Average Interest Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {batchSummary.avgInterestRate ? `${Number(batchSummary.avgInterestRate).toFixed(2)}%` : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Credit Limit</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {batchSummary.totalCreditLimit ? `${Number(batchSummary.totalCreditLimit).toFixed(2)} FCFA` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter controls */}
      <div className="bg-white shadow rounded-lg p-4 mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-700" htmlFor="search-input">Search</label>
          <input
            id="search-input"
            type="text"
            className="form-input mt-1 block w-full"
            placeholder="Client name or reference..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700" htmlFor="sortby-select">Sort By</label>
          <select
            id="sortby-select"
            className="form-select mt-1 block w-full"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            title="Sort By"
          >
            <option value="createdAt">Date Processed</option>
            <option value="credit_limit">Credit Limit</option>
            <option value="interest_rate">Interest Rate</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700" htmlFor="order-select">Order</label>
          <select
            id="order-select"
            className="form-select mt-1 block w-full"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as 'ASC' | 'DESC')}
            title="Order"
          >
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700" htmlFor="datefrom-input">Date From</label>
          <input
            id="datefrom-input"
            type="date"
            className="form-input mt-1 block w-full"
            value={dateFrom}
            onChange={e => { setDateFrom(e.target.value); setPage(1); }}
            title="Date From"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700" htmlFor="dateto-input">Date To</label>
          <input
            id="dateto-input"
            type="date"
            className="form-input mt-1 block w-full"
            value={dateTo}
            onChange={e => { setDateTo(e.target.value); setPage(1); }}
            title="Date To"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700" htmlFor="pagesize-select">Page Size</label>
          <select
            id="pagesize-select"
            className="form-select mt-1 block w-full"
            value={limit}
            onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
            title="Page Size"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Results table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Clients in Batch
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{client.client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.client.reference_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.client.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.credit_limit !== undefined ? client.credit_limit : '-'}FCFA</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.interest_rate !== undefined ? client.interest_rate : '-'}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.createdAt ? formatDate(client.createdAt) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-2">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => setPage(page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() => setPage(page + 1)}
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
                  onClick={() => setPage(page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BatchAssessmentDetails; 