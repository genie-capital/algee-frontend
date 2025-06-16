import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useResults } from '../hooks/useResults';
import { DetailedResult } from '../services/resultsService';

const ClientResultDetails: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { getDetailedClientResult, loading, error } = useResults();
  const [result, setResult] = useState<DetailedResult | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (clientId) {
        try {
          const data = await getDetailedClientResult(parseInt(clientId));
          setResult(data);
        } catch (error) {
          console.error('Error fetching client result:', error);
        }
      }
    };
    fetchResult();
  }, [clientId, getDetailedClientResult]);

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

  const { clientResult, variableBreakdown, totalVariables, categoriesCount } = result;

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

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Result Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Credit Limit</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(clientResult.creditLimit)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Interest Rate</p>
            <p className="text-2xl font-semibold text-gray-900">
              {clientResult.interestRate.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Variables</p>
            <p className="text-2xl font-semibold text-gray-900">{totalVariables}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Categories</p>
            <p className="text-2xl font-semibold text-gray-900">{categoriesCount}</p>
          </div>
        </div>
      </div>

      {/* Variable Breakdown */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Variable Breakdown</h3>
        <div className="space-y-6">
          {Object.entries(variableBreakdown).map(([category, variables]) => (
            <div key={category} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
              <h4 className="text-md font-medium text-gray-900 mb-3">{category}</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variable
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Raw Value
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Normalized
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credit Limit Weight
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interest Rate Weight
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category Weights
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {variables.map((variable) => (
                      <tr key={variable.variableId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{variable.variableName}</div>
                          <div className="text-sm text-gray-500">Code: {variable.uniqueCode}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {variable.responseType === 'int_float' 
                            ? formatCurrency(variable.rawValue as number)
                            : variable.rawValue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatPercentage(variable.normalizedValue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatPercentage(variable.creditLimitWeight)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatPercentage(variable.interestRateWeight)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>CL: {formatPercentage(variable.categoryWeights.creditLimit)}</div>
                          <div>IR: {formatPercentage(variable.categoryWeights.interestRate)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientResultDetails; 