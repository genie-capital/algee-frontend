import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InfoIcon, ArrowLeftIcon } from 'lucide-react';
import Button from '../components/common/Button';
import Layout from '../components/Layout';
import api from '../services/api';

// Define interfaces for type safety
interface Institution {
  id: string | number;
  name: string;
  description?: string;
}

interface Parameter {
  id: string | number;
  name: string;
  description?: string;
}

interface InstitutionParameter {
  id: string | number;
  parameterId: string | number;
  value: number;
  parameter?: Parameter;
}

interface ParameterUpdate {
  parameterId: number;
  value: number;
}

interface FormData {
  [key: string]: string | number;
}

interface ApiResponse {
  success: boolean;
  data?: any;
}

const InstitutionParameterDetail = () => {
  const { id } = useParams<{ id: string }>(); // Institution ID from URL
  const navigate = useNavigate();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [parameters, setParameters] = useState<InstitutionParameter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({});

  useEffect(() => {
    if (id) {
      fetchInstitutionParameters();
    }
  }, [id]);

  const fetchInstitutionParameters = async (): Promise<void> => {
    if (!id) {
      setError('Institution ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // First get the institution details
      const institutionResponse = await api.post(`/institution/update/${id}`, {});
      if (institutionResponse.data) {
        setInstitution(institutionResponse.data as Institution);
      }

      // Then get the parameters for this institution
      const paramsResponse = await api.post(`/institution/getParametersForInstitution/${id}`);
      if (paramsResponse.data) {
        const institutionParams = paramsResponse.data as InstitutionParameter[];
        setParameters(institutionParams);
        
        // Initialize form data with current parameter values
        const initialFormData: FormData = {};
        institutionParams.forEach((param: InstitutionParameter) => {
          initialFormData[param.id.toString()] = param.value;
        });
        setFormData(initialFormData);
      }
    } catch (err) {
      console.error('Error fetching institution parameters:', err);
      setError('Failed to load institution parameters');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (paramId: string | number, value: string): void => {
    setFormData((prev: FormData) => ({
      ...prev,
      [paramId.toString()]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!id) {
      setError('Institution ID is required');
      return;
    }

    try {
      // Convert form data to the format expected by the API
      const parameterUpdates: ParameterUpdate[] = Object.entries(formData).map(([paramId, value]) => ({
        parameterId: parseInt(paramId, 10),
        value: parseFloat(value.toString())
      }));

      const response = await api.post(`/institution/setParameters/${id}`, {
        parameters: parameterUpdates
      });

      const apiResponse = response.data as ApiResponse;
      if (apiResponse.success) {
        setIsEditing(false);
        await fetchInstitutionParameters(); // Refresh data
      } else {
        setError('Failed to update parameters');
      }
    } catch (err) {
      console.error('Error updating parameters:', err);
      setError('An error occurred while updating parameters');
    }
  };

  const handleCancelEdit = (): void => {
    setIsEditing(false);
    // Reset form data to original values
    const initialFormData: FormData = {};
    parameters.forEach((param: InstitutionParameter) => {
      initialFormData[param.id.toString()] = param.value;
    });
    setFormData(initialFormData);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading institution parameters...</div>;
  }

  return (
    <Layout>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back
          </button>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {institution?.name || 'Institution'} Parameters
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure credit scoring parameters for this institution
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Parameters</Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={(e: React.MouseEvent) => {
                const form = document.querySelector('form');
                if (form) {
                  const formEvent = new Event('submit', { bubbles: true, cancelable: true });
                  form.dispatchEvent(formEvent);
                }
              }}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Parameter Configuration</h3>
        </div>

        <div className="p-6">
          <div className="rounded-md bg-blue-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <InfoIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Changes to these parameters will affect all future credit assessments for this institution.
                    Historical assessments will not be affected.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {parameters.length === 0 ? (
                <p>No parameters found for this institution.</p>
              ) : (
                parameters.map((param: InstitutionParameter) => (
                  <div key={param.id} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor={`param-${param.id}`} className="block text-sm font-medium text-gray-700">
                        {param.parameter?.name || `Parameter ${param.parameterId}`}
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name={`param-${param.id}`}
                          id={`param-${param.id}`}
                          value={formData[param.id.toString()] || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            handleInputChange(param.id, e.target.value)
                          }
                          disabled={!isEditing}
                          className="shadow-sm focus:ring-[#07002F] focus:border-[#07002F] block w-full sm:text-sm border-gray-300 rounded-md"
                          step="0.01"
                        />
                      </div>
                      {param.parameter?.description && (
                        <p className="mt-2 text-sm text-gray-500">{param.parameter.description}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {isEditing && (
              <div className="mt-8 pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={handleCancelEdit} 
                    className="mr-3"
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default InstitutionParameterDetail;