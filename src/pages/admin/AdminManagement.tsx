import React, { useState, useEffect } from 'react';
import { PlusIcon, EditIcon, TrashIcon, XIcon } from 'lucide-react';
import Button from '../../components/common/Button';
import api from '../../services/api';

// Define interfaces for data structures
interface Admin {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Type guard functions to validate API responses
const isAdmin = (obj: any): obj is Admin => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.is_active === 'boolean' &&
    typeof obj.createdAt === 'string'
  );
};

const isAdminArray = (arr: any): arr is Admin[] => {
  return Array.isArray(arr) && arr.every(isAdmin);
};

const AdminManagement = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Fetch all admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.post('/admin/getAllAdmins');
      
      // Type-safe response validation
      const responseData = response.data as ApiResponse<unknown>;
      
      if (responseData.success && isAdminArray(responseData.data)) {
        setAdmins(responseData.data);
        setError('');
      } else {
        setError('Invalid response format or failed to fetch admins');
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('An error occurred while fetching admins');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (adminData: Partial<Admin>): Promise<void> => {
    try {
      const response = await api.post('/admin/create', adminData);
      const responseData = response.data as ApiResponse<unknown>;
      
      if (responseData.success) {
        fetchAdmins(); // Refresh the list
        setShowCreateModal(false);
        resetForm();
      } else {
        setError(responseData.message ?? 'Failed to create admin');
      }
    } catch (err) {
      console.error('Error creating admin:', err);
      setError('An error occurred while creating admin');
    }
  };

  const handleUpdateAdmin = async (id: string, adminData: Partial<Admin>): Promise<void> => {
    try {
      const response = await api.put(`/admin/update/${id}`, adminData);
      const responseData = response.data as ApiResponse<unknown>;
      
      if (responseData.success) {
        fetchAdmins(); // Refresh the list
        setShowEditModal(false);
        resetForm();
      } else {
        setError(responseData.message ?? 'Failed to update admin');
      }
    } catch (err) {
      console.error('Error updating admin:', err);
      setError('An error occurred while updating admin');
    }
  };

  const handleDeactivateAdmin = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to deactivate this admin?')) {
      try {
        const response = await api.delete(`/admin/deactivate/${id}`);
        const responseData = response.data as ApiResponse<unknown>;
        
        if (responseData.success) {
          fetchAdmins(); // Refresh the list
        } else {
          setError(responseData.message ?? 'Failed to deactivate admin');
        }
      } catch (err) {
        console.error('Error deactivating admin:', err);
        setError('An error occurred while deactivating admin');
      }
    }
  };

  // Type-safe event handler
  const handleAdminSelect = (admin: Admin): void => {
    setCurrentAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      confirmPassword: ''
    });
    setShowEditModal(true);
  };

  // Form handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = (): void => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setFormErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    // Only validate password for new admin creation
    if (!currentAdmin) {
      if (!formData.password) {
        errors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
        isValid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    } else if (formData.password && formData.password.length < 8) {
      // For edit, only validate if password is provided
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (formData.password && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!validateForm()) return;

    const adminData = {
      name: formData.name,
      email: formData.email,
      ...(formData.password && { password: formData.password })
    };

    if (currentAdmin) {
      handleUpdateAdmin(currentAdmin.id, adminData);
    } else {
      handleCreateAdmin(adminData);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Admin Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Create, update, and manage system administrators
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}>
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Admin
          </Button>
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
          <h3 className="text-lg font-medium text-gray-900">System Administrators</h3>
        </div>

        {loading ? (
          <div className="p-6 text-center">Loading administrators...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{admin.name ?? 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{admin.email ?? 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {admin.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      title="Edit admin"
                      onClick={() => handleAdminSelect(admin)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      title="Deactivate admin"
                      onClick={() => handleDeactivateAdmin(admin.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={!admin.is_active}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Admin</h3>
                      <button
                        title="Close modal"
                        type="button"
                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setShowCreateModal(false)}
                      >
                        <XIcon className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                        </div>
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          {formErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#008401] text-base font-medium text-white hover:bg-[#008401]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008401] sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && currentAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Admin: {currentAdmin.name}</h3>
                      <button
                        title="Close modal"
                        type="button"
                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setShowEditModal(false)}
                      >
                        <XIcon className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            name="name"
                            id="edit-name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                        </div>
                        <div>
                          <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            name="email"
                            id="edit-email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                        </div>
                        <div>
                          <label htmlFor="edit-password" className="block text-sm font-medium text-gray-700">
                            Password <span className="text-xs text-gray-500">(Leave blank to keep current password)</span>
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="edit-password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
                        </div>
                        <div>
                          <label htmlFor="edit-confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            id="edit-confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          {formErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#008401] text-base font-medium text-white hover:bg-[#008401]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008401] sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;