import React, { useState, useEffect } from 'react';
import { InfoIcon, ClockIcon, HistoryIcon, RefreshCcwIcon, SaveIcon } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

import {
  getAllParameters,
  getParametersForInstitution,
  setInstitutionParameters as setInstitutionParametersService,
  ParameterTemplate,
  InstitutionParameter,
  CreditParameterInput
} from '../services/institutionParameterService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ParametersConfig = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [parameterTemplates, setParameterTemplates] = useState<ParameterTemplate[]>([]);
  const [institutionParameters, setInstitutionParameters] = useState<InstitutionParameter[]>([]);
  const [isEditing, setIsEditing] = useState(true); // Default to editing mode for institutions
  const [lastUpdated, setLastUpdated] = useState('');
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [historyData, setHistoryData] = useState<Array<any>>([]); // Placeholder for future history logic
  const navigate = useNavigate();

  // Fetch parameter templates and institution values
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user?.institutionId) {
        toast.error('Authentication required');
        navigate('/');
        return;
      }
      setIsLoading(true);
      try {
        // 1. Fetch all parameter templates (admin-created parameters)
        const templatesRes = await getAllParameters();
        if (templatesRes.success) {
          // Filter only active parameters
          const activeTemplates = templatesRes.data.filter((p) => p.is_active);
          setParameterTemplates(activeTemplates);
          // Initialize form data with default values (0)
          const initialFormData: Record<string, string> = {};
          activeTemplates.forEach((template) => {
            initialFormData[template.uniqueCode] = '0';
          });
          setFormData(initialFormData);

          // 2. Fetch institution's parameter values
          const instParamsRes = await getParametersForInstitution(user.institutionId);
          if (instParamsRes.success) {
            setInstitutionParameters(instParamsRes.data);
            
            // 3. Map parameter values to formData by uniqueCode
            const updatedFormData = { ...initialFormData };
            instParamsRes.data.forEach((param: InstitutionParameter) => {
              const template = activeTemplates.find((t: ParameterTemplate) => t.id === param.parameterId);
              if (template) {
                updatedFormData[template.uniqueCode] = param.value.toString();
              }
            });
            setFormData(updatedFormData);

            // 4. Set last updated timestamp
            if (instParamsRes.data.length > 0) {
              const mostRecentUpdate = instParamsRes.data.reduce((latest, current) => {
                return new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest;
              }, instParamsRes.data[0]);
              setLastUpdated(new Date(mostRecentUpdate.updatedAt).toLocaleString());
            } else {
              setLastUpdated('Never');
            }
          } else {
            // If no institution parameters exist yet, set default last updated
            setLastUpdated('Never');
          }
        } else {
          toast.error('Failed to load parameter templates');
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
    setIsSaving(true);
    try {
      // Prepare parameters for API - include all parameters with their current values
      const parametersToUpdate: CreditParameterInput[] = parameterTemplates.map((template) => ({
        parameterId: template.id,
        value: parseFloat(formData[template.uniqueCode] || '0')
      }));

      const res = await setInstitutionParametersService(user.institutionId, parametersToUpdate);
      if (res.success) {
        toast.success('Parameters saved successfully');
        setLastUpdated(new Date().toLocaleString());
        
        // Refresh institution parameters to get updated data
        const refreshRes = await getParametersForInstitution(user.institutionId);
        if (refreshRes.success) {
          setInstitutionParameters(refreshRes.data);
        }
      } else {
        toast.error(res.message || 'Failed to save parameters');
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
      const defaultParameters: CreditParameterInput[] = parameterTemplates.map(param => ({
        parameterId: param.id,
        value: 0
      }));
      const response = await setInstitutionParametersService(user.institutionId, defaultParameters);
      if (response.success) {
        const newFormData: Record<string, string> = {};
        parameterTemplates.forEach(param => {
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
        toast.error(response.message || 'Failed to reset parameters');
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
          ) : parameterTemplates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No parameters available. Please contact your administrator.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  {parameterTemplates.map((parameter) => (
                    <div key={parameter.id} className="sm:col-span-1">
                      <div className="flex items-center justify-between">
                        <label htmlFor={parameter.uniqueCode} className="block text-sm font-medium text-gray-700">
                          {parameter.name}
                          {parameter.isRequired && <span className="text-red-500 ml-1">*</span>}
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
                          value={getCurrentValue(parameter.uniqueCode)}
                          onChange={handleChange}
                          disabled={isSaving}
                          required={parameter.isRequired}
                          fullWidth
                          step="0.1"
                          className={isParameterModified(parameter.uniqueCode) ? 'border-yellow-300 bg-yellow-50' : ''}
                        />
                      </div>
                      {isParameterModified(parameter.uniqueCode) && (
                        <p className="mt-1 text-xs text-yellow-600">Modified</p>
                      )}
                      {selectedParameter === parameter.uniqueCode && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                          <p><strong>Unique Code:</strong> {parameter.uniqueCode}</p>
                          <p className="mt-1"><strong>Description:</strong> {parameter.description}</p>
                          <p className="mt-1"><strong>Recommended Range:</strong> {parameter.recommendedRange}</p>
                          <p className="mt-1"><strong>Business Impact:</strong> {parameter.impact}</p>
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
                  Old Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historyData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No change history available
                  </td>
                </tr>
              ) : (
                historyData.map((entry) => (
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
                      {parameterTemplates.find(p => p.id === entry.parameterId)?.name || 'Unknown Parameter'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.oldValue || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.value}
                    </td>
                  </tr>
                ))
              )}
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