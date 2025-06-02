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
  Flag,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
  ClipboardCheck,
  Shield,
  Phone
} from 'lucide-react';
import Button from '../../components/common/Button';

// Mock data for pending institutions
const mockPendingInstitutions: Institution[] = [
  {
    id: 1,
    name: 'First National Bank',
    type: 'Commercial Bank',
    registrationNumber: 'BRN-12345-XYZ',
    registrationDate: '2023-10-12',
    primaryContact: 'John Smith',
    email: 'john.smith@firstnational.com',
    phone: '+1 (555) 123-4567',
    verificationStatus: 'pending',
    documents: [
      { name: 'Business Registration', status: 'verified' },
      { name: 'Tax Compliance', status: 'verified' },
      { name: 'Banking License', status: 'pending' }
    ],
    complianceCheck: 'passed',
    businessLegitimacy: 'verified',
    contactVerification: 'pending',
    notes: 'Banking license verification in progress. All other documents verified.',
    approvalStage: 1,
    requiredApprovers: [
      { name: 'Document Verification', approved: true, approver: 'Jane Wilson', timestamp: '2023-10-13T14:30:00Z' },
      { name: 'Compliance Check', approved: true, approver: 'Robert Johnson', timestamp: '2023-10-14T09:15:00Z' },
      { name: 'Final Approval', approved: false, approver: '', timestamp: '' }
    ],
    approvalHistory: [
      { action: 'Documents Submitted', user: 'System', timestamp: '2023-10-12T10:45:00Z', comment: 'Initial submission received' },
      { action: 'Document Verification', user: 'Jane Wilson', timestamp: '2023-10-13T14:30:00Z', comment: 'Business registration and tax documents verified' },
      { action: 'Compliance Check', user: 'Robert Johnson', timestamp: '2023-10-14T09:15:00Z', comment: 'Compliance check passed' }
    ],
    slaDeadline: '2023-10-14T10:45:00Z'
  },
  {
    id: 2,
    name: 'Community Credit Union',
    type: 'Credit Union',
    registrationNumber: 'CRU-78901-ABC',
    registrationDate: '2023-10-14',
    primaryContact: 'Sarah Johnson',
    email: 'sarah.johnson@communitycredit.org',
    phone: '+1 (555) 987-6543',
    verificationStatus: 'pending',
    documents: [
      { name: 'Business Registration', status: 'verified' },
      { name: 'Tax Compliance', status: 'pending' },
      { name: 'Credit Union Charter', status: 'verified' }
    ],
    complianceCheck: 'pending',
    businessLegitimacy: 'verified',
    contactVerification: 'verified',
    notes: 'Awaiting tax compliance verification. Credit union charter verified.',
    approvalStage: 1,
    requiredApprovers: [
      { name: 'Document Verification', approved: false, approver: '', timestamp: '' },
      { name: 'Compliance Check', approved: false, approver: '', timestamp: '' },
      { name: 'Final Approval', approved: false, approver: '', timestamp: '' }
    ],
    approvalHistory: [
      { action: 'Documents Submitted', user: 'System', timestamp: '2023-10-14T08:30:00Z', comment: 'Initial submission received' },
      { action: 'Contact Verification', user: 'Michael Davis', timestamp: '2023-10-14T11:20:00Z', comment: 'Primary contact verified via phone' }
    ],
    slaDeadline: '2023-10-16T08:30:00Z'
  },
  {
    id: 3,
    name: 'Global Investment Partners',
    type: 'Investment Firm',
    registrationNumber: 'INV-56789-DEF',
    registrationDate: '2023-10-15',
    primaryContact: 'Michael Brown',
    email: 'michael.brown@globalinvest.com',
    phone: '+1 (555) 456-7890',
    verificationStatus: 'flagged',
    documents: [
      { name: 'Business Registration', status: 'verified' },
      { name: 'Tax Compliance', status: 'verified' },
      { name: 'Investment License', status: 'rejected' }
    ],
    complianceCheck: 'failed',
    businessLegitimacy: 'pending',
    contactVerification: 'verified',
    notes: 'Compliance check failed due to regulatory concerns. Investment license appears to be outdated.',
    approvalStage: 0,
    requiredApprovers: [
      { name: 'Document Verification', approved: false, approver: '', timestamp: '' },
      { name: 'Compliance Check', approved: false, approver: '', timestamp: '' },
      { name: 'Final Approval', approved: false, approver: '', timestamp: '' }
    ],
    approvalHistory: [
      { action: 'Documents Submitted', user: 'System', timestamp: '2023-10-15T14:20:00Z', comment: 'Initial submission received' },
      { action: 'Flagged for Review', user: 'Emily Chen', timestamp: '2023-10-15T16:45:00Z', comment: 'Potential compliance issues detected' }
    ],
    slaDeadline: '2023-10-17T14:20:00Z'
  }
];

interface Document {
  name: string;
  status: 'verified' | 'pending' | 'rejected';
}

interface Approver {
  name: string;
  approved: boolean;
  approver: string;
  timestamp: string;
}

interface ApprovalHistoryItem {
  action: string;
  user: string;
  timestamp: string;
  comment: string;
}

interface Institution {
  id: number;
  name: string;
  type: string;
  registrationNumber: string;
  registrationDate: string;
  primaryContact: string;
  email: string;
  phone: string;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
  documents: Document[];
  complianceCheck: 'passed' | 'pending' | 'failed';
  businessLegitimacy: 'verified' | 'pending' | 'rejected';
  contactVerification: 'verified' | 'pending' | 'rejected';
  notes: string;
  approvalStage: number;
  requiredApprovers: Approver[];
  approvalHistory: ApprovalHistoryItem[];
  slaDeadline: string;
}

const InstitutionApproval: React.FC = () => {
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>(mockPendingInstitutions);
  const [comment, setComment] = useState('');
  const [sortField, setSortField] = useState<string>('registrationDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [flagPriority, setFlagPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [activeTab, setActiveTab] = useState<'details' | 'verification' | 'approval'>('details');
  
  const navigate = useNavigate();

  // Templates for requesting additional information
  const infoTemplates = [
    { id: 'template1', name: 'Missing Document', text: 'We require additional documentation for your application. Please provide: ' },
    { id: 'template2', name: 'Verification Call', text: 'We need to schedule a verification call with your primary contact. Please provide available times in the next 48 hours.' },
    { id: 'template3', name: 'Compliance Information', text: 'Additional compliance information is required for your application. Please provide details about: ' }
  ];

  // Rejection reasons
  const rejectionReasons = [
    { id: 'reason1', name: 'Incomplete Documentation' },
    { id: 'reason2', name: 'Failed Compliance Check' },
    { id: 'reason3', name: 'Invalid Business Registration' },
    { id: 'reason4', name: 'Regulatory Concerns' }
  ];

  useEffect(() => {
    // Sort institutions
    const sortedInstitutions = [...institutions].sort((a, b) => {
      if (sortField === 'registrationDate') {
        const dateA = new Date(a.registrationDate).getTime();
        const dateB = new Date(b.registrationDate).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortField === 'type') {
        return sortDirection === 'asc' 
          ? a.type.localeCompare(b.type) 
          : b.type.localeCompare(a.type);
      }
      return 0;
    });
    
    // Filter by search term
    const filteredInstitutions = sortedInstitutions.filter(inst => 
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.primaryContact.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setInstitutions(filteredInstitutions);
  }, [sortField, sortDirection, searchTerm]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleApprove = (id: number) => {
    if (!comment) {
      alert('Please provide a comment for approval');
      return;
    }
    
    setInstitutions(prev => 
      prev.map(inst => {
        if (inst.id === id) {
          const updatedApprovalHistory = [
            ...inst.approvalHistory,
            {
              action: 'Approved',
              user: 'Admin User',
              timestamp: new Date().toISOString(),
              comment: comment
            }
          ];
          
          const updatedRequiredApprovers = inst.requiredApprovers.map((approver, index) => {
            if (index === inst.approvalStage) {
              return {
                ...approver,
                approved: true,
                approver: 'Admin User',
                timestamp: new Date().toISOString()
              };
            }
            return approver;
          });
          
          return {
            ...inst,
            verificationStatus: 'approved',
            approvalHistory: updatedApprovalHistory,
            requiredApprovers: updatedRequiredApprovers,
            approvalStage: inst.approvalStage + 1
          };
        }
        return inst;
      })
    );
    
    setComment('');
  };

  const handleReject = (id: number) => {
    if (!comment) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setInstitutions(prev => 
      prev.map(inst => {
        if (inst.id === id) {
          const updatedApprovalHistory = [
            ...inst.approvalHistory,
            {
              action: 'Rejected',
              user: 'Admin User',
              timestamp: new Date().toISOString(),
              comment: comment
            }
          ];
          
          return {
            ...inst,
            verificationStatus: 'rejected',
            approvalHistory: updatedApprovalHistory
          };
        }
        return inst;
      })
    );
    
    setComment('');
  };

  const handleRequestInfo = (id: number) => {
    if (!selectedTemplate || !comment) {
      alert('Please select a template and add specific details');
      return;
    }
    
    const template = infoTemplates.find(t => t.id === selectedTemplate);
    const fullComment = `${template?.text} ${comment}`;
    
    setInstitutions(prev => 
      prev.map(inst => {
        if (inst.id === id) {
          const updatedApprovalHistory = [
            ...inst.approvalHistory,
            {
              action: 'Additional Information Requested',
              user: 'Admin User',
              timestamp: new Date().toISOString(),
              comment: fullComment
            }
          ];
          
          return {
            ...inst,
            approvalHistory: updatedApprovalHistory
          };
        }
        return inst;
      })
    );
    
    setComment('');
    setSelectedTemplate('');
  };

  const handleFlag = (id: number) => {
    if (!comment) {
      alert('Please provide a reason for flagging');
      return;
    }
    
    setInstitutions(prev => 
      prev.map(inst => {
        if (inst.id === id) {
          const updatedApprovalHistory = [
            ...inst.approvalHistory,
            {
              action: `Flagged for Review (${flagPriority} priority)`,
              user: 'Admin User',
              timestamp: new Date().toISOString(),
              comment: comment
            }
          ];
          
          return {
            ...inst,
            verificationStatus: 'flagged',
            approvalHistory: updatedApprovalHistory
          };
        }
        return inst;
      })
    );
    
    setComment('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'passed':
        return <CheckCircle className="text-green-500" />;
      case 'rejected':
      case 'failed':
        return <XCircle className="text-red-500" />;
      case 'flagged':
        return <Flag className="text-yellow-500" />;
      default:
        return <AlertTriangle className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
      case 'passed':
        return <span className="text-green-500">Verified</span>;
      case 'rejected':
      case 'failed':
        return <span className="text-red-500">Rejected</span>;
      case 'flagged':
        return <span className="text-yellow-500">Flagged</span>;
      default:
        return <span className="text-gray-500">Pending</span>;
    }
  };

  const getSLAStatus = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const hoursRemaining = Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursRemaining < 0) {
      return <span className="text-red-500 flex items-center"><Clock size={16} className="mr-1" /> SLA Breached</span>;
    } else if (hoursRemaining < 12) {
      return <span className="text-yellow-500 flex items-center"><Clock size={16} className="mr-1" /> {hoursRemaining}h remaining</span>;
    } else {
      return <span className="text-green-500 flex items-center"><Clock size={16} className="mr-1" /> {hoursRemaining}h remaining</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Pending Institution Approvals</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search institutions..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Institution List */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-lg shadow">
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th 
                    className="text-left p-2 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('registrationDate')}
                  >
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      Registration Date
                      {sortField === 'registrationDate' && (
                        sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left p-2 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      <Building size={16} className="mr-1" />
                      Institution
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left p-2 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center">
                      <FileText size={16} className="mr-1" />
                      Type
                      {sortField === 'type' && (
                        sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                  <th className="text-left p-2">
                    <div className="flex items-center">
                      <User size={16} className="mr-1" />
                      Primary Contact
                    </div>
                  </th>
                  <th className="text-left p-2">
                    <div className="flex items-center">
                      Status
                    </div>
                  </th>
                  <th className="text-left p-2">SLA</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {institutions.map(institution => (
                  <tr key={institution.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{new Date(institution.registrationDate).toLocaleDateString()}</td>
                    <td className="p-2 font-medium">{institution.name}</td>
                    <td className="p-2">{institution.type}</td>
                    <td className="p-2">{institution.primaryContact}</td>
                    <td className="p-2">
                      <div className="flex items-center">
                        {getStatusIcon(institution.verificationStatus)}
                        <span className="ml-1">{institution.verificationStatus}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      {getSLAStatus(institution.slaDeadline)}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => setSelectedInstitution(institution)}
                          variant="outline"
                          size="sm"
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail View */}
        {selectedInstitution && (
          <div className="col-span-12 lg:col-span-5 bg-white rounded-lg shadow">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Institution Details</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedInstitution(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="flex border-b mb-4">
                <button 
                  className={`py-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
                <button 
                  className={`py-2 px-4 ${activeTab === 'verification' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('verification')}
                >
                  Verification
                </button>
                <button 
                  className={`py-2 px-4 ${activeTab === 'approval' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('approval')}
                >
                  Approval Workflow
                </button>
              </div>
              
              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium flex items-center">
                      <Building size={16} className="mr-2" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <label className="text-sm text-gray-500">Name</label>
                        <p className="font-medium">{selectedInstitution.name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Type</label>
                        <p>{selectedInstitution.type}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Registration Number</label>
                        <p>{selectedInstitution.registrationNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Registration Date</label>
                        <p>{new Date(selectedInstitution.registrationDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium flex items-center">
                      <User size={16} className="mr-2" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <label className="text-sm text-gray-500">Primary Contact</label>
                        <p>{selectedInstitution.primaryContact}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Email</label>
                        <p>{selectedInstitution.email}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Phone</label>
                        <p>{selectedInstitution.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Contact Verification</label>
                        <p className="flex items-center">
                          {getStatusIcon(selectedInstitution.contactVerification)}
                          <span className="ml-1">{selectedInstitution.contactVerification}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium flex items-center">
                      <FileText size={16} className="mr-2" />
                      Notes
                    </h3>
                    <p className="mt-2 p-2 bg-gray-50 rounded">{selectedInstitution.notes}</p>
                  </div>
                </div>
              )}
              
              {/* Verification Tab */}
              {activeTab === 'verification' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium flex items-center">
                      <ClipboardCheck size={16} className="mr-2" />
                      Document Verification
                    </h3>
                    <div className="mt-2 border rounded divide-y">
                      {selectedInstitution.documents.map(doc => (
                        <div key={doc.name} className="flex items-center justify-between p-2">
                          <span>{doc.name}</span>
                          <div className="flex items-center">
                            {getStatusIcon(doc.status)}
                            <span className="ml-1">{getStatusText(doc.status)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium flex items-center">
                      <Building size={16} className="mr-2" />
                      Business Legitimacy
                    </h3>
                    <div className="mt-2 p-2 border rounded flex items-center justify-between">
                      <span>Business Registry Verification</span>
                      <div className="flex items-center">
                        {getStatusIcon(selectedInstitution.businessLegitimacy)}
                        <span className="ml-1">{getStatusText(selectedInstitution.businessLegitimacy)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium flex items-center">
                      <Shield size={16} className="mr-2" />
                      Compliance Check
                    </h3>
                    <div className="mt-2 p-2 border rounded flex items-center justify-between">
                      <span>Regulatory Compliance</span>
                      <div className="flex items-center">
                        {getStatusIcon(selectedInstitution.complianceCheck)}
                        <span className="ml-1">{getStatusText(selectedInstitution.complianceCheck)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium flex items-center">
                      <Phone size={16} className="mr-2" />
                      Contact Verification
                    </h3>
                    <div className="mt-2 p-2 border rounded flex items-center justify-between">
                      <span>Primary Contact Verification</span>
                      <div className="flex items-center">
                        {getStatusIcon(selectedInstitution.contactVerification)}
                        <span className="ml-1">{getStatusText(selectedInstitution.contactVerification)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Approval Workflow Tab */}
              {activeTab === 'approval' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Approval Stages</h3>
                    <div className="mt-2">
                      {selectedInstitution.requiredApprovers.map((approver, index) => (
                        <div key={approver.name} className="flex items-center mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                            approver.approved 
                              ? 'bg-green-100 text-green-500' 
                              : index === selectedInstitution.approvalStage 
                                ? 'bg-blue-100 text-blue-500 border-2 border-blue-500' 
                                : 'bg-gray-100 text-gray-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{approver.name}</span>
                              {approver.approved && (
                                <CheckCircle className="text-green-500" size={16} />
                              )}
                            </div>
                            {approver.approved && (
                              <div className="text-xs text-gray-500">
                                Approved by {approver.approver} on {formatDate(approver.timestamp)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium">SLA Timer</h3>
                    <div className="mt-2 p-2 border rounded">
                      {getSLAStatus(selectedInstitution.slaDeadline)}
                      <div className="text-sm text-gray-500 mt-1">
                        Deadline: {formatDate(selectedInstitution.slaDeadline)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionApproval;