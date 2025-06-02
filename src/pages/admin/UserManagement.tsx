import React from 'react';
import { PlusIcon, EditIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import Button from '../../components/common/Button';
const UserManagement = () => {
  // Mock data for demonstration purposes
  const users = [{
    id: 1,
    name: 'John Smith',
    email: 'john@firstbank.com',
    institution: 'First Bank',
    role: 'Administrator',
    status: 'active'
  }, {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@firstbank.com',
    institution: 'First Bank',
    role: 'Analyst',
    status: 'active'
  }, {
    id: 3,
    name: 'Michael Brown',
    email: 'michael@creditunion.com',
    institution: 'Credit Union',
    role: 'Administrator',
    status: 'active'
  }, {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@creditunion.com',
    institution: 'Credit Union',
    role: 'Analyst',
    status: 'active'
  }, {
    id: 5,
    name: 'Robert Wilson',
    email: 'robert@investmentbank.com',
    institution: 'Investment Bank',
    role: 'Administrator',
    status: 'inactive'
  }, {
    id: 6,
    name: 'Jennifer Lee',
    email: 'jennifer@investmentbank.com',
    institution: 'Investment Bank',
    role: 'Analyst',
    status: 'active'
  }, {
    id: 7,
    name: 'David Miller',
    email: 'david@communitybank.com',
    institution: 'Community Bank',
    role: 'Administrator',
    status: 'active'
  }, {
    id: 8,
    name: 'Lisa Anderson',
    email: 'lisa@communitybank.com',
    institution: 'Community Bank',
    role: 'Analyst',
    status: 'inactive'
  }];
  return <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            User Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage system users and permissions
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button>
            <PlusIcon className="h-4 w-4 mr-1" />
            Add User
          </Button>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-900">System Users</h3>
            <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
              <input type="text" className="focus:ring-[#008401] focus:border-[#008401] block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Search users..." />
              <select 
                aria-label="Filter by institution"
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#008401] focus:border-[#008401] sm:text-sm rounded-md">
                <option value="all">All Institutions</option>
                <option value="First Bank">First Bank</option>
                <option value="Credit Union">Credit Union</option>
                <option value="Investment Bank">Investment Bank</option>
                <option value="Community Bank">Community Bank</option>
              </select>
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
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institution
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#07002F] text-white flex items-center justify-center">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.institution}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.status === 'active' ? <>
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1.5" />
                          <span className="text-sm text-gray-900">Active</span>
                        </> : <>
                          <XCircleIcon className="h-5 w-5 text-red-500 mr-1.5" />
                          <span className="text-sm text-gray-900">
                            Inactive
                          </span>
                        </>}
                    </div>
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
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">8</span> of{' '}
                <span className="font-medium">8</span> users
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default UserManagement;