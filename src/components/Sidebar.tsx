import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserIcon, 
  FileTextIcon, 
  SettingsIcon, 
  FilesIcon, 
  BarChartIcon, 
  LogOutIcon, 
  MenuIcon, 
  XIcon 
} from 'lucide-react';
import Logo from './common/Logo';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/workspace-dashboard',
      icon: HomeIcon
    },
    {
      name: 'Credit Parameters',
      href: '/credit-parameters-config',
      icon: SettingsIcon
    },
    // {
    //   name: 'Individual Client Entry',
    //   href: '/client-assessment',
    //   icon: UserIcon
    // },
    {
      name: 'Batch Upload',
      href: '/batch-assessment',
      icon: FilesIcon
    },
    {
      name: 'Results',
      href: '/results',
      icon: BarChartIcon
    }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        onClick={toggleSidebar} 
        className="md:hidden fixed z-50 bottom-4 right-4 bg-[#07002F] text-white p-2 rounded-full shadow-lg"
      >
        {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
      </button>

      <aside className={`bg-[#07002F] text-white w-64 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'fixed inset-y-0 left-0 z-40' : '-translate-x-full md:translate-x-0 fixed md:static'}`}>
        <div className="flex items-center justify-center h-16 border-b border-[#008401]/30">
          <div className="flex items-center">
            <Logo />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navigation.map(item => (
              <Link 
                key={item.name} 
                to={item.href} 
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.href 
                    ? 'bg-[#008401]/20 text-white' 
                    : 'text-gray-300 hover:bg-[#008401]/10 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-[#008401]/30">
          <Link 
            to="/" 
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-[#008401]/10 hover:text-white"
          >
            <LogOutIcon className="mr-3 h-5 w-5 text-gray-400" />
            Logout
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;