import React, { useState } from 'react';
import { InfoIcon, HistoryIcon, RefreshCcwIcon, SaveIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Layout from '../components/Layout';

interface ParameterInfo {
  name: string;
  description: string;
  recommendedRange: string;
  impact: string;
}

const CreditParametersConfig = () => {
  const [formData, setFormData] = useState({
    maxRiskyLoanAmount: '25000',
    minRiskyLoanAmount: '5000',
    incomeMultiplier: '3.5',
    minInterestRate: '4.5',
    maxInterestRate: '15.0',
    verifiedMonthlyIncomeThreshold: '3000'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('October 15, 2023 14:30:25');
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null);
  const navigate = useNavigate();

  const parameterInfo: Record<string, ParameterInfo> = {
    maxRiskyLoanAmount: {
      name: 'Maximum Loan Amount',
      description: 'The maximum amount that can be loaned to a client with a risky profile. Loans above this amount will require additional approval.',
      recommendedRange: '$20,000 - $50,000',
      impact: 'Higher values increase potential exposure to default risk but may increase business volume.'
    },
    minRiskyLoanAmount: {
      name: 'Minimum Loan Amount',
      description: 'The minimum amount that can be loaned to a client with a risky profile. Loans below this amount may not be profitable.',
      recommendedRange: '$3,000 - $10,000',
      impact: 'Lower values may increase client base but could reduce profitability per loan.'
    },
    incomeMultiplier: {
      name: 'Income Multiplier',
      description: 'The factor by which a client\'s income is multiplied to determine maximum loan eligibility.',
      recommendedRange: '2.5 - 4.0',
      impact: 'Higher values allow larger loans relative to income, increasing both opportunity and risk.'
    },
    minInterestRate: {
      name: 'Minimum Interest Rate',
      description: 'The lowest interest rate that can be offered to any client, regardless of credit score.',
      recommendedRange: '3.0% - 5.0%',
      impact: 'Lower rates may attract more clients but will reduce profit margins.'
    },
    maxInterestRate: {
      name: 'Maximum Interest Rate',
      description: 'The highest interest rate that can be charged to clients with the lowest credit scores.',
      recommendedRange: '12.0% - 18.0%',
      impact: 'Higher rates increase profitability for risky loans but may reduce application volume.'
    },
    verifiedMonthlyIncomeThreshold: {
      name: 'Verified Monthly Income Threshold',
      description: 'The minimum monthly income required for a client to be eligible for standard loan processing.',
      recommendedRange: '$2,500 - $4,000',
      impact: 'Higher thresholds reduce risk but may exclude potential clients.'
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would save the parameters to the server
    setIsEditing(false);
    setLastUpdated(new Date().toLocaleString());

    // Redirect to the dashboard page after saving
    navigate('/workspace-dashboard');
  };

  const handleReset = () => {
    // Reset to default values
    setFormData({
      maxRiskyLoanAmount: '30000',
      minRiskyLoanAmount: '5000',
      incomeMultiplier: '3.0',
      minInterestRate: '4.0',
      maxInterestRate: '16.0',
      verifiedMonthlyIncomeThreshold: '3000'
    });
  };

  const showParameterInfo = (paramName: string) => {
    setSelectedParameter(selectedParameter === paramName ? null : paramName);
  };

  return (
    <Layout>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Credit Algorithm Parameters
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure the parameters that govern your institution's credit scoring algorithm
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Parameter Configuration
            </h3>
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="rounded-md bg-blue-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <InfoIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Important Information
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Changes to these parameters will affect all future credit assessments. 
                    Historical assessments will not be affected. All changes are logged for audit purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Parameter Fields */}
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {/* Max Risky Loan Amount */}
                <div className="sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="maxRiskyLoanAmount" className="block text-sm font-medium text-gray-700">
                      Maximum Loan Amount
                    </label>
                    <button
                      aria-label="Show information about Maximum Loan Amount"
                      type="button" 
                      className="text-[#008401] hover:text-[#006401] text-sm"
                      onClick={() => showParameterInfo('maxRiskyLoanAmount')}
                    >
                      <InfoIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      type="number"
                      name="maxRiskyLoanAmount"
                      id="maxRiskyLoanAmount"
                      value={formData.maxRiskyLoanAmount}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      fullWidth
                      className="pl-7"
                    />
                  </div>
                  {selectedParameter === 'maxRiskyLoanAmount' && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                      <p><strong>Description:</strong> {parameterInfo.maxRiskyLoanAmount.description}</p>
                      <p className="mt-1"><strong>Recommended Range:</strong> {parameterInfo.maxRiskyLoanAmount.recommendedRange}</p>
                      <p className="mt-1"><strong>Business Impact:</strong> {parameterInfo.maxRiskyLoanAmount.impact}</p>
                    </div>
                  )}
                </div>

                {/* Min Risky Loan Amount */}
                <div className="sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="minRiskyLoanAmount" className="block text-sm font-medium text-gray-700">
                      Minimum Loan Amount
                    </label>
                    <button
                      aria-label="Show information about Minimum Loan Amount"
                      type="button" 
                      className="text-[#008401] hover:text-[#006401] text-sm"
                      onClick={() => showParameterInfo('minRiskyLoanAmount')}
                    >
                      <InfoIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      type="number"
                      name="minRiskyLoanAmount"
                      id="minRiskyLoanAmount"
                      value={formData.minRiskyLoanAmount}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      fullWidth
                      className="pl-7"
                    />
                  </div>
                  {selectedParameter === 'minRiskyLoanAmount' && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                      <p><strong>Description:</strong> {parameterInfo.minRiskyLoanAmount.description}</p>
                      <p className="mt-1"><strong>Recommended Range:</strong> {parameterInfo.minRiskyLoanAmount.recommendedRange}</p>
                      <p className="mt-1"><strong>Business Impact:</strong> {parameterInfo.minRiskyLoanAmount.impact}</p>
                    </div>
                  )}
                </div>

                {/* Income Multiplier */}
                <div className="sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="incomeMultiplier" className="block text-sm font-medium text-gray-700">
                      Income Multiplier
                    </label>
                    <button
                      aria-label="Show information about Income Multiplier"
                      type="button" 
                      className="text-[#008401] hover:text-[#006401] text-sm"
                      onClick={() => showParameterInfo('incomeMultiplier')}
                    >
                      <InfoIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <Input
                    type="number"
                    name="incomeMultiplier"
                    id="incomeMultiplier"
                    value={formData.incomeMultiplier}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    fullWidth
                    step="0.1"
                  />
                  {selectedParameter === 'incomeMultiplier' && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                      <p><strong>Description:</strong> {parameterInfo.incomeMultiplier.description}</p>
                      <p className="mt-1"><strong>Recommended Range:</strong> {parameterInfo.incomeMultiplier.recommendedRange}</p>
                      <p className="mt-1"><strong>Business Impact:</strong> {parameterInfo.incomeMultiplier.impact}</p>
                    </div>
                  )}
                </div>

                {/* Verified Monthly Income Threshold */}
                <div className="sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="verifiedMonthlyIncomeThreshold" className="block text-sm font-medium text-gray-700">
                      Verified Monthly Income Threshold
                    </label>
                    <button
                      aria-label="Show information about Verified Monthly Income Threshold"
                      type="button" 
                      className="text-[#008401] hover:text-[#006401] text-sm"
                      onClick={() => showParameterInfo('verifiedMonthlyIncomeThreshold')}
                    >
                      <InfoIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      type="number"
                      name="verifiedMonthlyIncomeThreshold"
                      id="verifiedMonthlyIncomeThreshold"
                      value={formData.verifiedMonthlyIncomeThreshold}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      fullWidth
                      className="pl-7"
                    />
                  </div>
                  {selectedParameter === 'verifiedMonthlyIncomeThreshold' && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                      <p><strong>Description:</strong> {parameterInfo.verifiedMonthlyIncomeThreshold.description}</p>
                      <p className="mt-1"><strong>Recommended Range:</strong> {parameterInfo.verifiedMonthlyIncomeThreshold.recommendedRange}</p>
                      <p className="mt-1"><strong>Business Impact:</strong> {parameterInfo.verifiedMonthlyIncomeThreshold.impact}</p>
                    </div>
                  )}
                </div>

                {/* Min Interest Rate */}
                <div className="sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="minInterestRate" className="block text-sm font-medium text-gray-700">
                      Minimum Interest Rate (%)
                    </label>
                    <button
                      title="Show information about Minimum Interest Rate"
                      type="button" 
                      className="text-[#008401] hover:text-[#006401] text-sm"
                      onClick={() => showParameterInfo('minInterestRate')}
                    >
                      <InfoIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <Input
                    type="number"
                    name="minInterestRate"
                    id="minInterestRate"
                    value={formData.minInterestRate}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    fullWidth
                    step="0.1"
                  />
                  {selectedParameter === 'minInterestRate' && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                      <p><strong>Description:</strong> {parameterInfo.minInterestRate.description}</p>
                      <p className="mt-1"><strong>Recommended Range:</strong> {parameterInfo.minInterestRate.recommendedRange}</p>
                      <p className="mt-1"><strong>Business Impact:</strong> {parameterInfo.minInterestRate.impact}</p>
                    </div>
                  )}
                </div>

                {/* Max Interest Rate */}
                <div className="sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="maxInterestRate" className="block text-sm font-medium text-gray-700">
                      Maximum Interest Rate (%)
                    </label>
                    <button
                      title="Show information about Maximum Interest Rate"
                      type="button" 
                      className="text-[#008401] hover:text-[#006401] text-sm"
                      onClick={() => showParameterInfo('maxInterestRate')}
                    >
                      <InfoIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <Input
                    type="number"
                    name="maxInterestRate"
                    id="maxInterestRate"
                    value={formData.maxInterestRate}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    fullWidth
                    step="0.1"
                  />
                  {selectedParameter === 'maxInterestRate' && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                      <p><strong>Description:</strong> {parameterInfo.maxInterestRate.description}</p>
                      <p className="mt-1"><strong>Recommended Range:</strong> {parameterInfo.maxInterestRate.recommendedRange}</p>
                      <p className="mt-1"><strong>Business Impact:</strong> {parameterInfo.maxInterestRate.impact}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Parameters
                </Button>
              ) : (
                <div className="flex space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleReset}
                  >
                    <RefreshCcwIcon className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreditParametersConfig;