import React, { useState, useEffect } from 'react';
import { InfoIcon, ClockIcon, HistoryIcon, RefreshCcwIcon, SaveIcon } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Layout from '../components/Layout';
import creditParametersService, { InstitutionParameter, CreditParameter } from '../services/creditParametersService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ParameterInfo {
  name: string;
  description: string;
  recommendedRange: string;
  impact: string;
}

const ParametersConfig = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [parameters, setParameters] = useState<InstitutionParameter[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('October 15, 2023 14:30:25');
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState<Array<any>>([]);
  const navigate = useNavigate();

  // Fetch parameter templates and institution values
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user?.institutionId) {
        toast.error('Authentication required');
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch all available parameters
        const parametersResponse = await creditParametersService.getAllInstitutionParameters();
        if (parametersResponse.success) {
          setParameters(parametersResponse.data.filter(param => param.isActive));
        }

        // Fetch current parameter values
        const valuesResponse = await creditParametersService.getInstitutionParameters(user.institutionId);
        
        if (valuesResponse.success && valuesResponse.data) {
          // Map API response to form data
          const newFormData: Record<string, string> = {};
          valuesResponse.data.forEach(param => {
            const parameter = parametersResponse.data.find(p => p.id === param.parameterId);
            if (parameter) {
              newFormData[parameter.uniqueCode] = param.value.toString();
            }
          });
          setFormData(newFormData);
          setHistoryData(valuesResponse.data);
          
          // Get the most recent update time
          const mostRecentUpdate = valuesResponse.data.reduce((latest, current) => {
            return new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest;
          }, valuesResponse.data[0]);
          setLastUpdated(new Date(mostRecentUpdate.updatedAt).toLocaleString());
        }
      } catch (err) {
        console.error('Error fetching parameters:', err);
        toast.error('Failed to load parameters');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, user?.institutionId, navigate]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user?.institutionId) {
      toast.error('Authentication required');
      navigate('/');
      return;
    }

    try {
      setIsLoading(true);
      
      // Convert form data to API format
      const parametersToUpdate: CreditParameter[] = Object.entries(formData)
        .map(([uniqueCode, value]) => {
          const parameter = parameters.find(p => p.uniqueCode === uniqueCode);
          if (!parameter) return null;
          return {
            parameterId: parameter.id,
            value: parseFloat(value)
          };
        })
        .filter((param): param is CreditParameter => param !== null);

      const response = await creditParametersService.setInstitutionParameters(user.institutionId, parametersToUpdate);
      
      if (response.success) {
        toast.success('Parameters updated successfully');
        setIsEditing(false);
        setLastUpdated(new Date().toLocaleString());
        
        // Refresh institution parameters to get updated data
        const refreshRes = await getParametersForInstitution(user.institutionId);
        if (refreshRes.success) {
          setInstitutionParameters(refreshRes.data);
        }
      } else {
        toast.error(response.message || 'Failed to update parameters');
      }
    } catch (err) {
      console.error('Error saving parameters:', err);
      toast.error('Failed to save parameters');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle reset
  const handleReset = async () => {
    if (!isAuthenticated || !user?.institutionId) {
      toast.error('Authentication required');
      navigate('/');
      return;
    }
    setIsSaving(true);
    try {
      // Reset to default values (0 for all parameters)
      const defaultParameters: CreditParameter[] = parameters.map(param => ({
        parameterId: param.id,
        value: 0
      }));

      const response = await creditParametersService.setInstitutionParameters(user.institutionId, defaultParameters);
      
      if (response.success) {
        const newFormData: Record<string, string> = {};
        parameters.forEach(param => {
          newFormData[param.uniqueCode] = '0';
        });
        setFormData(newFormData);
        setLastUpdated(new Date().toLocaleString());
        toast.success('Parameters reset to defaults');
        
        // Refresh institution parameters
        const refreshRes = await getParametersForInstitution(user.institutionId);
        if (refreshRes.success) {
          setInstitutionParameters(refreshRes.data);
        }
      } else {
        toast.error(response.data.message || 'Failed to reset parameters');
      }
    } catch (error) {
      console.error('Error resetting parameters:', error);
      toast.error('Failed to reset parameters');
    } finally {
      setIsSaving(false);
    }
  };

  // Show parameter info
  const showParameterInfo = (paramUniqueCode: string) => {
    setSelectedParameter(selectedParameter === paramUniqueCode ? null : paramUniqueCode);
  };

  // Get current value for a parameter
  const getCurrentValue = (uniqueCode: string) => {
    return formData[uniqueCode] || '0';
  };

  // Check if parameter has been modified from its saved value
  const isParameterModified = (uniqueCode: string) => {
    const currentValue = getCurrentValue(uniqueCode);
    const institutionParam = institutionParameters.find(param => {
      const template = parameterTemplates.find(t => t.uniqueCode === uniqueCode);
      return template && param.parameterId === template.id;
    });
    return institutionParam ? parseFloat(currentValue) !== institutionParam.value : parseFloat(currentValue) !== 0;
  };

  // Check if any parameters have been modified
  const hasUnsavedChanges = () => {
    return parameterTemplates.some(template => isParameterModified(template.uniqueCode));
  };

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Parameters Configuration
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Set your institution's credit scoring algorithm parameters
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
                    Set your institution's custom values for these parameters. Changes will affect all future credit assessments. 
                    Historical assessments will not be affected. All changes are logged for audit purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  {parameterTemplates.map((parameter) => (
                    <div key={parameter.id} className="sm:col-span-1">
                      <div className="flex items-center justify-between">
                        <label htmlFor={parameter.uniqueCode.toString()} className="block text-sm font-medium text-gray-700">
                          {parameter.name}
                        </label>
                        <button
                          aria-label={`Show information about ${parameter.name}`}
                          type="button"
                          className="text-[#008401] hover:text-[#006401] text-sm"
                          onClick={() => showParameterInfo(parameter.uniqueCode.toString())}
                        >
                          <InfoIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <Input
                          type="number"
                          name={parameter.uniqueCode}
                          id={parameter.uniqueCode}
                          value={formData[parameter.uniqueCode] || ''}
                          onChange={handleChange}
                          disabled={!isEditing || isLoading}
                          required
                          fullWidth
                          step="0.1"
                        />
                      </div>
                      {selectedParameter === parameter.uniqueCode && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                          <p><strong>Unique Code:</strong> {parameter.uniqueCode}</p>
                          <p className="mt-1"><strong>Description:</strong> {parameter.description}</p>
                          <p className="mt-1"><strong>Required:</strong> {parameter.is_required ? 'Yes' : 'No'}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleReset}
                  disabled={isSaving}
                >
                  <RefreshCcwIcon className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button 
                  type="submit"
                  disabled={isSaving || !hasUnsavedChanges()}
                >
                  <SaveIcon className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </form>
          )}
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
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historyData.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {new Date(entry.updatedAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.userName || 'System'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {parameters.find(p => p.id === entry.parameterId)?.name || 'Unknown Parameter'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.oldValue || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.value}
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
    </>
  );
};

export default ParametersConfig;