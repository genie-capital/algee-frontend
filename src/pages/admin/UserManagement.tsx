import React, { useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon, CheckCircleIcon, XCircleIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import Button from '../../components/common/Button';
import AdminNavbar from '../../components/admin/AdminNavbar';
import BackToDashboard from '../../components/admin/BackToDashboard';

interface Institution {
  id: string;
  name: string;
  email: string;
  institution: string;
  role: string;
  status: string;
  registrationNumber: string;
  institutionType: string;
  authorizationNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  phoneNumber: string;
  website: string;
  registrationDate: string;
  adminInfo: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    directPhone: string;
  };
}

const mockInstitutions: Institution[] = [
  {
    id: '1',
    name: 'First National Bank',
    email: 'contact@fnb.com',
    institution: 'First National Bank',
    role: 'Institution Admin',
    status: 'active',
    registrationNumber: 'FNB-2024-001',
    institutionType: 'bank',
    authorizationNumber: 'AUTH-2024-001',
    address: {
      street: '123 Financial District',
      city: 'New York',
      state: 'New York',
      country: 'United States'
    },
    phoneNumber: '+1 234 567 8900',
    website: 'www.fnb.com',
    registrationDate: '2024-01-15',
    adminInfo: {
      firstName: 'John',
      lastName: 'Smith',
      jobTitle: 'Chief Financial Officer',
      email: 'john.smith@fnb.com',
      directPhone: '+1 234 567 8901'
    }
  },
  {
    id: '2',
    name: 'Community Credit Union',
    email: 'info@ccu.org',
    institution: 'Community Credit Union',
    role: 'Institution Admin',
    status: 'inactive',
    registrationNumber: 'CCU-2024-002',
    institutionType: 'credit_union',
    authorizationNumber: 'AUTH-2024-002',
    address: {
      street: '456 Main Street',
      city: 'Chicago',
      state: 'Illinois',
      country: 'United States'
    },
    phoneNumber: '+1 234 567 8902',
    website: 'www.ccu.org',
    registrationDate: '2024-02-01',
    adminInfo: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      jobTitle: 'Operations Director',
      email: 'sarah.johnson@ccu.org',
      directPhone: '+1 234 567 8903'
    }
  },
  {
    id: '3',
    name: 'MicroFinance Solutions',
    email: 'contact@mfs.com',
    institution: 'MicroFinance Solutions',
    role: 'Institution Admin',
    status: 'active',
    registrationNumber: 'MFS-2024-003',
    institutionType: 'microfinance',
    authorizationNumber: 'AUTH-2024-003',
    address: {
      street: '789 Business Park',
      city: 'Buea',
      state: 'South-West',
      country: 'Cameroon'
    },
    phoneNumber: '+1 234 567 8904',
    website: 'www.mfs.com',
    registrationDate: '2024-03-01',
    adminInfo: {
      firstName: 'Michael',
      lastName: 'Chen',
      jobTitle: 'Managing Director',
      email: 'michael.chen@mfs.com',
      directPhone: '+1 234 567 8905'
    }
  }
];

const UserManagement = () => {
  const [institutions, setInstitutions] = useState<Institution[]>(mockInstitutions);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      setInstitutions(prevInstitutions => 
        prevInstitutions.map(institution => 
          institution.id === id 
            ? { ...institution, status: newStatus }
            : institution
        )
      );
    } catch (err: any) {
      setError('Failed to update institution status');
    }
  };

  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch = institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || institution.status === selectedStatus;
    const matchesType = selectedType === 'all' || institution.institutionType === selectedType;
    const matchesLocation = selectedLocation === 'all' || 
                           institution.address.country === selectedLocation ||
                           institution.address.state === selectedLocation;
    
    // Date range filtering
    let matchesDate = true;
    if (selectedDateRange !== 'all') {
      const registrationDate = new Date(institution.registrationDate);
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 60));
      
      switch (selectedDateRange) {
        case 'last30':
          matchesDate = registrationDate >= thirtyDaysAgo;
          break;
        case 'last90':
          matchesDate = registrationDate >= ninetyDaysAgo;
          break;
        case 'older':
          matchesDate = registrationDate < ninetyDaysAgo;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesType && matchesLocation && matchesDate;
  });

  const toggleRowExpansion = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <AdminNavbar />
      <BackToDashboard />
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            User Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage system users and permissions
          </p>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-900">Institutions</h3>
            <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
              <input 
                type="text" 
                className="focus:ring-[#008401] focus:border-[#008401] block w-full sm:text-sm border-gray-300 rounded-md" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select 
                aria-label="Filter by status"
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#008401] focus:border-[#008401] sm:text-sm rounded-md"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select 
                aria-label="Filter by institution type"
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#008401] focus:border-[#008401] sm:text-sm rounded-md"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="bank">Bank</option>
                <option value="credit_union">Credit Union</option>
                <option value="microfinance">Microfinance</option>
                <option value="other">Other</option>
              </select>
              <select 
                aria-label="Filter by location"
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#008401] focus:border-[#008401] sm:text-sm rounded-md"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="all">All Locations</option>
                {Array.from(new Set(institutions.map(inst => inst.address.country))).map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <select 
                aria-label="Filter by registration date"
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#008401] focus:border-[#008401] sm:text-sm rounded-md"
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="last30">Last 30 Days</option>
                <option value="last90">Last 90 Days</option>
                <option value="older">Older</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institution
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
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
              {error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-red-500">
                    {error}
                  </td>
                </tr>
              ) : (
                filteredInstitutions.map(institution => (
                  <React.Fragment key={institution.id}>
                    <tr 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleRowExpansion(institution.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#07002F] text-white flex items-center justify-center">
                            {institution.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {institution.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {institution.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {institution.institution}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {institution.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {institution.status === 'active' ? (
                            <>
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1.5" />
                              <span className="text-sm text-gray-900">Active</span>
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="h-5 w-5 text-red-500 mr-1.5" />
                              <span className="text-sm text-gray-900">Inactive</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(institution.id, institution.status);
                            }}
                          >
                            {institution.status === 'active' ? (
                              <>
                                <XCircleIcon className="h-4 w-4 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <EditIcon className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expandedRow === institution.id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded-lg shadow">
                              <h4 className="text-lg font-semibold mb-4 text-gray-900">Institution Details</h4>
                              <div className="space-y-2">
                                <p><span className="font-medium">Registration Number:</span> {institution.registrationNumber}</p>
                                <p><span className="font-medium">Institution Type:</span> {institution.institutionType}</p>
                                <p><span className="font-medium">Authorization Number:</span> {institution.authorizationNumber}</p>
                                <p><span className="font-medium">Phone:</span> {institution.phoneNumber}</p>
                                <p><span className="font-medium">Website:</span> {institution.website}</p>
                                <p><span className="font-medium">Address:</span> {institution.address.street}, {institution.address.city}, {institution.address.state}, {institution.address.country}</p>
                                <p><span className="font-medium">Registration Date:</span> {institution.registrationDate}</p>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                              <h4 className="text-lg font-semibold mb-4 text-gray-900">Admin Details</h4>
                              <div className="space-y-2">
                                <p><span className="font-medium">Name:</span> {institution.adminInfo.firstName} {institution.adminInfo.lastName}</p>
                                <p><span className="font-medium">Job Title:</span> {institution.adminInfo.jobTitle}</p>
                                <p><span className="font-medium">Email:</span> {institution.adminInfo.email}</p>
                                <p><span className="font-medium">Phone:</span> {institution.adminInfo.directPhone}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{filteredInstitutions.length}</span> of{' '}
                <span className="font-medium">{institutions.length}</span> users
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;