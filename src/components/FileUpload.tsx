// import React, { useState, useCallback } from 'react';
// import { Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';
// import Button from './common/Button';

// interface FileUploadProps {
//   onFileSelect: (file: File) => void;
//   onValidationComplete: (isValid: boolean) => void;
//   isProcessing?: boolean;
// }

// const FileUpload: React.FC<FileUploadProps> = ({
//   onFileSelect,
//   onValidationComplete,
//   isProcessing = false
// }) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isValidating, setIsValidating] = useState(false);
//   const [isValid, setIsValid] = useState(false);

//   const validateFile = useCallback((file: File) => {
//     // Check if file is CSV
//     if (!file.name.toLowerCase().endsWith('.csv')) {
//       setError('Please upload a CSV file');
//       onValidationComplete(false);
//       return false;
//     }

//     // Check file size (e.g., max 10MB)
//     if (file.size > 10 * 1024 * 1024) {
//       setError('File size should be less than 10MB');
//       onValidationComplete(false);
//       return false;
//     }

//     // Additional validations can be added here
//     return true;
//   }, [onValidationComplete]);

//   const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files?.[0];
//     setError(null);
//     setIsValid(false);

//     if (selectedFile) {
//       setFile(selectedFile);
//       setIsValidating(true);

//       // Simulate backend validation
//       setTimeout(() => {
//         const isValid = validateFile(selectedFile);
//         setIsValid(isValid);
//         setIsValidating(false);
//         if (isValid) {
//           onFileSelect(selectedFile);
//         }
//       }, 1000);
//     }
//   }, [validateFile, onFileSelect]);

//   const handleRemoveFile = useCallback(() => {
//     setFile(null);
//     setError(null);
//     setIsValid(false);
//     onValidationComplete(false);
//   }, [onValidationComplete]);

//   return (
//     <div className="w-full">
//       {!file ? (
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//           <input
//             type="file"
//             accept=".csv"
//             onChange={handleFileChange}
//             className="hidden"
//             id="file-upload"
//             disabled={isProcessing}
//           />
//           <label
//             htmlFor="file-upload"
//             className="cursor-pointer flex flex-col items-center"
//           >
//             <Upload className="w-12 h-12 text-gray-400 mb-4" />
//             <span className="text-gray-600 mb-2">
//               Drag and drop your CSV file here, or click to browse
//             </span>
//             <span className="text-sm text-gray-500">
//               Only CSV files are supported
//             </span>
//           </label>
//         </div>
//       ) : (
//         <div className="border rounded-lg p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               {isValidating ? (
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008401]" />
//               ) : isValid ? (
//                 <CheckCircle2 className="w-8 h-8 text-[#008401]" />
//               ) : error ? (
//                 <AlertCircle className="w-8 h-8 text-red-500" />
//               ) : null}
//               <div>
//                 <p className="font-medium text-gray-900">{file.name}</p>
//                 <p className="text-sm text-gray-500">
//                   {(file.size / 1024 / 1024).toFixed(2)} MB
//                 </p>
//               </div>
//             </div>
//             {!isProcessing && (
//               <button
//                 onClick={handleRemoveFile}
//                 className="text-gray-400 hover:text-gray-500"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             )}
//           </div>
//           {isValidating && (
//             <p className="mt-2 text-sm text-gray-500">
//               Validating file...
//             </p>
//           )}
//           {error && (
//             <p className="mt-2 text-sm text-red-600">
//               {error}
//             </p>
//           )}
//           {isValid && (
//             <p className="mt-2 text-sm text-[#008401]">
//               File validation successful
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload; 