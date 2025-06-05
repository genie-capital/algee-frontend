import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Layout from '../components/Layout';

interface AssessmentResult {
  id: string;
  fileName: string;
  dateSubmitted: Date;
  recordCount: number;
  status: 'completed' | 'failed';
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

const AssessmentResults = () => {
  const navigate = useNavigate();
  
  // This would typically come from an API or state management
  const [results] = React.useState<AssessmentResult[]>([
    {
      id: 'BATCH-2023-10-001',
      fileName: 'clients_oct_2023.csv',
      dateSubmitted: new Date('2023-10-15T14:30:25'),
      recordCount: 245,
      status: 'completed',
      score: 85,
      riskLevel: 'Low'
    },
    {
      id: 'BATCH-2023-10-002',
      fileName: 'clients_oct_2023_2.csv',
      dateSubmitted: new Date('2023-10-14T09:15:12'),
      recordCount: 178,
      status: 'completed',
      score: 72,
      riskLevel: 'Medium'
    },
    {
      id: 'BATCH-2023-10-003',
      fileName: 'clients_oct_2023_3.csv',
      dateSubmitted: new Date('2023-10-13T16:42:55'),
      recordCount: 92,
      status: 'failed',
      score: 0,
      riskLevel: 'High'
    }
  ]);

  const handleViewDetails = (batchId: string) => {
    navigate(`/batchdetails`);
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Assessment Results
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and analyze batch assessment results
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            All Assessment Results
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#07002F]">
                    {result.fileName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.dateSubmitted.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.recordCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      result.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.status === 'completed' ? 'Completed' : 'Failed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.status === 'completed' ? `${result.score}%` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {result.status === 'completed' && (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelColor(result.riskLevel)}`}>
                        {result.riskLevel}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.status === 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(result.id)}
                      >
                        View Details
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AssessmentResults;