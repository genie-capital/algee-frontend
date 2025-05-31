import React, { useState } from 'react';
import { SearchIcon, FilterIcon, DownloadIcon, EyeIcon } from 'lucide-react';
import Button from '../components/common/Button';
const AssessmentResults = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  // Mock data for demonstration purposes
  const results = [{
    id: 'REF-2023-10-001',
    date: '2023-10-15',
    score: 85,
    status: 'approved',
    limit: '$25,000',
    rate: '5.2%'
  }, {
    id: 'REF-2023-10-002',
    date: '2023-10-15',
    score: 60,
    status: 'rejected',
    limit: '$0',
    rate: '0%'
  }, {
    id: 'REF-2023-10-003',
    date: '2023-10-14',
    score: 78,
    status: 'approved',
    limit: '$18,000',
    rate: '6.5%'
  }, {
    id: 'REF-2023-10-004',
    date: '2023-10-14',
    score: 92,
    status: 'approved',
    limit: '$30,000',
    rate: '4.8%'
  }, {
    id: 'REF-2023-10-005',
    date: '2023-10-13',
    score: 45,
    status: 'rejected',
    limit: '$0',
    rate: '0%'
  }, {
    id: 'REF-2023-10-006',
    date: '2023-10-13',
    score: 73,
    status: 'approved',
    limit: '$15,000',
    rate: '7.2%'
  }, {
    id: 'REF-2023-10-007',
    date: '2023-10-12',
    score: 88,
    status: 'approved',
    limit: '$27,500',
    rate: '5.0%'
  }, {
    id: 'REF-2023-10-008',
    date: '2023-10-12',
    score: 55,
    status: 'rejected',
    limit: '$0',
    rate: '0%'
  }, {
    id: 'REF-2023-10-009',
    date: '2023-10-11',
    score: 81,
    status: 'approved',
    limit: '$22,000',
    rate: '5.5%'
  }, {
    id: 'REF-2023-10-010',
    date: '2023-10-11',
    score: 70,
    status: 'approved',
    limit: '$12,000',
    rate: '8.1%'
  }];
  const filteredResults = selectedStatus === 'all' ? results : results.filter(result => result.status === selectedStatus);
  return <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Assessment Results
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage client assessment results
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button variant="outline" className="mr-2">
            <FilterIcon className="h-4 w-4 mr-1" />
            Advanced Filters
          </Button>
          <Button>
            <DownloadIcon className="h-4 w-4 mr-1" />
            Export Results
          </Button>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Client Assessments
            </h3>
            <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" className="focus:ring-[#008401] focus:border-[#008401] block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="Search by reference" />
              </div>
              <select className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#008401] focus:border-[#008401] sm:text-sm rounded-md" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Limit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interest Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map(assessment => <tr key={assessment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#07002F]">
                    {assessment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assessment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full mr-2 ${assessment.score >= 80 ? 'bg-green-500' : assessment.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-900">
                        {assessment.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${assessment.status === 'approved' ? 'bg-green-100 text-green-800' : assessment.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assessment.limit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assessment.rate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button variant="outline" size="sm">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Details
                    </Button>
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
                <span className="font-medium">10</span> of{' '}
                <span className="font-medium">97</span> results
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
    </div>;
};
export default AssessmentResults;