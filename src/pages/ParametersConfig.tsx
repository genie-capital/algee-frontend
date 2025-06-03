import React, { useState } from 'react';
import { InfoIcon, ClockIcon, HistoryIcon } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Layout from '../components/Layout';
import { getParametersForInstitution, updateInstitutionParameterValue } from '../services/institutionParameterService';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ParameterInfo {
  name: string;
  description: string;
  recommendedRange: string;
  impact: string;
}

const ParametersConfig = () => {
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null);
  const parameterInfo: Record<string, ParameterInfo> = {
    maxRiskyLoanAmount: {
      name: 'Maximum Loan Amount',
      description: 'The maximum amount that can be loaned to a client with a risky profile. Loans above this amount will require additional approval.',
      recommendedRange: 'XAF1,000,000 - XAF100,000,000',
      impact: 'Higher values increase potential exposure to default risk but may increase business volume.'
    },
    minRiskyLoanAmount: {
      name: 'Minimum Loan Amount',
      description: 'The minimum amount that can be loaned to a client with a risky profile. Loans below this amount may not be profitable.',
      recommendedRange: 'XAF20,000 -XAF50,000',
      impact: 'Lower values may increase client base but could reduce profitability per loan.'
    },
    incomeMultiplier: {
      name: 'Income Multiplier',
      description: 'The factor by which a client\'s income is multiplied to determine maximum loan eligibility.',
      recommendedRange: '1.5 - 5.0',
      impact: 'Higher values allow larger loans relative to income, increasing both opportunity and risk.'
    },
    minInterestRate: {
      name: 'Minimum Interest Rate',
      description: 'The lowest interest rate that can be offered to any client, regardless of credit score.',
      recommendedRange: '1.5% - 3.5%',
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
      recommendedRange: 'XAF50,000 - XAF100,000',
      impact: 'Higher thresholds reduce risk but may exclude potential clients.'
    }
  };

  const showParameterInfo = (paramName: string) => {
    setSelectedParameter(selectedParameter === paramName ? null : paramName);
  };
  const [formData, setFormData] = useState({
    maxRiskyLoanAmount: '1000000',
    minRiskyLoanAmount: '20000',
    incomeMultiplier: '1.5',
    minInterestRate: '1.5',
    maxInterestRate: '15',
    verifiedMonthlyIncomeThreshold: '50000',
    // creditHistoryWeight: '8',
    // incomeWeight: '10',
    // employmentYearsWeight: '7',
    // ageWeight: '5',
    // existingLoansWeight: '6'
  });
  const [currency, setCurrency] = useState('USD');
  const [isEditing, setIsEditing] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [institutionId, setInstitutionId] = useState(1); // Get from auth context in real app

  const [historyData, setHistoryData] = useState<Array<any>>([]);


  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await getParametersForInstitution(institutionId);
        // Transform API response to match your form structure
        const paramData = {};
        response.data.data.forEach((param: { name: string; value: number | string }) => {
          // Map parameter names to form fields
          // This mapping would depend on your actual parameter names
          (paramData as Record<string, string>)[param.name.toLowerCase().replace(/ /g, '')] = param.value.toString();
        });
        setFormData(prevData => ({
          ...prevData,
          ...paramData as typeof prevData
        }));
      } catch (err) {
        setError('Failed to load parameters');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchParameters();
  }, [institutionId]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getParametersForInstitution(institutionId);
        setHistoryData(response.data);
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };
    fetchHistory();
  }, [institutionId]);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real application, this would save the parameters to the server
      // You would need to map form fields back to parameter IDs
      // This is a simplified example
      for (const [key, value] of Object.entries(formData)) {
        // You would need to get the parameter ID for each key
        // const paramId = getParameterIdByName(key);
        // await updateInstitutionParameterValue(paramId, parseFloat(value));
      }
      setIsEditing(false);
      navigate('/workspace-dashboard');
    } catch (err) {
      console.error('Error saving parameters:', err);
    }
  };
  const handleReset = () => {
    // In a real application, this would reset to the last saved values
    setIsEditing(false);
  };
  return <>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Parameters Configuration
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure the credit scoring algorithm parameters for your
            institution
          </p>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Credit Algorithm Parameters
            </h3>
            {!isEditing ? <Button onClick={() => setIsEditing(true)}>
                Edit Parameters
              </Button> : <div className="flex space-x-2">
                <Button variant="outline" onClick={handleReset}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Save Changes</Button>
              </div>}
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
                    Changes to these parameters will affect all future credit
                    assessments. Historical assessments will not be affected.
                    All changes are logged for audit purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
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
                        <span className="text-gray-500 sm:text-sm"></span>
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
                        <span className="text-gray-500 sm:text-sm"></span>
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

                  {/*Currency Symbol */}
                  <div className="sm:col-span-1">
                      <div className="flex items-center justify-between">
                        <label htmlFor="Currency" className="block text-sm font-medium text-gray-700">
                          Currency
                        </label>
                        <InfoIcon
                          className="h-4 w-4 text-gray-400 cursor-help"
                          aria-label="Base currency for all monetary values"
                        />
                      </div>
                      <select
                        aria-label="Currency selection"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="USD">United States Dollar (USD)</option>
                        <option value="XAF">West African Francs (XAF)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">British Pound (GBP)</option>
                      </select>
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
                        <span className="text-gray-500 sm:text-sm"></span>
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
          </form>
        </div>
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Parameter Change History
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parameter
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Old Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historyData.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.parameterName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.oldValue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.newValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-center">
            <Button variant="outline" size="sm">
              <HistoryIcon className="h-4 w-4 mr-1" />
              View Full History
            </Button>
          </div>
        </div>
      </div>
    </>
};
export default ParametersConfig;