// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   MessageSquare, 
//   User, 
//   Calendar, 
//   CheckCircle, 
//   XCircle,
//   Clock,
//   AlertTriangle,
//   Search,
//   Filter,
//   ChevronDown,
//   ChevronUp
// } from 'lucide-react';
// import Button from '../../components/common/Button';

// // Mock data for support tickets
// const mockTickets = [
//   {
//     id: 'TKT-1001',
//     subject: 'Cannot access loan application form',
//     status: 'open',
//     priority: 'high',
//     category: 'Technical Issue',
//     createdAt: '2023-10-14 09:23:45',
//     updatedAt: '2023-10-15 14:30:22',
//     institution: 'First National Bank',
//     submittedBy: 'John Smith',
//     assignedTo: 'Sarah Johnson',
//     description: 'When trying to access the loan application form, I receive an error message saying "Form not available". This is happening for all our loan officers.',
//     messages: [
//       {
//         id: 1,
//         sender: 'John Smith',
//         senderType: 'client',
//         message: 'When trying to access the loan application form, I receive an error message saying "Form not available". This is happening for all our loan officers.',
//         timestamp: '2023-10-14 09:23:45'
//       },
//       {
//         id: 2,
//         sender: 'Sarah Johnson',
//         senderType: 'support',
//         message: 'Thank you for reporting this issue. I\'m looking into it now. Could you please provide your institution ID and the specific form you\'re trying to access?',
//         timestamp: '2023-10-14 10:15:32'
//       },
//       {
//         id: 3,
//         sender: 'John Smith',
//         senderType: 'client',
//         message: 'Our institution ID is FNB-2023. We\'re trying to access the "Personal Loan Application" form.',
//         timestamp: '2023-10-14 11:42:18'
//       },
//       {
//         id: 4,
//         sender: 'Sarah Johnson',
//         senderType: 'support',
//         message: 'I\'ve identified the issue. There was a permission setting that was incorrectly configured during our last update. I\'ve fixed it now. Could you please try accessing the form again and let me know if it works?',
//         timestamp: '2023-10-15 14:30:22'
//       }
//     ]
//   },
//   {
//     id: 'TKT-1002',
//     subject: 'Need to update interest rate parameters',
//     status: 'closed',
//     priority: 'medium',
//     category: 'Parameter Change',
//     createdAt: '2023-10-12 15:48:33',
//     updatedAt: '2023-10-13 11:22:45',
//     institution: 'Community Credit Union',
//     submittedBy: 'Michael Brown',
//     assignedTo: 'David Wilson',
//     description: 'We need to update our maximum interest rate from 18% to 15% due to new regulatory requirements.',
//     messages: [
//       {
//         id: 1,
//         sender: 'Michael Brown',
//         senderType: 'client',
//         message: 'We need to update our maximum interest rate from 18% to 15% due to new regulatory requirements.',
//         timestamp: '2023-10-12 15:48:33'
//       },
//       {
//         id: 2,
//         sender: 'David Wilson',
//         senderType: 'support',
//         message: 'I can help with that. I\'ll need approval from your institution\'s authorized representative. Has this change been approved internally?',
//         timestamp: '2023-10-12 16:30:12'
//       },
//       {
//         id: 3,
//         sender: 'Michael Brown',
//         senderType: 'client',
//         message: 'Yes, I\'ve attached the approval document signed by our CEO.',
//         timestamp: '2023-10-13 09:15:27'
//       },
//       {
//         id: 4,
//         sender: 'David Wilson',
//         senderType: 'support',
//         message: 'Thank you for providing the documentation. I\'ve updated the maximum interest rate parameter to 15%. The change is now live in your system.',
//         timestamp: '2023-10-13 11:22:45'
//       }
//     ]
//   },
//   {
//     id: 'TKT-1003',
//     subject: 'API integration error',
//     status: 'in-progress',
//     priority: 'critical',
//     category: 'API Issue',
//     createdAt: '2023-10-15 08:12:56',
//     updatedAt: '2023-10-15 13:45:18',
//     institution: 'Metro Financial Services',
//     submittedBy: 'Jennifer Lee',
//     assignedTo: 'Robert Chen',
//     description: 'We\'re receiving timeout errors when trying to connect to the credit scoring API. This is blocking all new loan applications.',
//     messages: [
//       {
//         id: 1,
//         sender: 'Jennifer Lee',
//         senderType: 'client',
//         message: 'We\'re receiving timeout errors when trying to connect to the credit scoring API. This is blocking all new loan applications.',
//         timestamp: '2023-10-15 08:12:56'
//       },
//       {
//         id: 2,
//         sender: 'Robert Chen',
//         senderType: 'support',
//         message: 'I\'m sorry to hear about this issue. I\'ll investigate immediately. Could you please provide the error code you\'re receiving?',
//         timestamp: '2023-10-15 08:30:42'
//       },
//       {
//         id: 3,
//         sender: 'Jennifer Lee',
//         senderType: 'client',
//         message: 'The error code is API-504-TIMEOUT. It started occurring around 7:45 AM today.',
//         timestamp: '2023-10-15 09:05:33'
//       },
//       {
//         id: 4,
//         sender: 'Robert Chen',
//         senderType: 'support',
//         message: 'Thank you for the information. I\'ve identified an issue with our API gateway. Our engineering team is working on it now. I\'ll update you as soon as we have more information.',
//         timestamp: '2023-10-15 10:22:15'
//       },
//       {
//         id: 5,
//         sender: 'Robert Chen',
//         senderType: 'support',
//         message: 'Update: We\'ve identified the root cause as a network configuration issue. The team is implementing a fix now. Estimated resolution time is within the next hour.',
//         timestamp: '2023-10-15 13:45:18'
//       }
//     ]
//   }
// ];

// const SupportTickets = () => {
//   const navigate = useNavigate();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [tickets, setTickets] = useState(mockTickets);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [replyText, setReplyText] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sortField, setSortField] = useState('updatedAt');
//   const [sortDirection, setSortDirection] = useState('desc');

//   useEffect(() => {
//     // Check if admin is authenticated
//     const adminAuth = sessionStorage.getItem('adminAuthenticated');
//     if (adminAuth !== 'true') {
//       navigate('/admin/login');
//     } else {
//       setIsAuthenticated(true);
//     }
//   }, [navigate]);

//   const handleTicketSelect = (ticket: typeof mockTickets[0]) => {
//     setSelectedTicket(ticket);
//   };

//   const handleStatusChange = (ticketId, newStatus) => {
//     setTickets(tickets.map(ticket => 
//       ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
//     ));
    
//     if (selectedTicket && selectedTicket.id === ticketId) {
//       setSelectedTicket({ ...selectedTicket, status: newStatus });
//     }
//   };

//   const handleReplySubmit = (e) => {
//     e.preventDefault();
    
//     if (!replyText.trim()) return;
    
//     const newMessage = {
//       id: selectedTicket.messages.length + 1,
//       sender: 'Admin User', // In a real app, this would be the logged-in admin's name
//       senderType: 'support',
//       message: replyText,
//       timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
//     };
    
//     const updatedTicket = {
//       ...selectedTicket,
//       messages: [...selectedTicket.messages, newMessage],
//       updatedAt: newMessage.timestamp
//     };
    
//     setSelectedTicket(updatedTicket);
//     setTickets(tickets.map(ticket => 
//       ticket.id === selectedTicket.id ? updatedTicket : ticket
//     ));
    
//     setReplyText('');
//   };

//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const filteredTickets = tickets
//     .filter(ticket => filterStatus === 'all' || ticket.status === filterStatus)
//     .filter(ticket => 
//       searchQuery === '' || 
//       ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       ticket.institution.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     .sort((a, b) => {
//       if (sortDirection === 'asc') {
//         return a[sortField] > b[sortField] ? 1 : -1;
//       } else {
//         return a[sortField] < b[sortField] ? 1 : -1;
//       }
//     });

//   if (!isAuthenticated) {
//     return null; // Don't render anything until authentication check completes
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="md:flex md:items-center md:justify-between mb-8">
//         <div className="flex-1 min-w-0">
//           <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
//             Support Tickets
//           </h2>
//           <p className="mt-1 text-sm text-gray-500">
//             Manage and respond to support requests from institutions
//           </p>
//         </div>
//         <div className="mt-4 flex md:mt-0 md:ml-4">
//           <Button className="ml-3 flex items-center">
//             <MessageSquare className="mr-2 h-4 w-4" />
//             Create Ticket
//           </Button>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
//         {/* Ticket List */}
//         <div className="lg:w-2/5 xl:w-1/3">
//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200 bg-[#07002F] text-white">
//               <h3 className="text-lg font-medium">Ticket List</h3>
//             </div>
            
//             <div className="p-4 border-b border-gray-200 bg-gray-50">
//               <div className="flex flex-col space-y-3">
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Search className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search tickets..."
//                     className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#008401] focus:border-[#008401] sm:text-sm"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
                
//                 <div className="flex space-x-2">
//                   <select
//                     className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#008401] focus:border-[#008401] sm:text-sm rounded-md"
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                   >
//                     <option value="all">All Tickets</option>
//                     <option value="open">Open</option>
//                     <option value="in-progress">In Progress</option>
//                     <option value="closed">Closed</option>
//                   </select>
                  
//                   <div className="relative inline-block text-left">
//                     <Button 
//                       variant="outline" 
//                       size="sm"
//                       className="flex items-center"
//                     >
//                       <Filter className="mr-2 h-4 w-4" />
//                       Sort
//                       <ChevronDown className="ml-2 h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="overflow-y-auto max-h-[600px]">
//               <ul className="divide-y divide-gray-200">
//                 {filteredTickets.length > 0 ? (
//                   filteredTickets.map((ticket) => (
//                     <li 
//                       key={ticket.id}
//                       className={`hover:bg-gray-50 cursor-pointer ${selectedTicket && selectedTicket.id === ticket.id ? 'bg-gray-50' : ''}`}
//                       onClick={() => handleTicketSelect(ticket)}
//                     >
//                       <div className="px-6 py-4">
//                         <div className="flex items-center justify-between">
//                           <p className="text-sm font-medium text-[#07002F] truncate">
//                             {ticket.subject}
//                           </p>
//                           <div className={`flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
//                             ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
//                             ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
//                             'bg-green-100 text-green-800'
//                           }`}>
//                             {ticket.status === 'open' ? 'Open' : 
//                              ticket.status === 'in-progress' ? 'In Progress' : 'Closed'}
//                           </div>
//                         </div>
//                         <div className="mt-2 sm:flex sm:justify-between">
//                           <div className="sm:flex">
//                             <p className="flex items-center text-sm text-gray-500">
//                               <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
//                               {ticket.institution}
//                             </p>
//                           </div>
//                           <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
//                             <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
//                             <p>
//                               Updated {ticket.updatedAt}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="mt-2">
//                           <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             ticket.priority === 'critical' ? 'bg-red-100 text-red-800' :
//                             ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
//                             ticket.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
//                             'bg-green-100 text-green-800'
//                           }`}>
//                             {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                   ))
//                 ) : (
//                   <li className="px-6 py-4 text-center text-gray-500">
//                     No tickets found matching your criteria
//                   </li>
//                 )}
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Ticket Details */}
//         <div className="lg:flex-1">
//           {selectedTicket ? (
//             <div className="bg-white shadow rounded-lg overflow-hidden">
//               <div className="px-6 py-4 border-b border-gray-200 bg-[#07002F] text-white flex justify-between items-center">
//                 <h3 className="text-lg font-medium">Ticket Details</h3>
//                 <div className="flex space-x-2">
//                   {selectedTicket.status !== 'closed' && (
//                     <Button 
//                       size="sm"
//                       variant="outline"
//                       className="border-white text-white hover:bg-white hover:text-[#07002F]"
//                       onClick={() => handleStatusChange(selectedTicket.id, 'closed')}
//                     >
//                       <CheckCircle className="mr-2 h-4 w-4" />
//                       Close Ticket
//                     </Button>
//                   )}
//                   {selectedTicket.status === 'closed' && (
//                     <Button 
//                       size="sm"
//                       variant="outline"
//                       className="border-white text-white hover:bg-white hover:text-[#07002F]"
//                       onClick={() => handleStatusChange(selectedTicket.id, 'open')}
//                     >
//                       <XCircle className="mr-2 h-4 w-4" />
//                       Reopen Ticket
//                     </Button>
//                   )}
//                 </div>
//               </div>
              
//               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//                 <div className="flex flex-col space-y-2">
//                   <div className="flex justify-between items-start">
//                     <h4 className="text-lg font-medium text-gray-900">{selectedTicket.subject}</h4>
//                     <div className={`flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
//                       selectedTicket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
//                       selectedTicket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
//                       'bg-green-100 text-green-800'
//                     }`}>
//                       {selectedTicket.status === 'open' ? 'Open' : 
//                        selectedTicket.status === 'in-progress' ? 'In Progress' : 'Closed'}
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="text-gray-500">Ticket ID</p>
//                       <p className="font-medium">{selectedTicket.id}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-500">Category</p>
//                       <p className="font-medium">{selectedTicket.category}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-500">Institution</p>
//                       <p className="font-medium">{selectedTicket.institution}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-500">Submitted By</p>
//                       <p className="font-medium">{selectedTicket.submittedBy}</p>
//                     </div>
//                   </div>
//                   <div className="border-t border-gray-200 pt-4">
//                     <h5 className="font-medium text-gray-700 mb-2">Response</h5>
//                     <textarea 
//                       className="w-full border border-gray-300 rounded-md p-2 text-sm"
//                       rows={4}
//                       placeholder="Type your response here..."
//                       value={replyText}
//                       onChange={(e) => setReplyText(e.target.value)}
//                     ></textarea>
//                     <div className="mt-4 flex justify-end space-x-2">
//                       <Button variant="outline" size="sm" onClick={() => setSelectedTicket(null)}>
//                         Cancel
//                       </Button>
//                       <Button size="sm" onClick={handleReplySubmit}>
//                         Send Response
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Conversation History */}
//               <div className="px-6 py-4">
//                 <h5 className="font-medium text-gray-700 mb-4">Conversation History</h5>
//                 <div className="space-y-4 max-h-[400px] overflow-y-auto">
//                   {selectedTicket.messages.map((message) => (
//                     <div 
//                       key={message.id}
//                       className={`flex ${message.senderType === 'support' ? 'justify-end' : 'justify-start'}`}
//                     >
//                       <div 
//                         className={`max-w-[80%] rounded-lg px-4 py-2 ${
//                           message.senderType === 'support' 
//                             ? 'bg-[#07002F] text-white' 
//                             : 'bg-gray-100 text-gray-800'
//                         }`}
//                       >
//                         <div className="flex justify-between items-center mb-1">
//                           <span className="font-medium text-sm">{message.sender}</span>
//                           <span className="text-xs opacity-75">{message.timestamp}</span>
//                         </div>
//                         <p className="text-sm">{message.message}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="bg-white shadow rounded-lg overflow-hidden h-[200px] flex items-center justify-center">
//               <div className="text-center text-gray-500">
//                 <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
//                 <h3 className="mt-2 text-sm font-medium">No ticket selected</h3>
//                 <p className="mt-1 text-sm">Select a ticket from the list to view details</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SupportTickets;