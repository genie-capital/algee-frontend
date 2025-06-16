import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
  institutionName?: string;
  userName?: string;
  institutionLogo?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  institutionName,
  userName,
  institutionLogo
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          institutionName={institutionName} 
          userName={userName}
          institutionLogo={institutionLogo}
        />
        <Toaster position="top-right" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 pt-16">
          <div className="container px-6 py-8 mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;