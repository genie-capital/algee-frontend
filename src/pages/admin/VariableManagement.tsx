import React from 'react';
import { PlusIcon, EditIcon, TrashIcon, ToggleLeftIcon, ToggleRightIcon } from 'lucide-react';
import Button from '../../components/common/Button';
const VariableManagement = () => {
  // Mock data for demonstration purposes
  const variables = [{
    id: 1,
    name: 'Monthly Income',
    description: 'Verified monthly income of the client',
    weight: 10,
    required: true,
    enabled: true,
    normalization: 'Linear'
  }, {
    id: 2,
    name: 'Credit History',
    description: 'Years of credit history',
    weight: 8,
    required: true,
    enabled: true,
    normalization: 'Linear'
  }, {
    id: 3,
    name: 'Employment Years',
    description: 'Years at current employment',
    weight: 7,
    required: true,
    enabled: true,
    normalization: 'Logarithmic'
  }, {
    id: 4,
    name: 'Age',
    description: 'Client age in years',
    weight: 5,
    required: true,
    enabled: true,
    normalization: 'Sigmoid'
  }, {
    id: 5,
    name: 'Existing Loans',
    description: 'Number of existing loans',
    weight: 6,
    required: true,
    enabled: true,
    normalization: 'Inverse'
  }, {
    id: 6,
    name: 'Dependents',
    description: 'Number of financial dependents',
    weight: 4,
    required: false,
    enabled: true,
    normalization: 'Linear'
  }, {
    id: 7,
    name: 'Property Ownership',
    description: 'Whether client owns property',
    weight: 7,
    required: false,
    enabled: true,
    normalization: 'Binary'
  }, {
    id: 8,
    name: 'Education Level',
    description: 'Highest education level achieved',
    weight: 3,
    required: false,
    enabled: false,
    normalization: 'Categorical'
  }];
  return <div className="max-w-7xl mx-auto">
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
          <Button>
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
              {variables.map(variable => <tr key={variable.id}>
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
                      {variable.enabled ? <>
                          <ToggleRightIcon className="h-5 w-5 text-green-500 mr-1.5" />
                          <span className="text-sm text-gray-900">Enabled</span>
                        </> : <>
                          <ToggleLeftIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                          <span className="text-sm text-gray-500">
                            Disabled
                          </span>
                        </>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {variable.normalization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <EditIcon className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="danger" size="sm">
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>)}
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
    </div>;
};
export default VariableManagement;