import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

interface NavbarProps {
  institutionName?: string;
  userName?: string;
  institutionLogo?: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  institutionName = "Financial Institution", 
  userName = "Admin User",
  institutionLogo
}) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => document.getElementById('sidebar-menu')?.classList.toggle('hidden')}
              id="toggleSidebarMobile" 
              aria-expanded="true" 
              aria-label="Toggle navigation menu"
              title="Toggle sidebar menu"
              className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
              </svg>
            </button>
            <div className="text-xl font-bold flex items-center lg:ml-2.5">
              <span className="self-center whitespace-nowrap text-[#07002F]">Credit Scoring System</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="flex flex-col items-end mr-3">
                <span className="text-sm font-medium text-gray-900">{institutionName}</span>
                <span className="text-xs text-gray-500">{userName}</span>
              </div>
              <div className="h-12 w-12 rounded-full border-2 border-gray-200 overflow-hidden flex items-center justify-center bg-[#07002F] text-white">
                {institutionLogo ? (
                  <img 
                    src={institutionLogo} 
                    alt={`${institutionName} logo`} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircle size={24} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;