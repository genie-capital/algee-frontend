import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  User, 
  Building, 
  Calendar, 
  Search,
  Shield,
  SearchIcon,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  ChevronRight
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getAllInstitutions, updateInstitution } from '../../services/institutionService';
import AdminNavbar from '../../components/admin/AdminNavbar';
import BackToDashboard from '../../components/admin/BackToDashboard';

interface Document {
  id: string;
  name: string;
  status: string;
  url: string;
}

interface Contact {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Institution {
  id: string;
  name: string;
  type: string;
  registrationNumber: string;
  registrationDate: string;
  status: string;
  verificationStatus: string;
  authorizationNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  phoneNumber: string;
  website: string;
  adminInfo: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    directPhone: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
    };
  };
  username: string;
  enableTwoFactor: boolean;
  acceptMarketing: boolean;
}

// Mock data for pending institutions
const mockInstitutions: Institution[] = [
  {
    id: '1',
    name: 'First National Bank',
    type: 'bank',
    registrationNumber: 'FNB-2024-001',
    registrationDate: '2024-01-15',
    status: 'pending',
    verificationStatus: 'pending',
    authorizationNumber: 'AUTH-2024-001',
    address: {
      street: '123 Financial District',
      city: 'New York',
      state: 'New York',
      country: 'United States'
    },
    phoneNumber: '+1 234 567 8900',
    website: 'www.fnb.com',
    adminInfo: {
      firstName: 'John',
      lastName: 'Smith',
      jobTitle: 'Chief Financial Officer',
      email: 'john.smith@fnb.com',
      directPhone: '+1 234 567 8901',
      address: {
        street: '123 Financial District',
        city: 'New York',
        state: 'New York',
        country: 'United States'
      }
    },
    username: 'johnsmith',
    enableTwoFactor: true,
    acceptMarketing: false
  },
  {
    id: '2',
    name: 'Community Credit Union',
    type: 'credit_union',
    registrationNumber: 'CCU-2024-002',
    registrationDate: '2024-02-01',
    status: 'pending',
    verificationStatus: 'pending',
    authorizationNumber: 'AUTH-2024-002',
    address: {
      street: '456 Main Street',
      city: 'Chicago',
      state: 'Illinois',
      country: 'United States'
    },
    phoneNumber: '+1 234 567 8902',
    website: 'www.ccu.org',
    adminInfo: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      jobTitle: 'Operations Director',
      email: 'sarah.johnson@ccu.org',
      directPhone: '+1 234 567 8903',
      address: {
        street: '456 Main Street',
        city: 'Chicago',
        state: 'Illinois',
        country: 'United States'
      }
    },
    username: 'sarahj',
    enableTwoFactor: true,
    acceptMarketing: true
  },
  {
    id: '3',
    name: 'MicroFinance Solutions',
    type: 'microfinance',
    registrationNumber: 'MFS-2024-003',
    registrationDate: '2024-03-01',
    status: 'pending',
    verificationStatus: 'pending',
    authorizationNumber: 'AUTH-2024-003',
    address: {
      street: '789 Business Park',
      city: 'Buea',
      state: 'South-West',
      country: 'Cameroon'
    },
    phoneNumber: '+1 234 567 8904',
    website: 'www.mfs.com',
    adminInfo: {
      firstName: 'Michael',
      lastName: 'Chen',
      jobTitle: 'Managing Director',
      email: 'michael.chen@mfs.com',
      directPhone: '+1 234 567 8905',
      address: {
        street: '789 Business Park',
        city: 'Buea',
        state: 'South-West',
        country: 'Cameroon'
      }
    },
    username: 'michaelc',
    enableTwoFactor: true,
    acceptMarketing: false
  }
];

const InstitutionApproval: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>(mockInstitutions);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [comment, setComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showRejectReason, setShowRejectReason] = useState(false);
  
  const navigate = useNavigate();

  const handleApprove = async (id: string) => {
    try {
      await updateInstitution(id, {
        verificationStatus: 'approved'
      });
      
      setInstitutions(prev => prev.filter(inst => inst.id !== id));
      setSelectedInstitution(null);
      setComment('');
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve institution');
    }
  };

  const handleReject = async (id: string) => {
    if (!comment) {
      setError('Please provide a reason for rejection');
      return;
    }
    
    try {
      await updateInstitution(id, {
        verificationStatus: 'rejected',
        notes: comment
      });
      
      setInstitutions(prev => prev.filter(inst => inst.id !== id));
      setSelectedInstitution(null);
      setComment('');
      setError(null);
      setShowRejectReason(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject institution');
    }
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
    setCurrentStep(1);
    setShowRejectReason(false);
    setComment('');
  };

  const filteredInstitutions = institutions.filter(inst => 
    inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.adminInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.adminInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const steps = ['Institution Information', 'Primary Administrator', 'Account Security', 'Terms & Compliance'];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <BackToDashboard />
          
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Pending Institution Approvals
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review and approve new institution registrations
              </p>
            </div>
          </div>

          {error && <ErrorAlert message={error} />}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Pending Institutions
                </h3>
                <div className="mt-3 sm:mt-0">
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search institutions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institution Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Primary Contact
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
                  {filteredInstitutions.map((institution) => (
                    <React.Fragment key={institution.id}>
                      <tr 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleRowExpansion(institution.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {new Date(institution.registrationDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <Building2 className="h-10 w-10 text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {institution.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {institution.registrationNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {institution.adminInfo.firstName} {institution.adminInfo.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {institution.adminInfo.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending Review
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {expandedRow === institution.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </td>
                      </tr>
                      {expandedRow === institution.id && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-gray-50">
                            <div className="space-y-6">
                              {/* Progress Steps */}
                              <div className="mb-8">
                                <div className="flex justify-between">
                                  {steps.map((step, index) => (
                                    <div key={step} className="flex items-center">
                                      <div
                                        className={`
                                          w-8 h-8 rounded-full flex items-center justify-center
                                          ${currentStep > index + 1 ? 'bg-[#008401] text-white' : currentStep === index + 1 ? 'bg-[#07002F] text-white' : 'bg-gray-200 text-gray-600'}
                                        `}
                                      >
                                        {currentStep > index + 1 ? <CheckCircle size={16} /> : index + 1}
                                      </div>
                                      <span className="hidden md:block ml-2 text-sm">{step}</span>
                                      {index < steps.length - 1 && <ChevronRight className="mx-2 text-gray-400" size={16} />}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Step Content */}
                              {currentStep === 1 && (
                                <div className="bg-white p-6 rounded-lg shadow">
                                  <h4 className="text-lg font-semibold mb-4 text-gray-900">Institution Details</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <p><span className="font-medium">Name:</span> {institution.name}</p>
                                      <p><span className="font-medium">Type:</span> {institution.type}</p>
                                      <p><span className="font-medium">Registration Number:</span> {institution.registrationNumber}</p>
                                      <p><span className="font-medium">Authorization Number:</span> {institution.authorizationNumber}</p>
                                    </div>
                                    <div>
                                      <p><span className="font-medium">Phone:</span> {institution.phoneNumber}</p>
                                      <p><span className="font-medium">Website:</span> {institution.website}</p>
                                      <p><span className="font-medium">Address:</span> {institution.address.street}, {institution.address.city}, {institution.address.state}, {institution.address.country}</p>
                                    </div>
                                  </div>
                                  <div className="mt-6 flex justify-end space-x-3">
                                    <Button
                                      variant="danger"
                                      onClick={() => setShowRejectReason(true)}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button
                                      onClick={() => setCurrentStep(prev => prev + 1)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve & Continue
                                    </Button>
                                  </div>
                                  {showRejectReason && (
                                    <div className="mt-4">
                                      <textarea
                                        placeholder="Enter reason for rejection"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F] resize-none"
                                      />
                                      <div className="flex justify-end space-x-3 mt-4">
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setShowRejectReason(false);
                                            setComment('');
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          variant="danger"
                                          onClick={() => handleReject(institution.id)}
                                          disabled={!comment.trim()}
                                        >
                                          Confirm Rejection
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {currentStep === 2 && (
                                <div className="bg-white p-6 rounded-lg shadow">
                                  <h4 className="text-lg font-semibold mb-4 text-gray-900">Administrator Details</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <p><span className="font-medium">Name:</span> {institution.adminInfo.firstName} {institution.adminInfo.lastName}</p>
                                      <p><span className="font-medium">Job Title:</span> {institution.adminInfo.jobTitle}</p>
                                      <p><span className="font-medium">Email:</span> {institution.adminInfo.email}</p>
                                      <p><span className="font-medium">Phone:</span> {institution.adminInfo.directPhone}</p>
                                    </div>
                                    <div>
                                      <p><span className="font-medium">Address:</span> {institution.adminInfo.address.street}, {institution.adminInfo.address.city}, {institution.adminInfo.address.state}, {institution.adminInfo.address.country}</p>
                                    </div>
                                  </div>
                                  <div className="mt-6 flex justify-end space-x-3">
                                    <Button
                                      variant="danger"
                                      onClick={() => setShowRejectReason(true)}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button
                                      onClick={() => setCurrentStep(prev => prev + 1)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve & Continue
                                    </Button>
                                  </div>
                                  {showRejectReason && (
                                    <div className="mt-4">
                                      <textarea
                                        placeholder="Enter reason for rejection"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F] resize-none"
                                      />
                                      <div className="flex justify-end space-x-3 mt-4">
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setShowRejectReason(false);
                                            setComment('');
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          variant="danger"
                                          onClick={() => handleReject(institution.id)}
                                          disabled={!comment.trim()}
                                        >
                                          Confirm Rejection
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {currentStep === 3 && (
                                <div className="bg-white p-6 rounded-lg shadow">
                                  <h4 className="text-lg font-semibold mb-4 text-gray-900">Account Security</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <p><span className="font-medium">Username:</span> {institution.username}</p>
                                      <p><span className="font-medium">Two-Factor Authentication:</span> {institution.enableTwoFactor ? 'Enabled' : 'Disabled'}</p>
                                    </div>
                                  </div>
                                  <div className="mt-6 flex justify-end space-x-3">
                                    <Button
                                      variant="danger"
                                      onClick={() => setShowRejectReason(true)}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button
                                      onClick={() => setCurrentStep(prev => prev + 1)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve & Continue
                                    </Button>
                                  </div>
                                  {showRejectReason && (
                                    <div className="mt-4">
                                      <textarea
                                        placeholder="Enter reason for rejection"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F] resize-none"
                                      />
                                      <div className="flex justify-end space-x-3 mt-4">
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setShowRejectReason(false);
                                            setComment('');
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          variant="danger"
                                          onClick={() => handleReject(institution.id)}
                                          disabled={!comment.trim()}
                                        >
                                          Confirm Rejection
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {currentStep === 4 && (
                                <div className="bg-white p-6 rounded-lg shadow">
                                  <h4 className="text-lg font-semibold mb-4 text-gray-900">Terms & Compliance</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <p><span className="font-medium">Marketing Communications:</span> {institution.acceptMarketing ? 'Accepted' : 'Not Accepted'}</p>
                                    </div>
                                  </div>
                                  <div className="mt-6 flex justify-end space-x-3">
                                    <Button
                                      variant="danger"
                                      onClick={() => setShowRejectReason(true)}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button
                                      onClick={() => handleApprove(institution.id)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve Application
                                    </Button>
                                  </div>
                                  {showRejectReason && (
                                    <div className="mt-4">
                                      <textarea
                                        placeholder="Enter reason for rejection"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F] resize-none"
                                      />
                                      <div className="flex justify-end space-x-3 mt-4">
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setShowRejectReason(false);
                                            setComment('');
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          variant="danger"
                                          onClick={() => handleReject(institution.id)}
                                          disabled={!comment.trim()}
                                        >
                                          Confirm Rejection
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Navigation Buttons */}
                              <div className="flex justify-between pt-6">
                                {currentStep > 1 && (
                                  <Button
                                    variant="outline"
                                    onClick={() => setCurrentStep(prev => prev - 1)}
                                  >
                                    Previous
                                  </Button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstitutionApproval;