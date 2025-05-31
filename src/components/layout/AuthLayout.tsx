import React from 'react';
interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout: React.FC<AuthLayoutProps> = ({
  children
}) => {
  return <div className="min-h-screen w-full bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
      {children}
    </div>;
};
export default AuthLayout;