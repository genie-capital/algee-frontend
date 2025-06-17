import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRightIcon, CheckIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { required, email, minLength, matches, passwordsMatch } from '../../utils/validation';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { Country, State, City } from 'country-state-city';

interface FormData {
  // Institution Information
  businessName: string;
  registrationNumber: string;
  institutionType: string;
  authorizationNumber: string;
  address: {
    street: string;
    city: string;
    cityCode: string;
    state: string;
    stateCode: string;
    country: string;
    countryCode: string;
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
    cityCode: string;
    state: string;
    stateCode: string;
    country: string;
    countryCode: string;
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

// Address selector component
const AddressSelector = ({
  addressType,
  formData,
  formErrors,
  handleChange,
  validateField
}: {
  addressType: 'address' | 'adminAddress';
  formData: FormData;
  formErrors: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  validateField: (field: keyof FormData) => boolean;
}) => {
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const addressData = formData[addressType];

  useEffect(() => {
    // Load all countries on component mount
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    // Load states when country changes
    if (addressData.countryCode) {
      setLoadingStates(true);
      const countryStates = State.getStatesOfCountry(addressData.countryCode);
      setStates(countryStates);
      setLoadingStates(false);
      
      // Reset state and city when country changes
      if (addressData.stateCode) {
        handleChange({
          target: { name: `${addressType}.state`, value: '' }
        } as React.ChangeEvent<HTMLSelectElement>);
        handleChange({
          target: { name: `${addressType}.stateCode`, value: '' }
        } as React.ChangeEvent<HTMLSelectElement>);
      }
      setCities([]);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [addressData.countryCode]);

  useEffect(() => {
    // Load cities when state changes
    if (addressData.countryCode && addressData.stateCode) {
      setLoadingCities(true);
      const stateCities = City.getCitiesOfState(addressData.countryCode, addressData.stateCode);
      setCities(stateCities);
      setLoadingCities(false);
    } else {
      setCities([]);
    }
  }, [addressData.stateCode]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = countries.find(country => country.isoCode === e.target.value);
    
    // Update country
    handleChange({
      target: { name: `${addressType}.countryCode`, value: e.target.value }
    } as React.ChangeEvent<HTMLSelectElement>);
    
    handleChange({
      target: { name: `${addressType}.country`, value: selectedCountry?.name || '' }
    } as React.ChangeEvent<HTMLSelectElement>);
    
    // Reset dependent fields
    handleChange({
      target: { name: `${addressType}.state`, value: '' }
    } as React.ChangeEvent<HTMLSelectElement>);
    
    handleChange({
      target: { name: `${addressType}.stateCode`, value: '' }
    } as React.ChangeEvent<HTMLSelectElement>);
    
    handleChange({
      target: { name: `${addressType}.city`, value: '' }
    } as React.ChangeEvent<HTMLSelectElement>);
    
    handleChange({
      target: { name: `${addressType}.cityCode`, value: '' }
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedState = states.find(state => state.isoCode === e.target.value);
    
    // Update state
    handleChange({
      target: { name: `${addressType}.stateCode`, value: e.target.value }
    } as React.ChangeEvent<HTMLSelectElement>);
    
    handleChange({
      target: { name: `${addressType}.state`, value: selectedState?.name || '' }
    } as React.ChangeEvent<HTMLSelectElement>);
    
    // Reset city
    handleChange({
      target: { name: `${addressType}.city`, value: '' }
    } as React.ChangeEvent<HTMLSelectElement>);
    
    handleChange({
      target: { name: `${addressType}.cityCode`, value: '' }
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = cities.find(city => city.name === e.target.value);
    
    handleChange({
      target: { name: `${addressType}.city`, value: e.target.value }
    } as React.ChangeEvent<HTMLSelectElement>);
    
    handleChange({
      target: { name: `${addressType}.cityCode`, value: selectedCity?.name || '' }
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        {addressType === 'address' ? 'Business Address' : 'Administrator Address'} *
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country Selection */}
        <div>
          <label htmlFor={`${addressType}.country`} className="block text-sm font-medium text-gray-700">
            Country *
          </label>
          <select
            id={`${addressType}.country`}
            name={`${addressType}.countryCode`}
            value={addressData.countryCode}
            onChange={handleCountryChange}
            onBlur={() => validateField(`${addressType}.country` as keyof FormData)}
            className={`mt-1 block w-full px-4 py-3 border ${
              formErrors[`${addressType}.country`] ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`}
            required
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
          {formErrors[`${addressType}.country`] && (
            <p className="mt-1 text-sm text-red-500">{formErrors[`${addressType}.country`]}</p>
          )}
        </div>

        {/* State Selection */}
        <div>
          <label htmlFor={`${addressType}.state`} className="block text-sm font-medium text-gray-700">
            State/Province/Region *
          </label>
          <select
            id={`${addressType}.state`}
            name={`${addressType}.stateCode`}
            value={addressData.stateCode}
            onChange={handleStateChange}
            onBlur={() => validateField(`${addressType}.state` as keyof FormData)}
            className={`mt-1 block w-full px-4 py-3 border ${
              formErrors[`${addressType}.state`] ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`}
            disabled={!addressData.countryCode || loadingStates}
            required
          >
            <option value="">
              {loadingStates ? 'Loading states...' : 'Select a state/province'}
            </option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
          {formErrors[`${addressType}.state`] && (
            <p className="mt-1 text-sm text-red-500">{formErrors[`${addressType}.state`]}</p>
          )}
        </div>

        {/* City Selection */}
        <div>
          <label htmlFor={`${addressType}.city`} className="block text-sm font-medium text-gray-700">
            City/Town *
          </label>
          <select
            id={`${addressType}.city`}
            name={`${addressType}.city`}
            value={addressData.city}
            onChange={handleCityChange}
            onBlur={() => validateField(`${addressType}.city` as keyof FormData)}
            className={`mt-1 block w-full px-4 py-3 border ${
              formErrors[`${addressType}.city`] ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`}
            disabled={!addressData.stateCode || loadingCities}
            required
          >
            <option value="">
              {loadingCities ? 'Loading cities...' : 'Select a city/town'}
            </option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          {formErrors[`${addressType}.city`] && (
            <p className="mt-1 text-sm text-red-500">{formErrors[`${addressType}.city`]}</p>
          )}
        </div>

        {/* Street Address */}
        <div>
          <label htmlFor={`${addressType}.street`} className="block text-sm font-medium text-gray-700">
            Street Address
          </label>
          <input
            type="text"
            id={`${addressType}.street`}
            name={`${addressType}.street`}
            className={`mt-1 block w-full px-4 py-3 border ${
              formErrors[`${addressType}.street`] ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`}
            value={addressData.street}
            onChange={handleChange}
            onBlur={() => validateField(`${addressType}.street` as keyof FormData)}
            placeholder="Enter street address, building number, etc."
          />
          {formErrors[`${addressType}.street`] && (
            <p className="mt-1 text-sm text-red-500">{formErrors[`${addressType}.street`]}</p>
          )}
        </div>
      </div>
    </div>
  );
};

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
      cityCode: '',
      state: '',
      stateCode: '',
      country: '',
      countryCode: ''
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
      cityCode: '',
      state: '',
      stateCode: '',
      country: '',
      countryCode: ''
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
    businessName: [
      required('Business name is required'),
      minLength(2, 'Business name must be at least 2 characters')
    ],
    registrationNumber: [
      required('Registration number is required'),
      matches(/^[A-Z0-9-]+$/, 'Registration number must contain only uppercase letters, numbers, and hyphens')
    ],
    institutionType: [required('Institution type is required')],
    authorizationNumber: [
      required('Authorization number is required'),
      matches(/^[A-Z0-9-]+$/, 'Authorization number must contain only uppercase letters, numbers, and hyphens')
    ],
    'address.country': [required('Country is required')],
    'address.state': [required('State/Province is required')],
    'address.city': [required('City is required')],
    'address.street': [required('Street address is required')],
    phoneNumber: [
      required('Phone number is required'),
      matches(/^\+?[0-9\s-()]+$/, 'Please enter a valid phone number')
    ],
    website: [
      matches(/^$|^https?:\/\/.+/, 'Please enter a valid website URL starting with http:// or https://')
    ],
    firstName: [
      required('First name is required'),
      minLength(2, 'First name must be at least 2 characters')
    ],
    lastName: [
      required('Last name is required'),
      minLength(2, 'Last name must be at least 2 characters')
    ],
    jobTitle: [
      required('Job title is required'),
      minLength(2, 'Job title must be at least 2 characters')
    ],
    email: [
      required('Email is required'),
      email()
    ],
    directPhone: [
      required('Direct phone number is required'),
      matches(/^\+?[0-9\s-()]+$/, 'Please enter a valid phone number')
    ],
    username: [
      required('Username is required'),
      minLength(5, 'Username must be at least 5 characters'),
      matches(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    ],
    password: [
      required('Password is required'),
      minLength(8, 'Password must be at least 8 characters'),
      matches(/[A-Z]/, 'Password must include at least one uppercase letter'),
      matches(/[a-z]/, 'Password must include at least one lowercase letter'),
      matches(/[0-9]/, 'Password must include at least one number'),
      matches(/[^A-Za-z0-9]/, 'Password must include at least one special character')
    ],
    confirmPassword: [
      required('Please confirm your password'),
      passwordsMatch('password', 'Passwords do not match')
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

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    try {
      // Transform formData to match API expectations
      const institutionData = {
        name: formData.businessName,
        email: formData.email,
        password: formData.password,
        registrationNumber: formData.registrationNumber,
        institutionType: formData.institutionType,
        authorizationNumber: formData.authorizationNumber,
        address: {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          country: formData.address.country,
          cityCode: formData.address.cityCode,
          stateCode: formData.address.stateCode,
          countryCode: formData.address.countryCode
        },
        phoneNumber: formData.phoneNumber,
        website: formData.website || undefined,
        adminInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          jobTitle: formData.jobTitle,
          email: formData.email,
          directPhone: formData.directPhone,
          address: formData.adminAddress.sameAsBusiness ? {
            street: formData.address.street,
            city: formData.address.city,
            state: formData.address.state,
            country: formData.address.country,
            cityCode: formData.address.cityCode,
            stateCode: formData.address.stateCode,
            countryCode: formData.address.countryCode
          } : {
            street: formData.adminAddress.street,
            city: formData.adminAddress.city,
            state: formData.adminAddress.state,
            country: formData.adminAddress.country,
            cityCode: formData.adminAddress.cityCode,
            stateCode: formData.adminAddress.stateCode,
            countryCode: formData.adminAddress.countryCode
          }
        },
        username: formData.username,
        enableTwoFactor: formData.enableTwoFactor,
        acceptMarketing: formData.acceptMarketing,
        acceptTerms: formData.acceptTerms,
        acceptDataProcessing: formData.acceptDataProcessing
      };
      
      await register(institutionData);
      
      // Show success message with more details
      alert(
        'Registration successful!\n\n' +
        'Your account is pending approval. You will receive an email at ' + formData.email + 
        ' once your account is approved.\n\n' +
        'Please keep your registration number (' + formData.registrationNumber + 
        ') for future reference.'
      );
      
      // Redirect to login page
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      // Show more specific error messages
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

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

            <div>
              <label htmlFor="institutionType" className="block text-sm font-medium text-gray-700">
                Institution Type *
              </label>
              <select
                id="institutionType"
                name="institutionType"
                required
                className={`mt-1 block w-full px-4 py-3 border ${formErrors.institutionType ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`}
                value={formData.institutionType}
                onChange={handleChange}
                onBlur={() => validateField('institutionType')}
              >
                <option value="">Select institution type</option>
                <option value="bank">Bank</option>
                <option value="credit_union">Credit Union</option>
                <option value="microfinance">Microfinance Institution</option>
                <option value="other">Other</option>
              </select>
              {formErrors.institutionType && (
                <p className="mt-1 text-sm text-red-500">{formErrors.institutionType}</p>
              )}
            </div>

            <div>
              <label htmlFor="authorizationNumber" className="block text-sm font-medium text-gray-700">
                Authorization Number *
              </label>
              <input 
                type="text" 
                id="authorizationNumber" 
                name="authorizationNumber" 
                required 
                className={`mt-1 block w-full px-4 py-3 border ${formErrors.authorizationNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
                value={formData.authorizationNumber} 
                onChange={handleChange} 
                onBlur={() => validateField('authorizationNumber')}
              />
              {formErrors.authorizationNumber && (
                <p className="mt-1 text-sm text-red-500">{formErrors.authorizationNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Business Phone Number *
              </label>
              <input 
                type="tel" 
                id="phoneNumber" 
                name="phoneNumber" 
                required 
                className={`mt-1 block w-full px-4 py-3 border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                onBlur={() => validateField('phoneNumber')}
              />
              {formErrors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">{formErrors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input 
                type="url" 
                id="website" 
                name="website" 
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" 
                value={formData.website} 
                onChange={handleChange}
              />
            </div>

            <AddressSelector
              addressType="address"
              formData={formData}
              formErrors={formErrors}
              handleChange={handleChange}
              validateField={validateField}
            />
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName" 
                required 
                className={`mt-1 block w-full px-4 py-3 border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
                value={formData.firstName} 
                onChange={handleChange} 
                onBlur={() => validateField('firstName')}
              />
              {formErrors.firstName && (
                <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input 
                type="text" 
                id="lastName" 
                name="lastName" 
                required 
                className={`mt-1 block w-full px-4 py-3 border ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
                value={formData.lastName} 
                onChange={handleChange} 
                onBlur={() => validateField('lastName')}
              />
              {formErrors.lastName && (
                <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>
              )}
            </div>

            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                Job Title *
              </label>
              <input 
                type="text" 
                id="jobTitle" 
                name="jobTitle" 
                required 
                className={`mt-1 block w-full px-4 py-3 border ${formErrors.jobTitle ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
                value={formData.jobTitle} 
                onChange={handleChange} 
                onBlur={() => validateField('jobTitle')}
              />
              {formErrors.jobTitle && (
                <p className="mt-1 text-sm text-red-500">{formErrors.jobTitle}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                className={`mt-1 block w-full px-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
                value={formData.email} 
                onChange={handleChange} 
                onBlur={() => validateField('email')}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="directPhone" className="block text-sm font-medium text-gray-700">
                Direct Phone Number *
              </label>
              <input 
                type="tel" 
                id="directPhone" 
                name="directPhone" 
                required 
                className={`mt-1 block w-full px-4 py-3 border ${formErrors.directPhone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
                value={formData.directPhone} 
                onChange={handleChange} 
                onBlur={() => validateField('directPhone')}
              />
              {formErrors.directPhone && (
                <p className="mt-1 text-sm text-red-500">{formErrors.directPhone}</p>
              )}
            </div>

            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="sameAsBusiness"
                  name="adminAddress.sameAsBusiness"
                  checked={formData.adminAddress.sameAsBusiness}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#07002F] focus:ring-[#07002F] border-gray-300 rounded"
                />
                <label htmlFor="sameAsBusiness" className="ml-2 block text-sm text-gray-700">
                  Same as business address
                </label>
              </div>

              {!formData.adminAddress.sameAsBusiness && (
                <AddressSelector
                  addressType="adminAddress"
                  formData={formData}
                  formErrors={formErrors}
                  handleChange={handleChange}
                  validateField={validateField}
                />
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username *
              </label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                required 
                className={`mt-1 block w-full px-4 py-3 border ${formErrors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
                value={formData.username} 
                onChange={handleChange} 
                onBlur={() => validateField('username')}
              />
              {formErrors.username && (
                <p className="mt-1 text-sm text-red-500">{formErrors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input 
                type={showPassword ? "text" : "password"}
                id="password" 
                name="password" 
                required 
                className={`mt-1 block w-full px-4 py-3 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
                value={formData.password} 
                onChange={handleChange} 
                onBlur={() => {
                  validateField('password');
                  // Also validate confirm password when password changes
                  if (formData.confirmPassword) {
                    validateField('confirmPassword');
                  }
                }}
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Password must be at least 8 characters long and include uppercase, number, and special character
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input 
                type={showPassword ? "text" : "password"}
                id="confirmPassword" 
                name="confirmPassword" 
                required 
                className={`mt-1 block w-full px-4 py-3 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]`} 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                onBlur={() => validateField('confirmPassword')}
              />
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="h-4 w-4 text-[#07002F] focus:ring-[#07002F] border-gray-300 rounded"
              />
              <label htmlFor="showPassword" className="ml-2 block text-sm text-gray-700">
                Show Password
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableTwoFactor"
                name="enableTwoFactor"
                checked={formData.enableTwoFactor}
                onChange={handleChange}
                className="h-4 w-4 text-[#07002F] focus:ring-[#07002F] border-gray-300 rounded"
              />
              <label htmlFor="enableTwoFactor" className="ml-2 block text-sm text-gray-700">
                Enable Two-Factor Authentication (Recommended)
              </label>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  required
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#07002F] focus:ring-[#07002F] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                  I accept the Terms of Service and Privacy Policy *
                </label>
                {formErrors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.acceptTerms}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="acceptDataProcessing"
                  name="acceptDataProcessing"
                  required
                  checked={formData.acceptDataProcessing}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#07002F] focus:ring-[#07002F] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="acceptDataProcessing" className="text-sm text-gray-700">
                  I accept the Data Processing Agreement *
                </label>
                {formErrors.acceptDataProcessing && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.acceptDataProcessing}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="acceptMarketing"
                  name="acceptMarketing"
                  checked={formData.acceptMarketing}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#07002F] focus:ring-[#07002F] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="acceptMarketing" className="text-sm text-gray-700">
                  I agree to receive marketing communications (Optional)
                </label>
              </div>
            </div>
          </div>
        )}

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
                // Get fields to validate based on current step
                const stepFields = currentStep === 1 
                  ? ['businessName', 'registrationNumber', 'institutionType', 'authorizationNumber', 'address.country', 'address.state', 'address.city', 'address.street', 'phoneNumber']
                  : currentStep === 2
                  ? ['firstName', 'lastName', 'jobTitle', 'email', 'directPhone', 'adminAddress.country', 'adminAddress.state', 'adminAddress.city', 'adminAddress.street']
                  : currentStep === 3
                  ? ['username', 'password', 'confirmPassword']
                  : ['acceptTerms', 'acceptDataProcessing'];

                // Validate each field in the current step
                const isValid = stepFields.every(field => validateField(field as keyof FormData));
                
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