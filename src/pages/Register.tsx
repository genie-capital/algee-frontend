import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import Logo from '../components/common/Logo';
import RegistrationForm from '../components/forms/RegistrationForm';
const Register = () => {
  return <AuthLayout>
      <div className="w-full max-w-4xl px-8 py-10 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <h1 className="mt-4 text-2xl font-bold text-center text-[#07002F]">
            Register Your Financial Institution
          </h1>
          <p className="mt-2 text-gray-600 text-center max-w-xl">
            Complete the registration form below to create your institution's
            account. Our team will review your application within 2-3 business
            days.
          </p>
        </div>
        <RegistrationForm />
        <div className="mt-8 text-center">
          <Link to="/" className="text-[#008401] hover:underline inline-block">
            Already registered? Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>;
};
export default Register;