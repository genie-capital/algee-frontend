import React, { useState } from 'react';
import { InfoIcon, ClockIcon, HistoryIcon } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Layout from '../components/Layout';
import { getParametersForInstitution, updateInstitutionParameterValue } from '../services/institutionParameterService';
import { useEffect } from 'react';

const ParametersConfig = () => {
  const [formData, setFormData] = useState({
    maxRiskyLoanAmount: '25000',
    minRiskyLoanAmount: '5000',
    incomeMultiplier: '3.5',
    minInterestRate: '4.5',
    maxInterestRate: '15.0',
    creditHistoryWeight: '8',
    incomeWeight: '10',
    employmentYearsWeight: '7',
    ageWeight: '5',
    existingLoansWeight: '6'
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would save the parameters to the server
    try {
      // You would need to map form fields back to parameter IDs
      // This is a simplified example
      for (const [key, value] of Object.entries(formData)) {
        // You would need to get the parameter ID for each key
        // const paramId = getParameterIdByName(key);
        // await updateInstitutionParameterValue(paramId, parseFloat(value));
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving parameters:', err);
    }
  };
  const handleReset = () => {
    // In a real application, this would reset to the last saved values
    setIsEditing(false);
  };
  return <Layout>
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
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  Loan Amount Parameters
                </h4>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <Input label="Maximum Risky Loan Amount" type="number" name="maxRiskyLoanAmount" id="maxRiskyLoanAmount" value={formData.maxRiskyLoanAmount} onChange={handleChange} disabled={!isEditing} required fullWidth />
                  </div>
                  <div className="sm:col-span-3">
                    <Input label="Minimum Risky Loan Amount" type="number" name="minRiskyLoanAmount" id="minRiskyLoanAmount" value={formData.minRiskyLoanAmount} onChange={handleChange} disabled={!isEditing} required fullWidth />
                  </div>
                  <div className="sm:col-span-3">
                    <Input label="Income Multiplier" type="number" name="incomeMultiplier" id="incomeMultiplier" value={formData.incomeMultiplier} onChange={handleChange} disabled={!isEditing} required fullWidth step="0.1" />
                    <p className="mt-1 text-xs text-gray-500">
                      Maximum loan amount as a multiple of annual income
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  Interest Rate Parameters
                </h4>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <Input label="Minimum Interest Rate (%)" type="number" name="minInterestRate" id="minInterestRate" value={formData.minInterestRate} onChange={handleChange} disabled={!isEditing} required fullWidth step="0.1" />
                  </div>
                  <div className="sm:col-span-3">
                    <Input label="Maximum Interest Rate (%)" type="number" name="maxInterestRate" id="maxInterestRate" value={formData.maxInterestRate} onChange={handleChange} disabled={!isEditing} required fullWidth step="0.1" />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  Variable Weights (0-10)
                </h4>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="creditHistoryWeight" className="block text-sm font-medium text-gray-700 mb-1">
                      Credit History Weight: {formData.creditHistoryWeight}
                    </label>
                    <input type="range" name="creditHistoryWeight" id="creditHistoryWeight" min="0" max="10" value={formData.creditHistoryWeight} onChange={handleChange} disabled={!isEditing} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="incomeWeight" className="block text-sm font-medium text-gray-700 mb-1">
                      Income Weight: {formData.incomeWeight}
                    </label>
                    <input type="range" name="incomeWeight" id="incomeWeight" min="0" max="10" value={formData.incomeWeight} onChange={handleChange} disabled={!isEditing} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="employmentYearsWeight" className="block text-sm font-medium text-gray-700 mb-1">
                      Employment Years Weight: {formData.employmentYearsWeight}
                    </label>
                    <input type="range" name="employmentYearsWeight" id="employmentYearsWeight" min="0" max="10" value={formData.employmentYearsWeight} onChange={handleChange} disabled={!isEditing} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="ageWeight" className="block text-sm font-medium text-gray-700 mb-1">
                      Age Weight: {formData.ageWeight}
                    </label>
                    <input type="range" name="ageWeight" id="ageWeight" min="0" max="10" value={formData.ageWeight} onChange={handleChange} disabled={!isEditing} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="existingLoansWeight" className="block text-sm font-medium text-gray-700 mb-1">
                      Existing Loans Weight: {formData.existingLoansWeight}
                    </label>
                    <input type="range" name="existingLoansWeight" id="existingLoansWeight" min="0" max="10" value={formData.existingLoansWeight} onChange={handleChange} disabled={!isEditing} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
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
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                    2023-10-10 09:15:32
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  John Smith
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Income Multiplier
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  3.0
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  3.5
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                    2023-10-05 14:22:45
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Sarah Johnson
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Maximum Interest Rate
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  18.0%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  15.0%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                    2023-09-28 11:05:18
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Michael Brown
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Credit History Weight
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  6
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  8
                </td>
              </tr>
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
    </Layout>;
};
export default ParametersConfig;