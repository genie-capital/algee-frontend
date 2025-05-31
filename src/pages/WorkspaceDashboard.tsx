import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart2, 
  Users, 
  DollarSign, 
  Percent, 
  Clock,
  UserPlus,
  FileText,
  Settings
} from 'lucide-react';
import Button from '../components/common/Button';

// Mock data for demonstration purposes
const mockStats = {
  totalClients: 1248,
  avgCreditLimit: '$24,500',
  avgInterestRate: '7.2%',
  recentActivity: [
    { id: 1, action: 'Client Assessment', client: 'ABC Corp', user: 'John Smith', timestamp: '2023-10-15 14:30:25' },
    { id: 2, action: 'Parameter Update', client: 'System', user: 'Sarah Johnson', timestamp: '2023-10-15 11:22:18' },
    { id: 3, action: 'Batch Processing', client: 'Multiple (245)', user: 'Michael Brown', timestamp: '2023-10-14 16:45:33' },
    { id: 4, action: 'Client Assessment', client: 'XYZ Ltd', user: 'Emily Davis', timestamp: '2023-10-14 10:15:42' }
  ]
};

const WorkspaceDashboard = () => {
  const [period, setPeriod] = useState('month');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Workspace Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your institution's credit scoring activities
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <select
            title="Select time period"
            aria-label="Select time period"
            className="mr-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#008401] focus:border-[#008401] sm:text-sm rounded-md"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
          <Button>
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Clients Processed
                  </dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      {mockStats.totalClients}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/clients" className="font-medium text-[#008401] hover:text-[#006401]">
                View all clients
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Credit Limit
                  </dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      {mockStats.avgCreditLimit}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/results" className="font-medium text-[#008401] hover:text-[#006401]">
                View detailed analytics
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <Percent className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Interest Rate
                  </dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      {mockStats.avgInterestRate}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/credit-parameters-config" className="font-medium text-[#008401] hover:text-[#006401]">
                Adjust parameters
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <BarChart2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Performance Score
                  </dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      92/100
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/performance" className="font-medium text-[#008401] hover:text-[#006401]">
                View performance metrics
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link to="/client-assessment">
            <Button className="w-full flex justify-center items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Input New Client Data
            </Button>
          </Link>
          <Link to="/results">
            <Button variant="outline" className="w-full flex justify-center items-center">
              <FileText className="h-5 w-5 mr-2" />
              View Results
            </Button>
          </Link>
          <Link to="/credit-parameters-config">
            <Button variant="secondary" className="w-full flex justify-center items-center">
              <Settings className="h-5 w-5 mr-2" />
              Configure Parameters
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockStats.recentActivity.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      {activity.timestamp}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 flex justify-center">
          <Button variant="outline" size="sm">
            View All Activity
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDashboard;