import React, { useState } from 'react';
import { InfoIcon } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Layout from '../components/Layout';
import { creditScoringService } from '../services/creditScoringService';
import { useAuth } from '../contexts/AuthContext';

const ClientAssessment = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clientRef: '',
    monthlyIncome: '',
    loanAmount: '',
    creditHistory: '',
    employmentYears: '',
    age: '',
    existingLoans: '',
    dependents: ''
  });
  const [result, setResult] = useState<null | {
    creditLimit: number;
    interestRate: number;
    originalCreditLimit: number;
    creditLimitCapped: boolean;
    calculationDetails: {
      clientIncome: number;
      institutionParams: {
        incomeMultiple: number;
        minLoanAmount: number;
        maxLoanAmount: number;
        maxInterestRate: number;
        minInterestRate: number;
      };
      weightScores: {
        creditLimitWeight: number;
        interestRateWeight: number;
        totalVariablesProcessed: number;
      };
    };
  }>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await creditScoringService.calculateClientResult(
        parseInt(formData.clientRef),
        undefined,
        user?.institutionId
      );

      if (response.success) {
        setResult({
          creditLimit: response.data.creditLimit,
          interestRate: response.data.interestRate,
          originalCreditLimit: response.data.originalCreditLimit,
          creditLimitCapped: response.data.creditLimitCapped,
          calculationDetails: response.data.calculationDetails
        });
      } else {
        setError(response.message || 'Failed to calculate credit score');
      }
    } catch (err) {
      setError('An error occurred while calculating the credit score');
      console.error('Error calculating credit score:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      clientRef: '',
      monthlyIncome: '',
      loanAmount: '',
      creditHistory: '',
      employmentYears: '',
      age: '',
      existingLoans: '',
      dependents: ''
    });
    setResult(null);
    setError(null);
  };

  return <Layout>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Individual Client Assessment
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter client information to calculate credit score and limits
          </p>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Client Information
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Input label="Client Reference Number" type="text" name="clientRef" id="clientRef" value={formData.clientRef} onChange={handleChange} required fullWidth placeholder="Enter client reference number" />
              <p className="mt-1 text-xs text-gray-500">
                For privacy, use reference number instead of personal
                identifiers
              </p>
            </div>
            <div className="sm:col-span-3">
              <Input label="Verified Monthly Income" type="number" name="monthlyIncome" id="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} required fullWidth placeholder="Enter monthly income" />
            </div>
            <div className="sm:col-span-3">
              <Input label="Requested Loan Amount" type="number" name="loanAmount" id="loanAmount" value={formData.loanAmount} onChange={handleChange} required fullWidth placeholder="Enter loan amount" />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="creditHistory" className="block text-sm font-medium text-gray-700 mb-1">
                Credit History (years)
              </label>
              <select id="creditHistory" name="creditHistory" value={formData.creditHistory} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#008401] focus:border-[#008401] sm:text-sm" required>
                <option value="">Select credit history</option>
                <option value="0">No credit history</option>
                <option value="1">Less than 1 year</option>
                <option value="2">1-2 years</option>
                <option value="5">3-5 years</option>
                <option value="10">6-10 years</option>
                <option value="15">More than 10 years</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <Input label="Years of Employment" type="number" name="employmentYears" id="employmentYears" value={formData.employmentYears} onChange={handleChange} required fullWidth placeholder="Enter years of employment" />
            </div>
            <div className="sm:col-span-3">
              <Input label="Age" type="number" name="age" id="age" value={formData.age} onChange={handleChange} required fullWidth placeholder="Enter client age" />
            </div>
            <div className="sm:col-span-3">
              <Input label="Number of Existing Loans" type="number" name="existingLoans" id="existingLoans" value={formData.existingLoans} onChange={handleChange} required fullWidth placeholder="Enter number of existing loans" />
            </div>
            <div className="sm:col-span-3">
              <Input label="Number of Dependents" type="number" name="dependents" id="dependents" value={formData.dependents} onChange={handleChange} required fullWidth placeholder="Enter number of dependents" />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <Button type="button" variant="outline" className="mr-3" onClick={handleReset}>
              Clear Form
            </Button>
            <Button type="submit">Calculate Credit Score</Button>
          </div>
        </form>
      </div>
      {result && <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-[#07002F] text-white">
            <h3 className="text-lg font-medium">Assessment Results</h3>
          </div>
          <div className="p-6">
            <div className="rounded-md bg-blue-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InfoIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Information
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      These results are based on the current parameters set by
                      your institution. You can adjust parameters in the system
                      settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Credit Limit Weight
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    <div className="flex items-center">
                      <span>{(result.calculationDetails.weightScores.creditLimitWeight * 100).toFixed(1)}%</span>
                    </div>
                  </dd>
                </div>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Recommended Credit Limit
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.creditLimit)}
                    {result.creditLimitCapped && (
                      <span className="ml-2 text-sm text-yellow-600">
                        (Capped from {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.originalCreditLimit)})
                      </span>
                    )}
                  </dd>
                </div>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Recommended Interest Rate
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {result.interestRate.toFixed(2)}%
                  </dd>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button variant="outline" className="mr-3">
                Export Report
              </Button>
              <Button variant="secondary">View Detailed Breakdown</Button>
            </div>
          </div>
        </div>}
    </Layout>;
};
export default ClientAssessment;