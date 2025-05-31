import React from 'react';
import { UploadIcon, FileTextIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import Button from '../components/common/Button';
const BatchAssessment = () => {
  return <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Batch Client Assessment
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload multiple client records for bulk processing
          </p>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">File Upload</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="max-w-lg w-full">
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#008401] hover:text-[#007001] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#008401]">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    CSV or Excel files up to 10MB
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center">
                  <FileTextIcon className="h-5 w-5 text-[#07002F]" />
                  <span className="ml-2 text-sm text-gray-700">
                    Need a template?
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  Download Template
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h4 className="text-base font-medium text-gray-900 mb-4">
              File Validation
            </h4>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircleIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    No file has been uploaded yet. Please upload a file to begin
                    validation.
                  </p>
                </div>
              </div>
            </div>
            {/* This would conditionally show after a file is uploaded
             <div className="bg-green-50 border-l-4 border-green-400 p-4">
             <div className="flex">
             <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
             </div>
             <div className="ml-3">
              <p className="text-sm text-green-700">
                File validation successful. 150 records found and ready for processing.
              </p>
             </div>
             </div>
             </div>
             */}
            <div className="mt-6 flex justify-end">
              <Button variant="outline" className="mr-3" disabled>
                Validate File
              </Button>
              <Button disabled>Process Batch</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Batch Jobs
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Records
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
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#07002F]">
                  BATCH-2023-10-001
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2023-10-15 14:30:25
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  245
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Button variant="outline" size="sm">
                    View Results
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#07002F]">
                  BATCH-2023-10-002
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2023-10-14 09:15:12
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  178
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Button variant="outline" size="sm">
                    View Results
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#07002F]">
                  BATCH-2023-10-003
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2023-10-13 16:42:55
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  92
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Failed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Button variant="outline" size="sm">
                    View Error Log
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
export default BatchAssessment;