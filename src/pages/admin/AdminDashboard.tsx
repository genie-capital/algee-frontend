import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Server, 
  Database, 
  Users, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  Activity,
  ArrowUp,
  ArrowDown,
  FileText,
  Settings,
  List,
  Shield
} from 'lucide-react';
import Button from '../../components/common/Button';

// Mock data for the dashboard
const mockSystemHealth = {
  status: 'Operational',
  serverLoad: 42,
  databasePerformance: 78,
  activeUsers: 124,
  activeUsersTrend: 'up',
  uptime: '99.98%',
  uptimeDays: 124
};

const mockPendingApprovals = {
  institutions: 5,
  variables: 3,
  alerts: 2
};

const mockUsageMetrics = {
  totalInstitutions: 48,
  activeInstitutions: 42,
  dailyAssessments: 156,
  weeklyAssessments: 1245,
  monthlyAssessments: 4872,
  apiRequests: 2456
};

const mockRecentActivities = [
  { id: 1, type: 'parameter_change', user: 'John Smith', action: 'Updated Income Multiplier from 3.0 to 3.5', timestamp: '2023-10-15 14:30:25' },
  { id: 2, type: 'institution_approval', user: 'Sarah Johnson', action: 'Approved First National Bank registration', timestamp: '2023-10-15 11:22:18' },
  { id: 3, type: 'system_update', user: 'System', action: 'Scheduled maintenance completed', timestamp: '2023-10-14 23:15:42' },
  { id: 4, type: 'parameter_change', user: 'Michael Brown', action: 'Updated Maximum Interest Rate from 18.0% to 15.0%', timestamp: '2023-10-14 16:45:33' }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is authenticated
    const adminAuth = sessionStorage.getItem('adminAuthenticated');
    if (adminAuth !== 'true') {
      navigate('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null; // Don't render anything until authentication check completes
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            System Administration Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Monitor system health, approve requests, and manage system settings
          </p>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-200 bg-[#07002F] text-white">
          <h3 className="text-lg font-medium">System Health Overview</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <Server className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">System Status</dt>
                      <dd>
                        <div className="flex items-center">
                          <div className={`h-2.5 w-2.5 rounded-full mr-2 ${mockSystemHealth.status === 'Operational' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-lg font-semibold text-gray-900">{mockSystemHealth.status}</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Server Load</dt>
                      <dd>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div className={`h-2.5 rounded-full ${mockSystemHealth.serverLoad < 50 ? 'bg-green-500' : mockSystemHealth.serverLoad < 80 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${mockSystemHealth.serverLoad}%` }}></div>
                          </div>
                          <span className="text-lg font-semibold text-gray-900">{mockSystemHealth.serverLoad}%</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <Database className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Database Performance</dt>
                      <dd>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div className={`h-2.5 rounded-full ${mockSystemHealth.databasePerformance < 50 ? 'bg-red-500' : mockSystemHealth.databasePerformance < 80 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${mockSystemHealth.databasePerformance}%` }}></div>
                          </div>
                          <span className="text-lg font-semibold text-gray-900">{mockSystemHealth.databasePerformance}%</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                      <dd>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold text-gray-900">{mockSystemHealth.activeUsers}</span>
                          {mockSystemHealth.activeUsersTrend === 'up' ? (
                            <ArrowUp className="ml-2 h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDown className="ml-2 h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">System Uptime</dt>
                      <dd>
                        <div className="flex flex-col">
                          <span className="text-lg font-semibold text-gray-900">{mockSystemHealth.uptime}</span>
                          <span className="text-sm text-gray-500">{mockSystemHealth.uptimeDays} days</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Pending Approvals Panel */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-[#07002F] text-white">
            <h3 className="text-lg font-medium">Pending Approvals</h3>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              <li className="py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-md p-2 mr-4">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Institution Registrations</p>
                    <p className="text-sm text-gray-500">Pending approval</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {mockPendingApprovals.institutions}
                  </span>
                  <Button className="ml-4" size="sm">
                    Review
                  </Button>
                </div>
              </li>
              <li className="py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-md p-2 mr-4">
                    <List className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Variable Changes</p>
                    <p className="text-sm text-gray-500">Waiting for approval</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {mockPendingApprovals.variables}
                  </span>
                  <Button className="ml-4" size="sm">
                    Review
                  </Button>
                </div>
              </li>
              <li className="py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-red-100 rounded-md p-2 mr-4">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">System Alerts</p>
                    <p className="text-sm text-gray-500">Requiring attention</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {mockPendingApprovals.alerts}
                  </span>
                  <Button className="ml-4" size="sm" variant="danger">
                    Resolve
                  </Button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* System Usage Metrics */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-[#07002F] text-white">
            <h3 className="text-lg font-medium">System Usage Metrics</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-1">
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">Total Institutions</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{mockUsageMetrics.totalInstitutions}</dd>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">Active Institutions (30d)</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{mockUsageMetrics.activeInstitutions}</dd>
                </div>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Assessments Processed</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                      <dt className="text-xs font-medium text-gray-500">Daily</dt>
                      <dd className="mt-1 text-xl font-semibold text-gray-900">{mockUsageMetrics.dailyAssessments}</dd>
                    </div>
                    <div className="flex flex-col items-center">
                      <dt className="text-xs font-medium text-gray-500">Weekly</dt>
                      <dd className="mt-1 text-xl font-semibold text-gray-900">{mockUsageMetrics.weeklyAssessments}</dd>
                    </div>
                    <div className="flex flex-col items-center">
                      <dt className="text-xs font-medium text-gray-500">Monthly</dt>
                      <dd className="mt-1 text-xl font-semibold text-gray-900">{mockUsageMetrics.monthlyAssessments}</dd>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">API Request Volume (24h)</dt>
                  <dd className="mt-1">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div className="bg-[#008401] h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{mockUsageMetrics.apiRequests}</span>
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 mt-8">
        {/* Administrative Quick Links */}
        <div className="bg-white shadow rounded-lg overflow-hidden lg:col-span-1">
          <div className="px-6 py-5 border-b border-gray-200 bg-[#07002F] text-white">
            <h3 className="text-lg font-medium">Quick Links</h3>
          </div>
          <div className="p-4">
            <nav className="space-y-1">
              <a href="/admin/institution-approval" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-[#008401]/10">
                <Users className="mr-3 h-5 w-5 text-gray-400 group-hover:text-[#008401]" />
                Institution Management
              </a>
              <a href="/admin/variables" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-[#008401]/10">
                <List className="mr-3 h-5 w-5 text-gray-400 group-hover:text-[#008401]" />
                Variable Configuration
              </a>
              <a href="/admin/settings" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-[#008401]/10">
                <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-[#008401]" />
                System Settings
              </a>
              <a href="/admin/audit" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-[#008401]/10">
                <FileText className="mr-3 h-5 w-5 text-gray-400 group-hover:text-[#008401]" />
                Audit Logs
              </a>
              <a href="/admin/support" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-[#008401]/10">
                <Shield className="mr-3 h-5 w-5 text-gray-400 group-hover:text-[#008401]" />
                Support Tickets
              </a>
              <a href="/admin/maintenance" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-[#008401]/10">
                <Server className="mr-3 h-5 w-5 text-gray-400 group-hover:text-[#008401]" />
                Maintenance Tools
              </a>
            </nav>
          </div>
        </div>

        {/* Recent System Activities */}
        <div className="bg-white shadow rounded-lg overflow-hidden lg:col-span-3">
          <div className="px-6 py-5 border-b border-gray-200 bg-[#07002F] text-white">
            <h3 className="text-lg font-medium">Recent System Activities</h3>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              {mockRecentActivities.map((activity) => (
                <li key={activity.id} className="py-4">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      activity.type === 'parameter_change' 
                        ? 'bg-blue-100 text-blue-600' 
                        : activity.type === 'institution_approval' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'parameter_change' && <Settings className="h-4 w-4" />}
                      {activity.type === 'institution_approval' && <CheckCircle className="h-4 w-4" />}
                      {activity.type === 'system_update' && <Server className="h-4 w-4" />}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                      </div>
                      <p className="text-sm text-gray-500">{activity.action}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-center">
              <Button variant="outline" size="sm">
                View All Activities
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;