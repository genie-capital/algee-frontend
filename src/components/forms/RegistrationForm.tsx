import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRightIcon, CheckIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { required, email, minLength, matches, passwordsMatch } from '../../utils/validation';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

interface FormData {
  // Institution Information
  businessName: string;
  registrationNumber: string;
  institutionType: string;
  authorizationNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  phoneNumber: string;
  website: string;
  // Primary Administrator
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  directPhone: string;
  adminAddress: {
    sameAsBusiness: boolean;
    street: string;
    city: string;
    state: string;
    country: string;
  };
  // Account Security
  username: string;
  password: string;
  confirmPassword: string;
  enableTwoFactor: boolean;
  // Terms & Compliance
  acceptTerms: boolean;
  acceptDataProcessing: boolean;
  acceptMarketing: boolean;
}

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, error: authError, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const initialFormData: FormData = {
    businessName: '',
    registrationNumber: '',
    institutionType: '',
    authorizationNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: ''
    },
    phoneNumber: '',
    website: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    directPhone: '',
    adminAddress: {
      sameAsBusiness: true,
      street: '',
      city: '',
      state: '',
      country: ''
    },
    username: '',
    password: '',
    confirmPassword: '',
    enableTwoFactor: true,
    acceptTerms: false,
    acceptDataProcessing: false,
    acceptMarketing: false
  };
  
  const validationRules = {
    businessName: [required('Business name is required')],
    registrationNumber: [required('Registration number is required')],
    institutionType: [required('Institution type is required')],
    authorizationNumber: [required('Authorization number is required')],
    'address.street': [required('Street address is required')],
    'address.city': [required('City is required')],
    'address.state': [required('State/Province is required')],
    'address.country': [required('Country is required')],
    phoneNumber: [required('Phone number is required')],
    firstName: [required('First name is required')],
    lastName: [required('Last name is required')],
    jobTitle: [required('Job title is required')],
    email: [required('Email is required'), email()],
    directPhone: [required('Direct phone number is required')],
    username: [required('Username is required'), minLength(5, 'Username must be at least 5 characters')],
    password: [
      required('Password is required'),
      minLength(8, 'Password must be at least 8 characters'),
      matches(/[A-Z]/, 'Password must include at least one uppercase letter'),
      matches(/[0-9]/, 'Password must include at least one number'),
      matches(/[^A-Za-z0-9]/, 'Password must include at least one special character')
    ],
    confirmPassword: [
      required('Please confirm your password'),
      passwordsMatch('password', 'Passwords must match')
    ],
    acceptTerms: [required('You must accept the terms of service')],
    acceptDataProcessing: [required('You must accept the data processing agreement')]
  };
  
  const {
    formData,
    formErrors,
    loading,
    handleChange,
    validateField,
    validateAllFields,
    handleSubmit
  } = useForm<FormData>(initialFormData, validationRules);

  const onSubmit = async () => {
    try {
      // Transform formData to match API expectations
      const institutionData = {
        name: formData.businessName,
        email: formData.email,
        password: formData.password,
        // Add additional fields as needed
        registrationNumber: formData.registrationNumber,
        institutionType: formData.institutionType,
        authorizationNumber: formData.authorizationNumber,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        website: formData.website,
        adminInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          jobTitle: formData.jobTitle,
          email: formData.email,
          directPhone: formData.directPhone,
          address: formData.adminAddress.sameAsBusiness ? formData.address : formData.adminAddress
        },
        username: formData.username,
        enableTwoFactor: formData.enableTwoFactor,
        acceptMarketing: formData.acceptMarketing
      };
      
      await register(institutionData);
      // Redirect to credit parameters config page
      navigate('/credit-parameters-config');
    } catch (err: any) {
      console.error('Registration error:', err);
      // Error is handled by the auth context
    }
  };

  const renderAddressFields = (prefix: string, data: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label htmlFor={`${prefix}street`} className="block text-sm font-medium text-gray-700">
          Street Address *
        </label>
        <input 
          type="text" 
          id={`${prefix}street`} 
          name={`${prefix}street`} 
          required 
          className={`mt-1 block w-full px-4 py-3 border ${formErrors[`${prefix}street`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
          value={data.street} 
          onChange={handleChange} 
          onBlur={() => validateField(`${prefix}street` as keyof FormData)}
        />
        {formErrors[`${prefix}street`] && (
          <p className="mt-1 text-sm text-red-500">{formErrors[`${prefix}street`]}</p>
        )}
      </div>
      <div>
        <label htmlFor={`${prefix}city`} className="block text-sm font-medium text-gray-700">
          City *
        </label>
        <input 
          type="text" 
          id={`${prefix}city`} 
          name={`${prefix}city`} 
          required 
          className={`mt-1 block w-full px-4 py-3 border ${formErrors[`${prefix}city`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
          value={data.city} 
          onChange={handleChange} 
          onBlur={() => validateField(`${prefix}city` as keyof FormData)}
        />
        {formErrors[`${prefix}city`] && (
          <p className="mt-1 text-sm text-red-500">{formErrors[`${prefix}city`]}</p>
        )}
      </div>
      <div>
        <label htmlFor={`${prefix}state`} className="block text-sm font-medium text-gray-700">
          State/Province *
        </label>
        <input 
          type="text" 
          id={`${prefix}state`} 
          name={`${prefix}state`} 
          required 
          className={`mt-1 block w-full px-4 py-3 border ${formErrors[`${prefix}state`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
          value={data.state} 
          onChange={handleChange} 
          onBlur={() => validateField(`${prefix}state` as keyof FormData)}
        />
        {formErrors[`${prefix}state`] && (
          <p className="mt-1 text-sm text-red-500">{formErrors[`${prefix}state`]}</p>
        )}
      </div>
      <div>
        <label htmlFor={`${prefix}country`} className="block text-sm font-medium text-gray-700">
          Country *
        </label>
        <input 
          type="text" 
          id={`${prefix}country`} 
          name={`${prefix}country`} 
          required 
          className={`mt-1 block w-full px-4 py-3 border ${formErrors[`${prefix}country`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
          value={data.country} 
          onChange={handleChange} 
          onBlur={() => validateField(`${prefix}country` as keyof FormData)}
        />
        {formErrors[`${prefix}country`] && (
          <p className="mt-1 text-sm text-red-500">{formErrors[`${prefix}country`]}</p>
        )}
      </div>
    </div>
  );

  const steps = ['Institution Information', 'Primary Administrator', 'Account Security', 'Terms & Compliance'];

  // Show loading spinner when submitting
  if (loading || authLoading) {
    return <LoadingSpinner size="large" text="Processing registration..." />;
  }

  return (
    <div className="w-full">
      {/* Error Alert */}
      {authError && <ErrorAlert message={authError} />}
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${currentStep > index + 1 ? 'bg-[#008401] text-white' : currentStep === index + 1 ? 'bg-[#07002F] text-white' : 'bg-gray-200 text-gray-600'}
                `}
              >
                {currentStep > index + 1 ? <CheckIcon size={16} /> : index + 1}
              </div>
              <span className="hidden md:block ml-2 text-sm">{step}</span>
              {index < steps.length - 1 && <ChevronRightIcon className="mx-2 text-gray-400" size={16} />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                Legal Business Name *
              </label>
              <input 
                type="text" 
                id="businessName" 
                name="businessName" 
                required 
                className={`mt-1 block w-full px-4 py-3 border ${formErrors.businessName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
                value={formData.businessName} 
                onChange={handleChange} 
                onBlur={() => validateField('businessName')}
              />
              {formErrors.businessName && (
                <p className="mt-1 text-sm text-red-500">{formErrors.businessName}</p>
              )}
            </div>
            
            {/* ... other fields with similar validation pattern */}
            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                Business Registration Number *
              </label>
              <input 
                type="text" 
                id="registrationNumber" 
                name="registrationNumber" 
                required 
                className={`mt-1 block w-full px-4 py-3 border ${formErrors.registrationNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
                value={formData.registrationNumber} 
                onChange={handleChange} 
                onBlur={() => validateField('registrationNumber')}
              />
              {formErrors.registrationNumber && (
                <p className="mt-1 text-sm text-red-500">{formErrors.registrationNumber}</p>
              )}
            </div>
            
            {/* ... continue with other fields */}
            
            {/* Continue with the rest of the form fields */}
          </div>
        )}
        
        {/* ... other steps with similar validation pattern */}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-6 py-3 text-[#07002F] bg-white border border-[#07002F] rounded-md hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={() => {
                // Validate current step fields before proceeding
                const isValid = validateAllFields();
                if (isValid) {
                  setCurrentStep(prev => prev + 1);
                }
              }}
              className="px-6 py-3 text-white bg-[#07002F] rounded-md hover:bg-opacity-90 ml-auto"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-3 text-white bg-[#008401] rounded-md hover:bg-opacity-90 ml-auto"
            >
              Submit Registration
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>All fields marked with * are required</p>
        <p className="mt-2">
          Registration requires approval from system administrators
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;