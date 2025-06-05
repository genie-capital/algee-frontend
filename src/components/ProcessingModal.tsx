import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, FileText, BarChart3, Printer, Info, ArrowRight } from 'lucide-react';
import Button from './common/Button';

interface ProcessingModalProps {
  isOpen: boolean;
  progress: number;
  onClose: () => void;
  onViewResults: () => void;
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

const ProcessingModal: React.FC<ProcessingModalProps> = ({ isOpen, progress, onClose, onViewResults }) => {
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

  // Separate effect for initializing facts when modal opens
  useEffect(() => {
    if (isOpen) {
      const shuffled = [...funFacts].sort(() => Math.random() - 0.5);
      setShuffledFacts(shuffled);
      setCurrentFact(0);
    }
  }, [isOpen]);

  // Separate effect for fact rotation interval
  useEffect(() => {
    if (!isOpen || shuffledFacts.length === 0) return;

    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % shuffledFacts.length);
    }, 6000); // 6 seconds

    return () => clearInterval(factInterval);
  }, [isOpen, shuffledFacts.length]);

  // Separate effect for updating current step based on progress
  useEffect(() => {
    const stepProgress = Math.floor((progress / 100) * (steps.length - 1));
    setCurrentStep(stepProgress);
  }, [progress]);

  if (!isOpen) return null;

  const isComplete = progress === 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[1000px] overflow-hidden shadow-xl transform transition-all">
        {/* Fun Facts Section */}
        <div className="bg-[#07002F] text-white p-8 relative h-[200px]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#07002F] to-[#07002F]/90" />
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <Info className="h-6 w-6 mr-2" />
              <h3 className="text-xl font-semibold">About ALGEE</h3>
            </div>
            <div className="h-[100px] overflow-hidden relative">
              <div
                className="absolute w-full transition-all duration-700 ease-in-out"
                style={{
                  transform: `translateY(-${currentFact * 100}px)`,
                }}
              >
                {shuffledFacts.map((fact, index) => (
                  <div
                    key={index}
                    className="h-[100px] flex items-center"
                  >
                    <p className="text-lg leading-relaxed">
                      {fact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Processing Steps Section */}
        <div className="p-8">
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-4 transition-all duration-300 ${
                    isActive ? 'scale-105' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-green-100 text-green-600'
                        : isActive
                        ? 'bg-[#008401] text-white animate-pulse'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-medium ${
                        isActive ? 'text-[#07002F]' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                  {isActive && !isComplete && (
                    <div className="w-24">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#008401] rounded-full transition-all duration-300"
                          style={{
                            width: `${((progress % 25) / 25) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Overall Progress Bar */}
          {!isComplete && (
            <div className="mt-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#008401] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* View Results Button */}
          {isComplete && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={onViewResults}
                className="flex items-center space-x-2"
              >
                <span>View Batch Results</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal;