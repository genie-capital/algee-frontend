import React, { useState, useEffect } from 'react';
import { InfoIcon, HistoryIcon, RefreshCcwIcon, SaveIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Layout from '../components/Layout';
import creditParametersService, { InstitutionParameter, CreditParameter } from '../services/creditParametersService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface ParameterInfo {
  name: string;
  description: string;
  recommendedRange: string;
  impact: string;
}

const CreditParametersConfig = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [parameters, setParameters] = useState<InstitutionParameter[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('October 15, 2023 14:30:25');
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch available parameters and their values
  useEffect(() => {
    const fetchParameters = async () => {
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
          
          // Get the most recent update time
          const mostRecentUpdate = valuesResponse.data.reduce((latest, current) => {
            return new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest;
          }, valuesResponse.data[0]);
          setLastUpdated(new Date(mostRecentUpdate.updatedAt).toLocaleString());
        }
      } catch (error) {
        console.error('Error fetching parameters:', error);
        toast.error('Failed to load parameters');
      } finally {
        setIsLoading(false);
      }
    };

    fetchParameters();
  }, [isAuthenticated, user?.institutionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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
        navigate('/workspace-dashboard');
      } else {
        toast.error(response.message || 'Failed to update parameters');
      }
    } catch (error) {
      console.error('Error updating parameters:', error);
      toast.error('Failed to update parameters');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!isAuthenticated || !user?.institutionId) {
      toast.error('Authentication required');
      navigate('/');
      return;
    }

    try {
      setIsLoading(true);
      
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
        toast.success('Parameters reset to defaults');
      } else {
        toast.error(response.message || 'Failed to reset parameters');
      }
    } catch (error) {
      console.error('Error resetting parameters:', error);
      toast.error('Failed to reset parameters');
    } finally {
      setIsLoading(false);
    }
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

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  {parameters.map((parameter) => (
                    <div key={parameter.id} className="sm:col-span-1">
                      <div className="flex items-center justify-between">
                        <label htmlFor={parameter.uniqueCode} className="block text-sm font-medium text-gray-700">
                          {parameter.name}
                        </label>
                        <button
                          aria-label={`Show information about ${parameter.name}`}
                          type="button" 
                          className="text-[#008401] hover:text-[#006401] text-sm"
                          onClick={() => showParameterInfo(parameter.uniqueCode)}
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
                          <p><strong>Description:</strong> {parameter.description}</p>
                          <p className="mt-1"><strong>Recommended Range:</strong> {parameter.recommendedRange}</p>
                          <p className="mt-1"><strong>Business Impact:</strong> {parameter.impact}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                {!isEditing ? (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                  >
                    Edit Parameters
                  </Button>
                ) : (
                  <div className="flex space-x-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleReset}
                      disabled={isLoading}
                    >
                      <RefreshCcwIcon className="h-4 w-4 mr-2" />
                      Reset to Defaults
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isLoading}
                    >
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Save Configuration
                    </Button>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreditParametersConfig;