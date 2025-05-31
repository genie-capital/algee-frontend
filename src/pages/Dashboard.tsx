import React from 'react';
import { Link } from 'react-router-dom';
const Dashboard = () => {
  return <div className="min-h-screen bg-gray-50">
      <header className="bg-[#07002F] text-white px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold">Credit Scoring System</span>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link to="/dashboard" className="hover:text-[#008401]">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/assessments" className="hover:text-[#008401]">
                  Assessments
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-[#008401]">
                  Reports
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-[#008401]">
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
          <div>
            <Link to="/" className="text-sm hover:underline">
              Sign Out
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#07002F] mb-6">Dashboard</h1>
        <p className="text-gray-700">
          Dashboard content will be implemented here.
        </p>
      </main>
    </div>;
};
export default Dashboard;