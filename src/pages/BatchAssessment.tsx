import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadIcon, FileTextIcon, AlertCircleIcon, CheckCircleIcon, Loader2Icon, FilterIcon } from 'lucide-react';
import Button from '../components/common/Button';
import Layout from '../components/Layout';
import { csvUploadService, UploadBatch } from '../services/csvUploadService';
import { useAuth } from '../contexts/AuthContext';

interface BatchJob {
  id: string;
  fileName: string;
  dateSubmitted: Date;
  recordCount: number;
  status: 'completed' | 'failed';
}

type StatusFilter = 'all' | 'completed' | 'failed' | 'processing' | 'completed_with_errors';

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const BatchAssessment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [batchJobs, setBatchJobs] = useState<UploadBatch[]>([]);
  const [isLoadingBatches, setIsLoadingBatches] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBatches();
  }, [statusFilter, currentPage]);

  const fetchBatches = async () => {
    if (!user?.institutionId) return;
    
    setIsLoadingBatches(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 20
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await csvUploadService.getUploadBatchesForInstitution(
        user.institutionId,
        params
      );
      
      if (response.success) {
        setBatchJobs(response.data.batches);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setIsLoadingBatches(false);
    }
  };

  const handleStatusFilterChange = (newStatus: StatusFilter) => {
    setStatusFilter(newStatus);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const processBatch = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadResponse = await csvUploadService.uploadCSV(
        selectedFile,
        selectedFile.name,
        'Batch upload',
        user?.institutionId
      );

      if (uploadResponse.success) {
        await fetchBatches();
        setSelectedFile(null);
        
        if (uploadResponse.data.errors && uploadResponse.data.errors.length > 0) {
          console.warn('Some records had errors:', uploadResponse.data.errors);
        }
        
        if (uploadResponse.data.processing.failedRecords > 0) {
          console.warn(`${uploadResponse.data.processing.failedRecords} records failed to process`);
        }
      } else {
        setUploadError(uploadResponse.message || 'Error processing batch');
      }
    } catch (error: any) {
      setUploadError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewResults = (batchId: number | string) => {
    console.log('Navigating to batch results for batchId:', batchId);
    navigate(`/result/batch/${batchId}`);
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await csvUploadService.downloadCSVTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'client_assessment_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading template:', error);
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'completed_with_errors':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing';
      case 'failed':
        return 'Failed';
      case 'completed_with_errors':
        return 'Completed with Errors';
      default:
        return status;
    }
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const halfMaxVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfMaxVisible);
    let endPage = Math.min(pagination.totalPages, currentPage + halfMaxVisible);
    
    if (currentPage <= halfMaxVisible) {
      endPage = Math.min(pagination.totalPages, maxVisiblePages);
    }
    
    if (currentPage > pagination.totalPages - halfMaxVisible) {
      startPage = Math.max(1, pagination.totalPages - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">
                {((currentPage - 1) * pagination.limit) + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * pagination.limit, pagination.total)}
              </span>{' '}
              of{' '}
              <span className="font-medium">{pagination.total}</span>{' '}
              results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-l-md"
              >
                Previous
              </Button>
              {pages.map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="rounded-none"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="rounded-r-md"
              >
                Next
              </Button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
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
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#008401] hover:text-[#007001] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#008401]">
                      <span>Upload a file</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        accept=".csv,.xlsx,.xls"
                      />
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
                <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                  Download Template
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h4 className="text-base font-medium text-gray-900 mb-4">
              File Processing
            </h4>
            {!selectedFile && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircleIcon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      No file has been uploaded yet. Please upload a file to begin processing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircleIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {uploadError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedFile && !uploadError && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      File selected and ready for processing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center">
                <FileTextIcon className="h-5 w-5 text-[#07002F]" />
                <span className="ml-2 text-sm text-gray-700">
                  File Name: {selectedFile?.name || 'No file selected'}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              {selectedFile && !uploadError && (
                <Button 
                  onClick={processBatch}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2Icon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Processing Batch...
                    </>
                  ) : (
                    'Process Batch'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Batch Jobs
            </h3>
            <div className="flex items-center space-x-2">
              <FilterIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Filter by status:</span>
            </div>
          </div>
          
          {/* Status Filter Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant={statusFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('completed')}
            >
              Completed
            </Button>
            <Button
              variant={statusFilter === 'failed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('failed')}
            >
              Failed
            </Button>
            <Button
              variant={statusFilter === 'processing' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('processing')}
            >
              Processing
            </Button>
            <Button
              variant={statusFilter === 'completed_with_errors' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilterChange('completed_with_errors')}
            >
              With Errors
            </Button>
          </div>
        </div>
        
        {isLoadingBatches ? (
          <div className="p-8 text-center">
            <Loader2Icon className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Loading batch jobs...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Name
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
                  {batchJobs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                        {statusFilter === 'all' ? 
                          'No batch jobs found for this institution.' : 
                          `No ${statusFilter} batch jobs found.`
                        }
                      </td>
                    </tr>
                  ) : (
                    batchJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#07002F]">
                          {job.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {job.filename}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(job.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>Total: {job.total_records}</div>
                            <div className="text-xs text-gray-400">
                              Processed: {job.processed_records}
                              {job.failed_records > 0 && `, Failed: ${job.failed_records}`}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(job.status)}`}>
                            {getStatusDisplayName(job.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(job.status === 'completed' || job.status === 'completed_with_errors') && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewResults(job.id)}
                            >
                              View Results
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </>
        )}
      </div>
    </>
  );
};

export default BatchAssessment;