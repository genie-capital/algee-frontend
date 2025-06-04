import React, { useState } from 'react';
import { SearchIcon, FilterIcon, DownloadIcon, ClockIcon } from 'lucide-react';
import Button from '../../components/common/Button';
import AdminNavbar from '../../components/admin/AdminNavbar';
import BackToDashboard from '../../components/admin/BackToDashboard';

const AuditLogs = () => {
  const [dateFilter, setDateFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  // Mock data for demonstration purposes
  const logs = [{
    id: 1,
    timestamp: '2023-10-15 14:30:25',
    user: 'John Smith',
    action: 'login',
    description: 'User logged in',
    ip: '192.168.1.1'
  }, {
    id: 2,
    timestamp: '2023-10-15 14:35:12',
    user: 'John Smith',
    action: 'view',
    description: 'Viewed client REF-2023-10-001',
    ip: '192.168.1.1'
  }, {
    id: 3,
    timestamp: '2023-10-15 14:40:45',
    user: 'John Smith',
    action: 'calculate',
    description: 'Calculated credit score for REF-2023-10-001',
    ip: '192.168.1.1'
  }, {
    id: 4,
    timestamp: '2023-10-15 15:05:33',
    user: 'Sarah Johnson',
    action: 'login',
    description: 'User logged in',
    ip: '192.168.1.2'
  }, {
    id: 5,
    timestamp: '2023-10-15 15:10:18',
    user: 'Sarah Johnson',
    action: 'update',
    description: 'Updated parameter: Income Multiplier from 3.0 to 3.5',
    ip: '192.168.1.2'
  }, {
    id: 6,
    timestamp: '2023-10-15 15:15:22',
    user: 'Sarah Johnson',
    action: 'update',
    description: 'Updated parameter: Maximum Interest Rate from 18.0% to 15.0%',
    ip: '192.168.1.2'
  }, {
    id: 7,
    timestamp: '2023-10-15 15:30:45',
    user: 'Michael Brown',
    action: 'login',
    description: 'User logged in',
    ip: '192.168.1.3'
  }, {
    id: 8,
    timestamp: '2023-10-15 15:35:12',
    user: 'Michael Brown',
    action: 'batch',
    description: 'Submitted batch job BATCH-2023-10-001 with 245 records',
    ip: '192.168.1.3'
  }, {
    id: 9,
    timestamp: '2023-10-15 15:45:33',
    user: 'System',
    action: 'system',
    description: 'Batch job BATCH-2023-10-001 completed successfully',
    ip: 'localhost'
  }, {
    id: 10,
    timestamp: '2023-10-15 16:00:15',
    user: 'Emily Davis',
    action: 'login',
    description: 'User logged in',
    ip: '192.168.1.4'
  }, {
    id: 11,
    timestamp: '2023-10-15 16:05:28',
    user: 'Emily Davis',
    action: 'export',
    description: 'Exported assessment results to CSV',
    ip: '192.168.1.4'
  }, {
    id: 12,
    timestamp: '2023-10-15 16:15:42',
    user: 'Emily Davis',
    action: 'logout',
    description: 'User logged out',
    ip: '192.168.1.4'
  }];
  const filteredLogs = logs.filter(log => {
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    // In a real app, we would also filter by date
    return true;
  });
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <BackToDashboard />
          
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Audit Logs
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review system activity and security events
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button variant="outline" className="mr-2">
                <FilterIcon className="h-4 w-4 mr-1" />
                Advanced Filters
              </Button>
              <Button>
                <DownloadIcon className="h-4 w-4 mr-1" />
                Export Logs
              </Button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  System Activity
                </h3>
                <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" className="focus:ring-[#008401] focus:border-[#008401] block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="Search logs..." />
                  </div>
                  <select 
                    aria-label="Filter by date"
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#008401] focus:border-[#008401] sm:text-sm rounded-md" 
                    value={dateFilter} 
                    onChange={e => setDateFilter(e.target.value)}
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                  <select 
                    aria-label="Filter by action"
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#008401] focus:border-[#008401] sm:text-sm rounded-md" 
                    value={actionFilter} 
                    onChange={e => setActionFilter(e.target.value)}
                  >
                    <option value="all">All Actions</option>
                    <option value="login">Login</option>
                    <option value="logout">Logout</option>
                    <option value="view">View</option>
                    <option value="update">Update</option>
                    <option value="calculate">Calculate</option>
                    <option value="batch">Batch</option>
                    <option value="export">Export</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map(log => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {log.timestamp}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          log.action === 'login' ? 'bg-blue-100 text-blue-800' :
                          log.action === 'logout' ? 'bg-purple-100 text-purple-800' :
                          log.action === 'update' ? 'bg-yellow-100 text-yellow-800' :
                          log.action === 'calculate' ? 'bg-green-100 text-green-800' :
                          log.action === 'batch' ? 'bg-indigo-100 text-indigo-800' :
                          log.action === 'export' ? 'bg-pink-100 text-pink-800' :
                          log.action === 'system' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ip}
                      </td>
                    </tr>
                  ))}
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
                    <span className="font-medium">12</span> of{' '}
                    <span className="font-medium">156</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" aria-current="page" className="z-10 bg-[#008401] border-[#008401] text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      1
                    </a>
                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      2
                    </a>
                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      3
                    </a>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      10
                    </a>
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuditLogs;