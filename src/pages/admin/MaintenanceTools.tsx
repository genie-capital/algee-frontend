// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Server, 
//   Database, 
//   RefreshCw, 
//   AlertTriangle, 
//   Clock, 
//   CheckCircle,
//   Download,
//   Upload,
//   Trash2,
//   HardDrive,
//   BarChart,
//   Lock
// } from 'lucide-react';
// import Button from '../../components/common/Button';

// // Mock data for system maintenance
// const mockSystemStatus = {
//   lastBackup: '2023-10-15 02:00:00',
//   databaseSize: '4.2 GB',
//   cacheSize: '156 MB',
//   logSize: '890 MB',
//   serverUptime: '124 days, 7 hours',
//   pendingUpdates: 2,
//   scheduledMaintenance: '2023-10-22 01:00:00',
//   maintenanceWindow: '60 minutes'
// };

// const mockPerformanceMetrics = {
//   cpuUsage: 32,
//   memoryUsage: 68,
//   diskUsage: 45,
//   networkBandwidth: 22,
//   activeConnections: 78,
//   averageResponseTime: 120 // ms
// };

// const MaintenanceTools = () => {
//   const navigate = useNavigate();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [activeTab, setActiveTab] = useState('status');
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [confirmAction, setConfirmAction] = useState(null);

//   useEffect(() => {
//     // Check if admin is authenticated
//     const adminAuth = sessionStorage.getItem('adminAuthenticated');
//     if (adminAuth !== 'true') {
//       navigate('/admin/login');
//     } else {
//       setIsAuthenticated(true);
//     }
//   }, [navigate]);

//   const handleMaintenanceAction = (action: string) => {
//     setConfirmAction(action);
//     setIsConfirmModalOpen(true);
//   };

//   const confirmMaintenanceAction = () => {
//     // In a real application, this would trigger the actual maintenance action
//     console.log(`Executing maintenance action: ${confirmAction}`);
//     setIsConfirmModalOpen(false);
    
//     // Mock success message - in a real app, you'd show feedback based on the action result
//     alert(`${confirmAction} completed successfully!`);
//   };

//   if (!isAuthenticated) {
//     return null; // Don't render anything until authentication check completes
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="md:flex md:items-center md:justify-between mb-8">
//         <div className="flex-1 min-w-0">
//           <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
//             System Maintenance Tools
//           </h2>
//           <p className="mt-1 text-sm text-gray-500">
//             Manage system maintenance, backups, and performance optimization
//           </p>
//         </div>
//       </div>

//       {/* Tab Navigation */}
//       <div className="border-b border-gray-200 mb-6">
//         <nav className="-mb-px flex space-x-8">
//           <button
//             onClick={() => setActiveTab('status')}
//             className={`${
//               activeTab === 'status'
//                 ? 'border-[#008401] text-[#008401]'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
//           >
//             System Status
//           </button>
//           <button
//             onClick={() => setActiveTab('backups')}
//             className={`${
//               activeTab === 'backups'
//                 ? 'border-[#008401] text-[#008401]'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
//           >
//             Backup & Restore
//           </button>
//           <button
//             onClick={() => setActiveTab('performance')}
//             className={`${
//               activeTab === 'performance'
//                 ? 'border-[#008401] text-[#008401]'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
//           >
//             Performance
//           </button>
//           <button
//             onClick={() => setActiveTab('logs')}
//             className={`${
//               activeTab === 'logs'
//                 ? 'border-[#008401] text-[#008401]'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
//           >
//             System Logs
//           </button>
//         </nav>
//       </div>

//       {/* System Status Tab */}
//       {activeTab === 'status' && (
//         <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
//           <div className="px-6 py-5 border-b border-gray-200 bg-[#07002F] text-white">
//             <h3 className="text-lg font-medium">System Status Overview</h3>
//           </div>
//           <div className="p-6">
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
//                       <Server className="h-6 w-6 text-blue-600" />
//                     </div>
//                     <div className="ml-5 w-0 flex-1">
//                       <dl>
//                         <dt className="text-sm font-medium text-gray-500 truncate">Server Uptime</dt>
//                         <dd className="text-lg font-semibold text-gray-900">{mockSystemStatus.serverUptime}</dd>
//                       </dl>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
//                       <Database className="h-6 w-6 text-green-600" />
//                     </div>
//                     <div className="ml-5 w-0 flex-1">
//                       <dl>
//                         <dt className="text-sm font-medium text-gray-500 truncate">Database Size</dt>
//                         <dd className="text-lg font-semibold text-gray-900">{mockSystemStatus.databaseSize}</dd>
//                       </dl>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
//                       <Clock className="h-6 w-6 text-yellow-600" />
//                     </div>
//                     <div className="ml-5 w-0 flex-1">
//                       <dl>
//                         <dt className="text-sm font-medium text-gray-500 truncate">Last Backup</dt>
//                         <dd className="text-lg font-semibold text-gray-900">{mockSystemStatus.lastBackup}</dd>
//                       </dl>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
//                       <RefreshCw className="h-6 w-6 text-purple-600" />
//                     </div>
//                     <div className="ml-5 w-0 flex-1">
//                       <dl>
//                         <dt className="text-sm font-medium text-gray-500 truncate">Pending Updates</dt>
//                         <dd className="flex items-center">
//                           <span className="text-lg font-semibold text-gray-900 mr-2">{mockSystemStatus.pendingUpdates}</span>
//                           {mockSystemStatus.pendingUpdates > 0 && (
//                             <Button size="sm">Install Updates</Button>
//                           )}
//                         </dd>
//                       </dl>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
//                       <AlertTriangle className="h-6 w-6 text-red-600" />
//                     </div>
//                     <div className="ml-5 w-0 flex-1">
//                       <dl>
//                         <dt className="text-sm font-medium text-gray-500 truncate">Scheduled Maintenance</dt>
//                         <dd className="flex flex-col">
//                           <span className="text-lg font-semibold text-gray-900">{mockSystemStatus.scheduledMaintenance}</span>
//                           <span className="text-sm text-gray-500">Window: {mockSystemStatus.maintenanceWindow}</span>
//                         </dd>
//                       </dl>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 flex justify-end space-x-3">
//               <Button 
//                 variant="outline" 
//                 onClick={() => handleMaintenanceAction('System Restart')}
//                 className="flex items-center"
//               >
//                 <RefreshCw className="mr-2 h-4 w-4" />
//                 Restart System
//               </Button>
//               <Button 
//                 onClick={() => handleMaintenanceAction('Cache Clear')}
//                 className="flex items-center"
//               >
//                 <Trash2 className="mr-2 h-4 w-4" />
//                 Clear Cache
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Backup & Restore Tab */}
//       {activeTab === 'backups' && (
//         <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
//           <div className="px-6 py-5 border-b border-gray-200 bg-[#07002F] text-white">
//             <h3 className="text-lg font-medium">Backup & Restore</h3>
//           </div>
//           <div className="p-6">
//             <div className="mb-6">
//               <h4 className="text-lg font-medium text-gray-900 mb-2">Backup Options</h4>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="flex flex-col space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <Database className="h-5 w-5 text-gray-400 mr-2" />
//                       <span className="text-sm font-medium text-gray-700">Full System Backup</span>
//                     </div>
//                     <Button 
//                       onClick={() => handleMaintenanceAction('Full System Backup')}
//                       className="flex items-center"
//                       size="sm"
//                     >
//                       <Download className="mr-2 h-4 w-4" />
//                       Backup Now
//                     </Button>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <Database className="h-5 w-5 text-gray-400 mr-2" />
//                       <span className="text-sm font-medium text-gray-700">Database Only Backup</span>
//                     </div>
//                     <Button 
//                       onClick={() => handleMaintenanceAction('Database Backup')}
//                       className="flex items-center"
//                       size="sm"
//                     >
//                       <Download className="mr-2 h-4 w-4" />
//                       Backup Now
//                     </Button>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <HardDrive className="h-5 w-5 text-gray-400 mr-2" />
//                       <span className="text-sm font-medium text-gray-700">Configuration Backup</span>
//                     </div>
//                     <Button 
//                       onClick={() => handleMaintenanceAction('Configuration Backup')}
//                       className="flex items-center"
//                       size="sm"
//                     >
//                       <Download className="mr-2 h-4 w-4" />
//                       Backup Now
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-6">
//               <h4 className="text-lg font-medium text-gray-900 mb-2">Restore System</h4>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="flex flex-col space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <Upload className="h-5 w-5 text-gray-400 mr-2" />
//                       <span className="text-sm font-medium text-gray-700">Restore from Backup</span>
//                     </div>
//                     <div>
//                       <input
//                         type="file"
//                         id="backup-file"
//                         className="hidden"
//                         accept=".zip,.sql,.json"
//                       />
//                       <label htmlFor="backup-file">
//                         <Button 
//                           component
//                           className="flex items-center cursor-pointer"
//                           size="sm"
//                         >
//                           <Upload className="mr-2 h-4 w-4" />
//                           Select File
//                         </Button>
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-6">
//               <h4 className="text-lg font-medium text-gray-900 mb-2">Backup Schedule</h4>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
//                     <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#008401] focus:border-[#008401] sm:text-sm rounded-md">
//                       <option>Daily</option>
//                       <option>Weekly</option>
//                       <option>Monthly</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Retention Period (days)</label>
//                     <input 
//                       type="number" 
//                       min="1" 
//                       defaultValue="30"
//                       className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#008401] focus:border-[#008401] sm:text-sm rounded-md"
//                     />
//                   </div>
//                 </div>
//                 <div className="mt-4">
//                   <Button className="flex items-center">
//                     <CheckCircle className="mr-2 h-4 w-4" />
//                     Save Schedule
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Performance Tab */}
//       {activeTab === 'performance' && (
//         <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
//           <div className="px-6 py-5 border-b border-gray-200 bg-[#07002F] text-white">
//             <h3 className="text-lg font-medium">Performance Monitoring</h3>
//           </div>
//           <div className="p-6">
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
//                       <BarChart className="h-6 w-6 text-blue-600" />
//                     </div>
//                     <div className="ml-5 w-0 flex-1">
//                       <dl>
//                         <dt className="text-sm font-medium text-gray-500 truncate">CPU Usage</dt>
//                         <dd>
//                           <div className="flex items-center">
//                             <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
//                               <div className={`h-2.5 rounded-full ${mockPerformanceMetrics.cpuUsage < 50 ? 'bg-green-500' : mockPerformanceMetrics.cpuUsage < 80 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${mockPerformanceMetrics.cpuUsage}%` }}></div>
//                             </div>
//                             <span className="text-lg font-semibold text-gray-900">{mockPerformanceMetrics.cpuUsage}%</span>
//                           </div>
//                         </dd>
//                       </dl>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
//                       <Database className="h-6 w-6 text-green-600" />
//                     </div>
//                     <div className="ml-5 w-0 flex-1">
//                       <dl>
//                         <dt className="text-sm font-medium text-gray-500 truncate">Memory Usage</dt>
//                         <dd>
//                           <div className="flex items-center">
//                             <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
//                               <div className={`h-2.5 rounded-full ${mockPerformanceMetrics.memoryUsage < 50 ? 'bg-green-500' : mockPerformanceMetrics.memoryUsage < 80 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${mockPerformanceMetrics.memoryUsage}%` }}></div>
//                             </div>
//                             <span className="text-lg font-semibold text-gray-900">{mockPerformanceMetrics.memoryUsage}%</span>
//                           </div>
//                         </dd>
//                       </dl>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
//                       <HardDrive className="h-6 w-6 text-yellow-600" />
//                     </div>
//                     <div className="ml-5 w-0 flex-1">
//                       <dl>
//                         <dt className="text-sm font-medium text-gray-500 truncate">Disk Usage</dt>
//                         <dd>
//                           <div className="flex items-center">
//                             <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
//                               <div className={`h-2.5 rounded-full ${mockPerformanceMetrics.diskUsage < 50 ? 'bg-green-500' : mockPerformanceMetrics.diskUsage < 80 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${mockPerformanceMetrics.diskUsage}%` }}></div>
//                             </div>
//                             <span className="text-lg font-semibold text-gray-900">{mockPerformanceMetrics.diskUsage}%</span>
//                           </div>
//                         </dd>
//                       </dl>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
//                       <RefreshCw className="h-6 w-6 text-purple-600" />
//                     </div>
//                     <div className="ml-5 w-0 flex-1">
//                       <dl>
//                         <dt className="text-sm font-medium text-gray-500 truncate">Network Bandwidth</dt>
//                         <dd>
//                           <div className="flex items-center">
//                             <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
//                               <div className={`h-2.5 rounded-full bg-purple-500`} style={{ width: `${mockPerformanceMetrics.networkBandwidth}%` }}></div>
//                             </div>
//                             <span className="text-lg font-semibold text-gray-900">{mockPerformanceMetrics.networkBandwidth}%</span>
//                           </div>
//                         </dd>
//                       </dl>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
//                       <Users className="h-6 w-6 text-indigo-600" />
//                     </div>
//                     <div className="ml-5 w-0 flex-1">
//                       <dl>
//                         <dt className="text-sm font-medium text-gray-500 truncate">Active Connections</dt>
//                         <dd className="text-lg font-semibold text-gray-900">{mockPerformanceMetrics.activeConnections}</dd>
//                       </dl>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
//                 <div className="px-4 py-5 sm:p-6">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
//                       <Clock className="h-6 w-6 text-red-600" />
//                     </div>
//                     <div className="ml-5 w-0 flex-1">
//                       <dl>
//                         <dt className="text-sm font-medium text-gray-500 truncate">Avg Response Time</dt>
//                         <dd className="text-lg font-semibold text-gray-900">{mockPerformanceMetrics.averageResponseTime} ms</dd>
//                       </dl>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6">
//               <h4 className="text-lg font-medium text-gray-900 mb-4">Performance Optimization</h4>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="flex flex-col space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <Database className="h-5 w-5 text-gray-400 mr-2" />
//                       <span className="text-sm font-medium text-gray-700">Database Optimization</span>
//                     </div>
//                     <Button 
//                       onClick={() => handleMaintenanceAction('Database Optimization')}
//                       className="flex items-center"
//                       size="sm"
//                     >
//                       <RefreshCw className="mr-2 h-4 w-4" />
//                       Optimize Now
//                     </Button>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <Trash2 className="h-5 w-5 text-gray-400 mr-2" />
//                       <span className="text-sm font-medium text-gray-700">Clear Temporary Files</span>
//                     </div>
//                     <Button 
//                       onClick={() => handleMaintenanceAction('Clear Temp Files')}
//                       className="flex items-center"
//                       size="sm"
//                     >
//                       <Trash2 className="mr-2 h-4 w-4" />
//                       Clear Now
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* System Logs Tab */}
//       {activeTab === 'logs' && (
//         <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
//           <div className="px-6 py-5 border-b border-gray-200 bg-[#07002F] text-white">
//             <h3 className="text-lg font-medium">System Logs</h3>
//           </div>
//           <div className="p-6">
//             <div className="mb-6">
//               <div className="flex justify-between items-center mb-4">
//                 <div className="flex space-x-2">
//                   <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#008401] focus:border-[#008401] sm:text-sm rounded-md">
//                     <option>All Log Types</option>
//                     <option>Error Logs</option>
//                     <option>Access Logs</option>
//                     <option>Security Logs</option>
//                     <option>System Logs</option>
//                   </select>
//                   <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#008401] focus:border-[#008401] sm:text-sm rounded-md">
//                     <option>Last 24 Hours</option>
//                     <option>Last 7 Days</option>
//                     <option>Last 30 Days</option>
//                     <option>Custom Range</option>
//                   </select>
//                 </div>
//                 <div>
//                   <Button 
//                     variant="outline"
//                     className="flex items-center"
//                     size="sm"
//                   >
//                     <Download className="mr-2 h-4 w-4" />
//                     Export Logs
//                   </Button>
//                 </div>
//               </div>

//               <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {/* Mock log entries */}
//                     <tr>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-10-15 14:32:45</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">ERROR</span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">API Server</td>
//                       <td className="px-6 py-4 text-sm text-gray-500">Failed to connect to database: Connection timeout</td>
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-10-15 14:30:12</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">WARN</span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Auth Service</td>
//                       <td className="px-6 py-4 text-sm text-gray-500">Multiple failed login attempts for user admin@example.com</td>
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-10-15 14:28:33</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">INFO</span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">System</td>
//                       <td className="px-6 py-4 text-sm text-gray-500">Scheduled backup completed successfully</td>
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-10-15 14:25:18</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">DEBUG</span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Assessment Engine</td>
//                       <td className="px-6 py-4 text-sm text-gray-500">Processing batch job #12458: 245 records</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirmation Modal */}
//       {isConfirmModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Action</h3>
//             <p className="text-sm text-gray-500 mb-4">
//               Are you sure you want to perform the "{confirmAction}" action? This operation cannot be undone.
//             </p>
//             <div className="flex justify-end space-x-3">
//               <Button 
//                 variant="outline" 
//                 onClick={() => setIsConfirmModalOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={confirmMaintenanceAction}
//               >
//                 Confirm
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MaintenanceTools;