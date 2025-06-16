import React from 'react';
import { Result } from '../services/resultsService';
import { formatCurrency } from '../utils/formatters';

interface ClientResultHistoryProps {
  results: Result[];
  clientName: string;
  clientReference: string;
}

const ClientResultHistory: React.FC<ClientResultHistoryProps> = ({
  results,
  clientName,
  clientReference
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getChangeIndicator = (current: number, previous: number) => {
    if (!previous) return null;
    const change = current - previous;
    const percentage = (change / previous) * 100;
    
    return (
      <div className={`flex items-center text-sm ${
        change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
      }`}>
        <span className="mr-1">
          {change > 0 ? '↑' : change < 0 ? '↓' : '→'}
        </span>
        <span>
          {Math.abs(percentage).toFixed(1)}%
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Client Info */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{clientName}</h3>
        <p className="text-sm text-gray-500">Reference: {clientReference}</p>
      </div>

      {/* History Timeline */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Assessment History</h3>
        <div className="space-y-6">
          {results.map((result, index) => {
            const previousResult = index > 0 ? results[index - 1] : null;
            
            return (
              <div key={result.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-md font-medium text-gray-900">
                      {result.uploadBatch.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(result.createdAt)}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Batch: {result.uploadBatch.filename}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Credit Limit</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {formatCurrency(result.credit_limit)}
                        </p>
                      </div>
                      {previousResult && getChangeIndicator(
                        result.credit_limit,
                        previousResult.credit_limit
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm text-gray-500">
                          Weight: {(result.sum_normalised_credit_limit_weights * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Interest Rate</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {result.interest_rate.toFixed(2)}%
                        </p>
                      </div>
                      {previousResult && getChangeIndicator(
                        result.interest_rate,
                        previousResult.interest_rate
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm text-gray-500">
                          Weight: {(result.sum_normalised_interest_rate_weights * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClientResultHistory; 