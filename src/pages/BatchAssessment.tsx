import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadIcon, FileTextIcon, AlertCircleIcon, CheckCircleIcon, Loader2Icon } from 'lucide-react';
import Button from '../components/common/Button';
import Layout from '../components/Layout';
import ProcessingModal from '../components/ProcessingModal';

interface BatchJob {
  id: string;
  fileName: string;
  dateSubmitted: Date;
  recordCount: number;
  status: 'completed' | 'failed';
}

const BatchAssessment = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [batchJobs, setBatchJobs] = useState<BatchJob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValidationComplete(false);
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
      setValidationComplete(false);
    }
  };

  const validateFile = async () => {
    if (!selectedFile) return;

    setIsValidating(true);
    // Simulate validation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const isValid = selectedFile.type === 'text/csv' || 
                   selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                   selectedFile.type === 'application/vnd.ms-excel';

    if (isValid) {
      setValidationComplete(true);
    } else {
      alert('Invalid file type. Please upload a CSV or Excel file.');
    }
    setIsValidating(false);
  };

  const processBatch = async () => {
    if (!selectedFile || !validationComplete) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing with progress updates
    for (let i = 0; i <= 100; i += 1) {
      await new Promise(resolve => setTimeout(resolve, 240));
      setProgress(i);
    }

    // Add the new batch job to the list
    const newBatchJob: BatchJob = {
      id: `BATCH-${Date.now()}`,
      fileName: selectedFile.name,
      dateSubmitted: new Date(),
      recordCount: Math.floor(Math.random() * 300) + 50, // Simulated record count
      status: 'completed'
    };

    setBatchJobs(prev => [newBatchJob, ...prev]);
  };

  const handleViewResults = (batchId: string) => {
    navigate(`/batchdetails`);
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
            {!selectedFile && !validationComplete && (
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
            )}

            {validationComplete && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      File validation successful. Ready for processing.
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
              {!validationComplete && selectedFile && (
                <Button 
                  variant="outline" 
                  className="mr-3" 
                  onClick={validateFile}
                  disabled={isValidating}
                >
                  {isValidating ? (
                    <>
                      <Loader2Icon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Validating...
                    </>
                  ) : (
                    'Validate File'
                  )}
                </Button>
              )}
              {validationComplete && (
                <Button 
                  onClick={processBatch}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2Icon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Processing...
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
              {batchJobs.map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#07002F]">
                    {job.fileName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.dateSubmitted.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.recordCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {job.status === 'completed' ? 'Completed' : 'Failed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.status === 'completed' && (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isProcessing && (
        <ProcessingModal
          isOpen={isProcessing}
          progress={progress}
          onClose={() => setIsProcessing(false)}
          onViewResults={() => handleViewResults('')}
        />
      )}
    </>
  );
};

export default BatchAssessment;