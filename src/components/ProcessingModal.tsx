import React, { useState, useEffect } from 'react';
import { FileText, BarChart3, Loader2, Printer, CheckCircle2, InfoIcon } from 'lucide-react';

interface ProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewResults: () => void;
  totalClients: number;
  processedClients: number;
  failedClients: number;
  isComplete: boolean;
  error?: string;
}

const funFacts = [
  "ALGEE is Genie Capital's proprietary credit scoring algorithm that revolutionizes how credit limits and interest rates are determined.",
  "Our algorithm analyzes over 100 unique variables to create personalized credit profiles for each individual.",
  "ALGEE's machine learning models are trained on millions of credit transactions to identify patterns that traditional scoring methods miss.",
  "Unlike traditional credit scoring, ALGEE considers alternative data points to provide fair credit access to underserved populations.",
  "Our system can process and analyze hundreds of credit applications per minute, making credit decisions faster and more accurate.",
  "ALGEE's dynamic scoring system adapts to changing economic conditions and individual circumstances in real-time.",
  "The algorithm's name represents its core principles: Advanced, Learning, Growth, Evaluation, and Enhancement.",
  "Genie Capital's ALGEE is estimated to help increase credit access by 40% for previously underserved communities.",
  "Our credit scoring system is regularly audited to ensure fairness and compliance with financial regulations.",
  "ALGEE's batch processing capability allows financial institutions to efficiently evaluate large volumes of credit applications.",
];

const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  onClose,
  onViewResults,
  totalClients,
  processedClients,
  failedClients,
  isComplete,
  error
}) => {
  const [currentFact, setCurrentFact] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [shuffledFacts, setShuffledFacts] = useState<string[]>([]);

  const steps = [
    { icon: FileText, label: 'Parsing Data', description: 'Reading and organizing client information' },
    { icon: BarChart3, label: 'Analyzing Data', description: 'Processing credit variables and signals' },
    { icon: Loader2, label: 'Computing Results', description: 'Calculating credit scores and limits' },
    { icon: Printer, label: 'Printing Results', description: 'Preparing credit assessment reports' },
    { icon: CheckCircle2, label: 'Completed', description: 'All done!' },
  ];

  // Calculate progress percentage
  const progress = totalClients > 0 ? (processedClients / totalClients) * 100 : 0;

  // Initialize facts when modal opens
  useEffect(() => {
    if (isOpen) {
      const shuffled = [...funFacts].sort(() => Math.random() - 0.5);
      setShuffledFacts(shuffled);
      setCurrentFact(0);
    }
  }, [isOpen]);

  // Rotate facts
  useEffect(() => {
    if (!isOpen || shuffledFacts.length === 0) return;

    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % shuffledFacts.length);
    }, 6000);

    return () => clearInterval(factInterval);
  }, [isOpen, shuffledFacts.length]);

  // Update current step based on progress
  useEffect(() => {
    const stepProgress = Math.floor((progress / 100) * (steps.length - 1));
    setCurrentStep(stepProgress);
  }, [progress]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black w-1200 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Processing Credit Assessments
          </h2>
          <p className="text-gray-600">
            Please wait while we process {totalClients} client records
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div
            className="bg-[#008401] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Records</p>
            <p className="text-xl font-semibold">{totalClients}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Processed</p>
            <p className="text-xl font-semibold text-[#008401]">{processedClients}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Failed</p>
            <p className="text-xl font-semibold text-red-600">{failedClients}</p>
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={step.label}
                className={`flex items-center p-4 rounded-lg ${
                  isActive ? 'bg-[#008401] bg-opacity-10' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                    isCompleted
                      ? 'bg-[#008401] text-white'
                      : isActive
                      ? 'bg-[#008401] text-white animate-pulse'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      isActive ? 'text-[#008401]' : 'text-gray-900'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fun Fact */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <InfoIcon className="w-5 h-5 text-[#008401] mt-1 mr-3" />
            <p className="text-gray-600">{shuffledFacts[currentFact]}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          {isComplete ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <button
                onClick={onViewResults}
                className="px-4 py-2 bg-[#008401] text-white rounded hover:bg-[#006401]"
              >
                View Results
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={!error}
            >
              {error ? 'Close' : 'Processing...'}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingModal;