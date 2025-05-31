import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRightIcon, CheckIcon } from 'lucide-react';
interface FormData {
  // Institution Information
  businessName: string;
  registrationNumber: string;
  institutionType: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
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
    postalCode: string;
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
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    registrationNumber: '',
    institutionType: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
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
      postalCode: '',
      country: ''
    },
    username: '',
    password: '',
    confirmPassword: '',
    enableTwoFactor: true,
    acceptTerms: false,
    acceptDataProcessing: false,
    acceptMarketing: false
  });

  const navigate = useNavigate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    // Redirect to credit parameters config page
    navigate('/credit-parameters-config');
  };
  const steps = ['Institution Information', 'Primary Administrator', 'Account Security', 'Terms & Compliance'];
  const renderAddressFields = (prefix: string, data: any) => <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label htmlFor={`${prefix}street`} className="block text-sm font-medium text-gray-700">
          Street Address *
        </label>
        <input type="text" id={`${prefix}street`} name={`${prefix}street`} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={data.street} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor={`${prefix}city`} className="block text-sm font-medium text-gray-700">
          City *
        </label>
        <input type="text" id={`${prefix}city`} name={`${prefix}city`} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={data.city} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor={`${prefix}state`} className="block text-sm font-medium text-gray-700">
          State/Province *
        </label>
        <input type="text" id={`${prefix}state`} name={`${prefix}state`} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={data.state} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor={`${prefix}postalCode`} className="block text-sm font-medium text-gray-700">
          Postal Code *
        </label>
        <input type="text" id={`${prefix}postalCode`} name={`${prefix}postalCode`} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={data.postalCode} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor={`${prefix}country`} className="block text-sm font-medium text-gray-700">
          Country *
        </label>
        <input type="text" id={`${prefix}country`} name={`${prefix}country`} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={data.country} onChange={handleInputChange} />
      </div>
    </div>;
  return <div className="w-full">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${currentStep > index + 1 ? 'bg-[#008401] text-white' : currentStep === index + 1 ? 'bg-[#07002F] text-white' : 'bg-gray-200 text-gray-600'}
              `}>
                {currentStep > index + 1 ? <CheckIcon size={16} /> : index + 1}
              </div>
              <span className="hidden md:block ml-2 text-sm">{step}</span>
              {index < steps.length - 1 && <ChevronRightIcon className="mx-2 text-gray-400" size={16} />}
            </div>)}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && <div className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                Legal Business Name *
              </label>
              <input type="text" id="businessName" name="businessName" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={formData.businessName} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                Business Registration Number *
              </label>
              <input type="text" id="registrationNumber" name="registrationNumber" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={formData.registrationNumber} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="institutionType" className="block text-sm font-medium text-gray-700">
                Institution Type *
              </label>
              <select id="institutionType" name="institutionType" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={formData.institutionType} onChange={handleInputChange}>
                <option value="">Select type...</option>
                <option value="commercial_bank">Commercial Bank</option>
                <option value="credit_union">Credit Union</option>
                <option value="microfinance">Microfinance Institution</option>
                <option value="other">Other Financial Institution</option>
              </select>
            </div>
            <div className="pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Business Address
              </h3>
              {renderAddressFields('address.', formData.address)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Business Phone Number *
                </label>
                <input type="tel" id="phoneNumber" name="phoneNumber" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={formData.phoneNumber} onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Business Website
                </label>
                <input type="url" id="website" name="website" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={formData.website} onChange={handleInputChange} placeholder="https://" />
              </div>
            </div>
          </div>}
        {currentStep === 2 && <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Primary Administrator Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input type="text" id="firstName" name="firstName" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={formData.firstName} onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input type="text" id="lastName" name="lastName" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={formData.lastName} onChange={handleInputChange} />
              </div>
            </div>
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                Job Title *
              </label>
              <input type="text" id="jobTitle" name="jobTitle" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={formData.jobTitle} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Business Email *
                </label>
                <input type="email" id="email" name="email" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={formData.email} onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="directPhone" className="block text-sm font-medium text-gray-700">
                  Direct Phone Number *
                </label>
                <input type="tel" id="directPhone" name="directPhone" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={formData.directPhone} onChange={handleInputChange} />
              </div>
            </div>
            <div className="pt-4">
              <div className="flex items-center mb-4">
                <input type="checkbox" id="sameAsBusiness" name="adminAddress.sameAsBusiness" className="w-4 h-4 text-[#008401] border-gray-300 rounded focus:ring-[#008401]" checked={formData.adminAddress.sameAsBusiness} onChange={handleInputChange} />
                <label htmlFor="sameAsBusiness" className="ml-2 text-sm text-gray-700">
                  Same as Business Address
                </label>
              </div>
              {!formData.adminAddress.sameAsBusiness && <>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Administrative Address
                  </h4>
                  {renderAddressFields('adminAddress.', formData.adminAddress)}
                </>}
            </div>
          </div>}
        {currentStep === 3 && <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Account Security
            </h3>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username *
              </label>
              <input type="text" id="username" name="username" required minLength={5} maxLength={20} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={formData.username} onChange={handleInputChange} />
              <p className="mt-1 text-sm text-gray-500">5-20 characters long</p>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input type="password" id="password" name="password" required minLength={8} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={formData.password} onChange={handleInputChange} />
              <div className="mt-1 text-sm text-gray-500">
                <p>Password must:</p>
                <ul className="list-disc pl-5">
                  <li>Be at least 8 characters long</li>
                  <li>Include at least one uppercase letter</li>
                  <li>Include at least one number</li>
                  <li>Include at least one special character</li>
                </ul>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input type="password" id="confirmPassword" name="confirmPassword" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={formData.confirmPassword} onChange={handleInputChange} />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="enableTwoFactor" name="enableTwoFactor" className="w-4 h-4 text-[#008401] border-gray-300 rounded focus:ring-[#008401]" checked={formData.enableTwoFactor} onChange={handleInputChange} />
              <label htmlFor="enableTwoFactor" className="ml-2 text-sm text-gray-700">
                Enable Two-Factor Authentication (Recommended)
              </label>
            </div>
          </div>}
        {currentStep === 4 && <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Terms & Compliance
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input type="checkbox" id="acceptTerms" name="acceptTerms" required className="w-4 h-4 text-[#008401] border-gray-300 rounded focus:ring-[#008401]" checked={formData.acceptTerms} onChange={handleInputChange} />
                </div>
                <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
                  I accept the{' '}
                  <Link to="/terms" className="text-[#008401] hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and agree to comply with all applicable regulations *
                </label>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input type="checkbox" id="acceptDataProcessing" name="acceptDataProcessing" required className="w-4 h-4 text-[#008401] border-gray-300 rounded focus:ring-[#008401]" checked={formData.acceptDataProcessing} onChange={handleInputChange} />
                </div>
                <label htmlFor="acceptDataProcessing" className="ml-2 text-sm text-gray-700">
                  I agree to the processing of institutional and personal data
                  as described in the{' '}
                  <Link to="/privacy" className="text-[#008401] hover:underline">
                    Privacy Policy
                  </Link>{' '}
                  *
                </label>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input type="checkbox" id="acceptMarketing" name="acceptMarketing" className="w-4 h-4 text-[#008401] border-gray-300 rounded focus:ring-[#008401]" checked={formData.acceptMarketing} onChange={handleInputChange} />
                </div>
                <label htmlFor="acceptMarketing" className="ml-2 text-sm text-gray-700">
                  I would like to receive updates about new features and
                  improvements (Optional)
                </label>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                By submitting this registration, you acknowledge that your
                application will be reviewed by our system administrators. This
                process typically takes 2-3 business days. You will receive an
                email notification once your registration has been approved.
              </p>
            </div>
          </div>}
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {currentStep > 1 && <button type="button" onClick={() => setCurrentStep(prev => prev - 1)} className="px-6 py-3 text-[#07002F] bg-white border border-[#07002F] rounded-md hover:bg-gray-50">
              Previous
            </button>}
          {currentStep < steps.length ? <button type="button" onClick={() => setCurrentStep(prev => prev + 1)} className="px-6 py-3 text-white bg-[#07002F] rounded-md hover:bg-opacity-90 ml-auto">
              Continue
            </button> : <button type="submit" className="px-6 py-3 text-white bg-[#008401] rounded-md hover:bg-opacity-90 ml-auto">
              Submit Registration
            </button>}
        </div>
      </form>
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>All fields marked with * are required</p>
        <p className="mt-2">
          Registration requires approval from system administrators
        </p>
      </div>
    </div>;
};
export default RegistrationForm;