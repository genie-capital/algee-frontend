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
import { getAllInstitutions, updateInstitutionStatus } from '../../services/auth';
import AdminNavbar from '../../components/admin/AdminNavbar';
import BackToDashboard from '../../components/admin/BackToDashboard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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

const InstitutionApproval: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [comment, setComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState<string | null>(null);
  const [rejectionLoading, setRejectionLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    setLoading(true);
    setError(null);
    try {
      const institutionsData = await getAllInstitutions();
      
      // Transform the API data to match our interface
      const transformedInstitutions = institutionsData.map((inst: any) => ({
        id: inst.id.toString(),
        name: inst.name,
        type: 'Financial Institution', // Default type
        registrationNumber: `REG-${inst.id}`,
        registrationDate: new Date(inst.createdAt).toISOString().split('T')[0],
        status: inst.is_active ? 'approved' : 'pending', // Map is_active to status
        verificationStatus: inst.is_active ? 'verified' : 'pending',
        authorizationNumber: `AUTH-${inst.id}`,
        address: {
          street: 'N/A',
          city: 'N/A',
          state: 'N/A',
          country: 'N/A'
        },
        phoneNumber: 'N/A',
        website: 'N/A',
        adminInfo: {
          firstName: 'N/A',
          lastName: 'N/A',
          jobTitle: 'N/A',
          email: inst.email,
          directPhone: 'N/A',
          address: {
            street: 'N/A',
            city: 'N/A',
            state: 'N/A',
            country: 'N/A'
          }
        },
        username: inst.email,
        enableTwoFactor: false,
        acceptMarketing: false
      }));
      
      setInstitutions(transformedInstitutions);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch institutions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setApprovalLoading(id);
    setError(null);
    setSuccessMessage(null);
    try {
      await updateInstitutionStatus(id, true);
      await fetchInstitutions();
      setSelectedInstitution(null);
      setComment('');
      setSuccessMessage('Institution approved successfully');
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to approve institution');
    } finally {
      setApprovalLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!comment.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    
    setRejectionLoading(id);
    setError(null);
    setSuccessMessage(null);
    try {
      // For rejection, we deactivate the institution
      await updateInstitutionStatus(id, false);
      
      await fetchInstitutions();
      setSelectedInstitution(null);
      setComment('');
      setError(null);
      setShowRejectReason(false);
      setSuccessMessage('Institution rejected successfully');
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reject institution');
    } finally {
      setRejectionLoading(null);
    }
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
    setCurrentStep(1);
    setShowRejectReason(false);
    setComment('');
    setError(null);
  };

  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inst.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inst.adminInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inst.adminInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inst.adminInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = filterStatus === 'all' || inst.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const steps = ['Institution Information', 'Primary Administrator', 'Account Security', 'Terms & Compliance'];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending Review</span>;
      case 'approved':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <BackToDashboard />
          
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Institution Approvals
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review and manage institution registrations
              </p>
            </div>
          </div>

          {error && <ErrorAlert message={error} />}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Institutions
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        filterStatus === 'all' ? 'bg-[#07002F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterStatus('pending')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        filterStatus === 'pending' ? 'bg-[#07002F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setFilterStatus('approved')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        filterStatus === 'approved' ? 'bg-[#07002F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Approved
                    </button>
                    <button
                      onClick={() => setFilterStatus('rejected')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        filterStatus === 'rejected' ? 'bg-[#07002F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Rejected
                    </button>
                  </div>
                </div>
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

            {loading ? (
              <div className="p-6 text-center">
                <LoadingSpinner size="large" text="Loading institutions..." />
              </div>
            ) : filteredInstitutions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <div className="flex flex-col items-center">
                  <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900">No institutions found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {filterStatus === 'pending' 
                      ? 'There are no pending institutions to review'
                      : filterStatus === 'approved'
                      ? 'No approved institutions found'
                      : filterStatus === 'rejected'
                      ? 'No rejected institutions found'
                      : 'No institutions found matching your search criteria'}
                  </p>
                </div>
              </div>
            ) : (
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
                          className={`cursor-pointer hover:bg-gray-50 ${
                            expandedRow === institution.id ? 'bg-gray-50' : ''
                          }`}
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
                            {getStatusBadge(institution.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              {expandedRow === institution.id ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                              {institution.status === 'pending' && (
                                <span className="ml-2 text-xs text-gray-500">Click to review</span>
                              )}
                            </div>
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
                                        <p><span className="font-medium">Website:</span> {institution.website || 'N/A'}</p>
                                        <p><span className="font-medium">Address:</span> {institution.address.street}, {institution.address.city}, {institution.address.state}, {institution.address.country}</p>
                                      </div>
                                    </div>
                                    <div className="mt-6 flex justify-end space-x-3">
                                      {institution.status === 'pending' && (
                                        <>
                                          <Button
                                            variant="danger"
                                            onClick={() => setShowRejectReason(true)}
                                            disabled={!!approvalLoading || !!rejectionLoading}
                                          >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            {rejectionLoading === institution.id ? 'Rejecting...' : 'Reject'}
                                          </Button>
                                          <Button
                                            onClick={() => setCurrentStep(prev => prev + 1)}
                                            disabled={!!approvalLoading || !!rejectionLoading}
                                          >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            {approvalLoading === institution.id ? 'Approving...' : 'Approve & Continue'}
                                          </Button>
                                        </>
                                      )}
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
                                            disabled={!!approvalLoading || !!rejectionLoading}
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            variant="danger"
                                            onClick={() => handleReject(institution.id)}
                                            disabled={!comment.trim() || !!approvalLoading || !!rejectionLoading}
                                          >
                                            {rejectionLoading === institution.id ? 'Rejecting...' : 'Confirm Rejection'}
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
                                      {institution.status === 'pending' && (
                                        <>
                                          <Button
                                            variant="danger"
                                            onClick={() => setShowRejectReason(true)}
                                            disabled={!!approvalLoading || !!rejectionLoading}
                                          >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            {rejectionLoading === institution.id ? 'Rejecting...' : 'Reject'}
                                          </Button>
                                          <Button
                                            onClick={() => setCurrentStep(prev => prev + 1)}
                                            disabled={!!approvalLoading || !!rejectionLoading}
                                          >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            {approvalLoading === institution.id ? 'Approving...' : 'Approve & Continue'}
                                          </Button>
                                        </>
                                      )}
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
                                            disabled={!!approvalLoading || !!rejectionLoading}
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            variant="danger"
                                            onClick={() => handleReject(institution.id)}
                                            disabled={!comment.trim() || !!approvalLoading || !!rejectionLoading}
                                          >
                                            {rejectionLoading === institution.id ? 'Rejecting...' : 'Confirm Rejection'}
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
                                      {institution.status === 'pending' && (
                                        <>
                                          <Button
                                            variant="danger"
                                            onClick={() => setShowRejectReason(true)}
                                            disabled={!!approvalLoading || !!rejectionLoading}
                                          >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            {rejectionLoading === institution.id ? 'Rejecting...' : 'Reject'}
                                          </Button>
                                          <Button
                                            onClick={() => setCurrentStep(prev => prev + 1)}
                                            disabled={!!approvalLoading || !!rejectionLoading}
                                          >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            {approvalLoading === institution.id ? 'Approving...' : 'Approve & Continue'}
                                          </Button>
                                        </>
                                      )}
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
                                            disabled={!!approvalLoading || !!rejectionLoading}
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            variant="danger"
                                            onClick={() => handleReject(institution.id)}
                                            disabled={!comment.trim() || !!approvalLoading || !!rejectionLoading}
                                          >
                                            {rejectionLoading === institution.id ? 'Rejecting...' : 'Confirm Rejection'}
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
                                      {institution.status === 'pending' && (
                                        <>
                                          <Button
                                            variant="danger"
                                            onClick={() => setShowRejectReason(true)}
                                            disabled={!!approvalLoading || !!rejectionLoading}
                                          >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            {rejectionLoading === institution.id ? 'Rejecting...' : 'Reject'}
                                          </Button>
                                          <Button
                                            onClick={() => handleApprove(institution.id)}
                                            disabled={!!approvalLoading || !!rejectionLoading}
                                          >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            {approvalLoading === institution.id ? 'Approving...' : 'Approve Application'}
                                          </Button>
                                        </>
                                      )}
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
                                            disabled={!!approvalLoading || !!rejectionLoading}
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            variant="danger"
                                            onClick={() => handleReject(institution.id)}
                                            disabled={!comment.trim() || !!approvalLoading || !!rejectionLoading}
                                          >
                                            {rejectionLoading === institution.id ? 'Rejecting...' : 'Confirm Rejection'}
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
                                      disabled={!!approvalLoading || !!rejectionLoading}
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstitutionApproval;