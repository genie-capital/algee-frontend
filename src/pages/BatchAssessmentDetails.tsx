import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import Button from '../components/common/Button';
import Layout from '../components/Layout';

interface ClientAssessment {
  id: string;
  name: string;
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  creditLimit: string;
  interestRate: string;
}

const BatchAssessmentDetails = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();

  // This would typically come from an API call using the batchId
  const [batchDetails] = React.useState({
    id: batchId,
    fileName: 'clients_oct_2023.csv',
    dateSubmitted: new Date('2023-10-15T14:30:25'),
    totalRecords: 245,
    completedRecords: 245,
    averageScore: 85,
    riskDistribution: {
      Low: 150,
      Medium: 75,
      High: 20
    }
  });

  const [clientAssessments] = React.useState<ClientAssessment[]>([
    {
      id: 'CLI-001',
      name: 'John Doe',
      score: 92,
      riskLevel: 'Low',
      creditLimit: 'XAF600,000',
      interestRate: '3.8%'
    },
    {
      id: 'CLI-002',
      name: 'Jane Smith',
      score: 78,
      riskLevel: 'Medium',
      creditLimit: 'XAF150,000',
      interestRate: '6.5%'
    },
    {
      id: 'CLI-003',
      name: 'Bob Johnson',
      score: 45,
      riskLevel: 'High',
      creditLimit: 'XAF50,000',
      interestRate: '11.2%'
    }
  ]);

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
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="mr-4"
              onClick={() => navigate('/results')}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Batch Assessment Details
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {batchDetails.fileName}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Batch Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Records</p>
              <p className="text-2xl font-semibold text-gray-900">{batchDetails.totalRecords}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Completed Records</p>
              <p className="text-2xl font-semibold text-gray-900">{batchDetails.completedRecords}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-semibold text-gray-900">{batchDetails.averageScore}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Date Processed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {batchDetails.dateSubmitted.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(batchDetails.riskDistribution).map(([level, count]) => (
              <div key={level} className={`p-4 rounded-lg ${getRiskLevelColor(level)}`}>
                <p className="text-sm font-medium">{level} Risk</p>
                <p className="text-2xl font-semibold">{count} clients</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Client Assessments
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Limit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interest Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientAssessments.map((assessment) => (
                <tr key={assessment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#07002F]">
                    {assessment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assessment.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full mr-2 ${
                        assessment.score >= 80 ? 'bg-green-500' : 
                        assessment.score >= 70 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}></div>
                      <span className="text-sm text-gray-900">
                        {assessment.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelColor(assessment.riskLevel)}`}>
                      {assessment.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assessment.creditLimit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assessment.interestRate}
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

export default BatchAssessmentDetails; 