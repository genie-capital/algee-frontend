import React from 'react';
import { ComparisonResult } from '../services/resultsService';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface ResultsComparisonProps {
  comparison: ComparisonResult;
}

const ResultsComparison: React.FC<ResultsComparisonProps> = ({ comparison }) => {
  const { dataset1, dataset2, differences } = comparison;

  const renderDataset = (dataset: typeof dataset1, title: string) => (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Count</p>
          <p className="text-2xl font-semibold text-gray-900">{dataset.count}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Average Credit Limit</p>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(dataset.avgCreditLimit)}
          </p>
          <p className="text-sm text-gray-500">
            Range: {formatCurrency(dataset.creditLimitRange.min)} - {formatCurrency(dataset.creditLimitRange.max)}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Average Interest Rate</p>
          <p className="text-2xl font-semibold text-gray-900">
            {dataset.avgInterestRate.toFixed(2)}%
          </p>
          <p className="text-sm text-gray-500">
            Range: {dataset.interestRateRange.min.toFixed(2)}% - {dataset.interestRateRange.max.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );

  const renderDifferences = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Differences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Count Difference</p>
          <p className={`text-2xl font-semibold ${
            differences.countDiff > 0 ? 'text-green-600' : differences.countDiff < 0 ? 'text-red-600' : 'text-gray-900'
          }`}>
            {differences.countDiff > 0 ? '+' : ''}{differences.countDiff}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Credit Limit Difference</p>
          <p className={`text-2xl font-semibold ${
            differences.avgCreditLimitDiff > 0 ? 'text-green-600' : differences.avgCreditLimitDiff < 0 ? 'text-red-600' : 'text-gray-900'
          }`}>
            {differences.avgCreditLimitDiff > 0 ? '+' : ''}{formatCurrency(differences.avgCreditLimitDiff)}
          </p>
          <p className="text-sm text-gray-500">
            {differences.avgCreditLimitPercentChange > 0 ? '+' : ''}{differences.avgCreditLimitPercentChange.toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Interest Rate Difference</p>
          <p className={`text-2xl font-semibold ${
            differences.avgInterestRateDiff < 0 ? 'text-green-600' : differences.avgInterestRateDiff > 0 ? 'text-red-600' : 'text-gray-900'
          }`}>
            {differences.avgInterestRateDiff > 0 ? '+' : ''}{differences.avgInterestRateDiff.toFixed(2)}%
          </p>
          <p className="text-sm text-gray-500">
            {differences.avgInterestRatePercentChange > 0 ? '+' : ''}{differences.avgInterestRatePercentChange.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderDataset(dataset1, 'Dataset 1')}
      {renderDataset(dataset2, 'Dataset 2')}
      {renderDifferences()}
    </div>
  );
};

export default ResultsComparison; 