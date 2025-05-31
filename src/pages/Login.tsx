import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import Logo from '../components/common/Logo';
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', {
      email,
      password,
      rememberMe
    });
    
    //Set user as logged in
    sessionStorage.setItem('userLoggedIn', 'true');

    // Redirect to workspace dashboard after login
    navigate('/workspace-dashboard');
  };

  return <AuthLayout>
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <h1 className="mt-4 text-2xl font-bold text-center text-[#07002F]">
            Financial Institution Secure Login
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Business Email
            </label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F] focus:border-transparent" placeholder="your.name@company.com" required />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F] focus:border-transparent" placeholder="••••••••" minLength={8} required />
              <button type="button" className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
            <div className="mt-1 text-right">
              <Link to="/reset-password" className="text-sm text-[#008401] hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>
          <div className="flex items-center mb-6">
            <input id="remember-me" type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-4 h-4 border border-gray-300 rounded text-[#008401] focus:ring-[#008401]" />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
              Keep me signed in on this device
            </label>
          </div>
          <button type="submit" className="w-full px-4 py-3 text-white bg-[#07002F] rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#008401] focus:ring-opacity-50 transition duration-200">
            Sign In
          </button>
        </form>
        <div className="mt-8 text-center">
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-gray-300"></div>
            <span className="relative px-4 bg-white text-sm text-gray-500">
              New to the platform?
            </span>
          </div>
          <Link to="/register" className="block w-full mt-4 px-4 py-3 text-[#07002F] bg-white border border-[#07002F] rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#008401] focus:ring-opacity-50 transition duration-200">
            Register Your Institution
          </Link>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <div className="flex justify-center space-x-4">
            <Link to="/terms" className="hover:text-[#008401]">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-[#008401]">
              Privacy Policy
            </Link>
            <Link to="/support" className="hover:text-[#008401]">
              Support
            </Link>
          </div>
          <div className="mt-2 text-xs">
            <p>
              System will automatically log you out after 15 minutes of
              inactivity
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>;
};
export default Login;