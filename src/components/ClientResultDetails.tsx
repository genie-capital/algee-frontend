import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useResults } from '../hooks/useResults';
import { Result } from '../services/resultsService';
import { ArrowLeftIcon } from 'lucide-react';
import Button from './common/Button';

const ClientResultDetails: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { uploadBatchId } = location.state || {};
  const { getLatestClientResult, loading, error } = useResults();
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (clientId) {
        try {
          const response = await getLatestClientResult(parseInt(clientId), uploadBatchId);
          setResult(response);
        } catch (error) {
          console.error('Error fetching client result:', error);
        }
      }
    };
    fetchResult();
  }, [clientId, uploadBatchId, getLatestClientResult]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading result details...</div>
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

  if (!result) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No result found</div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getRiskLevelColor = (weight: number) => {
    if (weight >= 0.8) return 'bg-green-100 text-green-800';
    if (weight >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Client Result Details
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {result.client.name} - {result.client.reference_number}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
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

      <div className="grid grid-cols-1 gap-6">
        {/* Client Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-sm font-medium text-gray-900">{result.client.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Reference Number</p>
              <p className="text-sm font-medium text-gray-900">{result.client.reference_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{result.client.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-sm font-medium text-gray-900">{result.client.phoneNumber}</p>
            </div>
          </div>
        </div>

        {/* Assessment Results */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Assessment Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Credit Limit</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(result.credit_limit)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Interest Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {result.interest_rate.toFixed(2)}%
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Credit Limit Weight</p>
              <div className="flex items-center">
                <div className={`h-2.5 w-2.5 rounded-full mr-2 ${
                  getRiskLevelColor(result.sum_normalised_credit_limit_weights)
                }`}></div>
                <span className="text-lg font-semibold text-gray-900">
                  {formatPercentage(result.sum_normalised_credit_limit_weights)}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Interest Rate Weight</p>
              <div className="flex items-center">
                <div className={`h-2.5 w-2.5 rounded-full mr-2 ${
                  getRiskLevelColor(result.sum_normalised_interest_rate_weights)
                }`}></div>
                <span className="text-lg font-semibold text-gray-900">
                  {formatPercentage(result.sum_normalised_interest_rate_weights)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Batch Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Batch Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Batch Name</p>
              <p className="text-sm font-medium text-gray-900">{result.uploadBatch.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Filename</p>
              <p className="text-sm font-medium text-gray-900">{result.uploadBatch.filename}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Assessment Date</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(result.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Result ID</p>
              <p className="text-sm font-medium text-gray-900">{result.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientResultDetails; 