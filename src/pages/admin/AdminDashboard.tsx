import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, FileText, Settings, Cog, Users2, Clock, Wrench, } from 'lucide-react';
import AdminNavbar from '../../components/admin/AdminNavbar';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      name: 'Total Users',
      value: '2,543',
      change: '+12.3%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Institutions',
      value: '45',
      change: '+2.1%',
      changeType: 'increase',
      icon: Building2,
      color: 'bg-green-500'
    },
    {
      name: 'Pending Approvals',
      value: '12',
      change: '-3.2%',
      changeType: 'decrease',
      icon: FileText,
      color: 'bg-yellow-500'
    },
    {
      name: 'System Parameters',
      value: '24',
      change: '0%',
      changeType: 'neutral',
      icon: Settings,
      color: 'bg-purple-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'institution',
      action: 'New institution registered',
      name: 'ABC Bank',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'user',
      action: 'New user registered',
      name: 'John Doe',
      time: '3 hours ago'
    },
    {
      id: 3,
      type: 'parameter',
      action: 'Parameter updated',
      name: 'Interest Rate',
      time: '5 hours ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          
          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className={`h-6 w-6 ${stat.color} text-white rounded-md p-1`} />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stat.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span
                      className={`font-medium ${
                        stat.changeType === 'increase'
                          ? 'text-green-600'
                          : stat.changeType === 'decrease'
                          ? 'text-red-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-gray-500"> from last month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Management Cards */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Institution management */}
            <div
              onClick={() => navigate('/admin/institution')}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building2 className="h-6 w-6 text-[#008401]" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Institution Management
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        Manage institutions verification status
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            {/* Variable Management */}
            <div
              onClick={() => navigate('/admin/variables')}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Settings className="h-6 w-6 text-[#008401]" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Variable Management
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        Configure system-wide variables
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            {/* Institution Parameter Management */}
            <div
              onClick={() => navigate('/admin/parameters')}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Wrench className="h-6 w-6 text-[#008401]" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Institution Parameter Management
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        Create, Manage and Update Institution Paramneters
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* User Management */}
            <div
              onClick={() => navigate('/admin/users')}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users2 className="h-6 w-6 text-[#008401]" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        User Management
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        Manage User Institutions
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Management */}
            <div
              onClick={() => navigate('/admin/categories')}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Cog className="h-6 w-6 text-[#008401]" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Category Management
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        Manage categories for Variables
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            {/* Admin Management */}
            <div
              onClick={() => navigate('/admin/manage')}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Cog className="h-6 w-6 text-[#008401]" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        System Admin Management
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        Manage System Administrators
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Parameter Management */}
            <div
              onClick={() => navigate('/admin/formula')}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Settings className="h-6 w-6 text-[#008401]" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Parameter Management
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        Manage all parameters, categories, and variables
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Activity
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {activity.type === 'institution' ? (
                              <Building2 className="h-5 w-5 text-gray-400" />
                            ) : activity.type === 'user' ? (
                              <Users className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Settings className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.action}
                            </p>
                            <p className="text-sm text-gray-500">{activity.name}</p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;