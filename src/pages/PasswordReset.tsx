import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import Logo from '../components/common/Logo';
import PasswordResetForm from '../components/forms/PasswordResetForm';
const PasswordReset = () => {
  const navigate = useNavigate();
  const handleResetComplete = () => {
    // Delay navigation to show success message
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };
  return <AuthLayout>
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <h1 className="mt-4 text-2xl font-bold text-center text-[#07002F]">
            Reset Your Password
          </h1>
        </div>
        <PasswordResetForm onComplete={handleResetComplete} />
        <div className="mt-8 text-center">
          <Link to="/" className="text-[#008401] hover:underline mt-4 inline-block">
            Return to Login
          </Link>
        </div>
      </div>
    </AuthLayout>;
};
export default PasswordReset;