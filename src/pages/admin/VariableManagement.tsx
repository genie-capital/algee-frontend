import React, { useState, useEffect } from 'react';
import { PlusIcon, EditIcon, TrashIcon, ToggleLeftIcon, ToggleRightIcon } from 'lucide-react';
import Button from '../../components/common/Button';
import api from '../../services/api';
import ParameterFormModal from '../../components/admin/ParameterFormModal';
import AdminNavbar from '../../components/admin/AdminNavbar';
import BackToDashboard from '../../components/admin/BackToDashboard';


// Define interfaces for type safety
interface Variable {
  id: string | number;
  name: string;
  description: string;
  weight: number;
  required: boolean;
  enabled: boolean;
  normalization: string;
}

interface ParamData {
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

interface ApiResponse {
  success: boolean;
  data: Variable[];
}

const VariableManagement = () => {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentVariable, setCurrentVariable] = useState<Variable | null>(null);

  // Fetch all parameters on component mount
  useEffect(() => {
    fetchParameters();
  }, []);

  const fetchParameters = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.post<ApiResponse>('/api/parameter/all');
      if (response.data.success) {
        setVariables(response.data.data);
      } else {
        setError('Failed to fetch parameters');
      }
    } catch (err) {
      console.error('Error fetching parameters:', err);
      setError('An error occurred while fetching parameters');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateParameter = async (paramData: ParamData): Promise<void> => {
    try {
      const response = await api.post('/api/parameter/create', {
        name: paramData.name,
        description: paramData.description,
        isRequired: paramData.required,
        isActive: paramData.enabled
      });
      
      if (response.data) {
        fetchParameters(); // Refresh the list
        setShowCreateModal(false);
      } else {
        setError('Failed to create parameter');
      }
    } catch (err) {
      console.error('Error creating parameter:', err);
      setError('An error occurred while creating parameter');
    }
  };

  const handleUpdateParameter = async (id: string | number, paramData: ParamData): Promise<void> => {
    try {
      const response = await api.post(`/api/parameter/update/${id}`, {
        name: paramData.name,
        description: paramData.description,
        isRequired: paramData.required,
        isActive: paramData.enabled
      });
      
      if (response.data) {
        fetchParameters(); // Refresh the list
        setShowEditModal(false);
      } else {
        setError('Failed to update parameter');
      }
    } catch (err) {
      console.error('Error updating parameter:', err);
      setError('An error occurred while updating parameter');
    }
  };

  const handleDeleteParameter = async (id: string | number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this parameter?')) {
      try {
        const response = await api.post<ApiResponse>(`/api/parameter/delete/${id}`);
        if (response.data.success) {
          fetchParameters(); // Refresh the list
        } else {
          setError('Failed to delete parameter');
        }
      } catch (err) {
        console.error('Error deleting parameter:', err);
        setError('An error occurred while deleting parameter');
      }
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <AdminNavbar />
      <BackToDashboard />
      <div className="md:flex md:items-center md:justify-between mb-8">
          
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Variable Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage credit assessment variables and their weights
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button onClick={() => setShowCreateModal(true)}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Variable
            </Button>
          </div>
        </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              System Variables
            </h3>
            <div className="mt-3 sm:mt-0">
              <input type="text" className="focus:ring-[#008401] focus:border-[#008401] block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Search variables..." />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Normalization
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {variables.map((variable: Variable) => (
                <tr key={variable.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {variable.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {variable.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-2 w-full bg-gray-200 rounded">
                        <div className="h-2 bg-[#008401] rounded" style={{
                          width: `${variable.weight / 10 * 100}%`
                        }}></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-700">
                        {variable.weight}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {variable.required ? 'Yes' : 'No'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {variable.enabled ? (
                        <>
                          <ToggleRightIcon className="h-5 w-5 text-green-500 mr-1.5" />
                          <span className="text-sm text-gray-900">Enabled</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeftIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                          <span className="text-sm text-gray-500">
                            Disabled
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {variable.normalization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setCurrentVariable(variable);
                          setShowEditModal(true);
                        }}
                      >
                        <EditIcon className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteParameter(variable.id)}
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Variable Types and Normalization
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                Linear Normalization
              </h4>
              <p className="text-sm text-gray-600">
                Applies a linear transformation to scale values between 0 and 1.
                Suitable for variables with a direct proportional relationship
                to creditworthiness.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                Logarithmic Normalization
              </h4>
              <p className="text-sm text-gray-600">
                Applies a logarithmic transformation. Useful for variables where
                the impact diminishes as the value increases.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                Sigmoid Normalization
              </h4>
              <p className="text-sm text-gray-600">
                Applies an S-shaped curve transformation. Useful for variables
                with optimal values in the middle range.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                Inverse Normalization
              </h4>
              <p className="text-sm text-gray-600">
                Applies an inverse transformation. Useful for variables where
                lower values indicate better creditworthiness.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                Binary Normalization
              </h4>
              <p className="text-sm text-gray-600">
                Converts values to 0 or 1. Suitable for yes/no variables like
                property ownership.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                Categorical Normalization
              </h4>
              <p className="text-sm text-gray-600">
                Assigns specific values to different categories. Suitable for
                education level, employment type, etc.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Parameter Modal */}
      {showCreateModal && (
        <ParameterFormModal
          title="Create New Parameter"
          onSubmit={handleCreateParameter}
          onCancel={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit Parameter Modal */}
      {showEditModal && currentVariable && (
        <ParameterFormModal
          title={`Edit Parameter: ${currentVariable.name}`}
          parameter={currentVariable}
          onSubmit={(data) => handleUpdateParameter(currentVariable.id, data)}
          onCancel={() => setShowEditModal(false)}
        />
      )}
      </div>
  );
};

export default VariableManagement;