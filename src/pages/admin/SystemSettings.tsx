import React, { useState } from 'react';
import { SaveIcon } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
const SystemSettings = () => {
  const [formData, setFormData] = useState({
    systemName: 'Credit Scoring System',
    adminEmail: 'admin@creditsystem.com',
    defaultCurrency: 'USD',
    dataRetentionDays: '365',
    enableNotifications: true,
    enableAuditLogging: true,
    enableBatchProcessing: true,
    apiEndpoint: 'https://api.creditsystem.com/v1',
    apiKey: '••••••••••••••••••••'
  });
  const [isEditing, setIsEditing] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would save the settings to the server
    setIsEditing(false);
  };
  const handleReset = () => {
    // In a real application, this would reset to the last saved values
    setIsEditing(false);
  };
  return <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            System Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure global system parameters and behavior
          </p>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              General Settings
            </h3>
            {!isEditing ? <Button onClick={() => setIsEditing(true)}>Edit Settings</Button> : <div className="flex space-x-2">
                <Button variant="outline" onClick={handleReset}>
                  <div className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <Button onClick={handleSubmit}>
                  <SaveIcon className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              </div>}
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <Input label="System Name" type="text" name="systemName" id="systemName" value={formData.systemName} onChange={handleChange} disabled={!isEditing} required fullWidth />
                  </div>
                  <div className="sm:col-span-3">
                    <Input label="Administrator Email" type="email" name="adminEmail" id="adminEmail" value={formData.adminEmail} onChange={handleChange} disabled={!isEditing} required fullWidth />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                      Default Currency
                    </label>
                    <select id="defaultCurrency" name="defaultCurrency" value={formData.defaultCurrency} onChange={handleChange} disabled={!isEditing} className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#008401] focus:border-[#008401] sm:text-sm" required>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <Input label="Data Retention Period (days)" type="number" name="dataRetentionDays" id="dataRetentionDays" value={formData.dataRetentionDays} onChange={handleChange} disabled={!isEditing} required fullWidth />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  System Features
                </h4>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <div className="flex items-center">
                      <input id="enableNotifications" name="enableNotifications" type="checkbox" checked={formData.enableNotifications} onChange={handleChange} disabled={!isEditing} className="h-4 w-4 text-[#008401] focus:ring-[#008401] border-gray-300 rounded" />
                      <label htmlFor="enableNotifications" className="ml-2 block text-sm text-gray-900">
                        Enable Email Notifications
                      </label>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-center">
                      <input id="enableAuditLogging" name="enableAuditLogging" type="checkbox" checked={formData.enableAuditLogging} onChange={handleChange} disabled={!isEditing} className="h-4 w-4 text-[#008401] focus:ring-[#008401] border-gray-300 rounded" />
                      <label htmlFor="enableAuditLogging" className="ml-2 block text-sm text-gray-900">
                        Enable Audit Logging
                      </label>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-center">
                      <input id="enableBatchProcessing" name="enableBatchProcessing" type="checkbox" checked={formData.enableBatchProcessing} onChange={handleChange} disabled={!isEditing} className="h-4 w-4 text-[#008401] focus:ring-[#008401] border-gray-300 rounded" />
                      <label htmlFor="enableBatchProcessing" className="ml-2 block text-sm text-gray-900">
                        Enable Batch Processing
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  API Integration
                </h4>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <Input label="API Endpoint" type="text" name="apiEndpoint" id="apiEndpoint" value={formData.apiEndpoint} onChange={handleChange} disabled={!isEditing} fullWidth />
                  </div>
                  <div className="sm:col-span-4">
                    <Input label="API Key" type="password" name="apiKey" id="apiKey" value={formData.apiKey} onChange={handleChange} disabled={!isEditing} fullWidth />
                    {isEditing && <p className="mt-1 text-xs text-gray-500">
                        Leave blank to keep the current API key
                      </p>}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            System Information
          </h3>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Version</dt>
              <dd className="mt-1 text-sm text-gray-900">2.5.3</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Last Updated
              </dt>
              <dd className="mt-1 text-sm text-gray-900">October 15, 2023</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Database Status
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Healthy
                </span>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Storage Usage
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#008401] h-2.5 rounded-full" style={{
                    width: '45%'
                  }}></div>
                  </div>
                  <span className="ml-2">45%</span>
                </div>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Active Users
              </dt>
              <dd className="mt-1 text-sm text-gray-900">124</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Total Assessments
              </dt>
              <dd className="mt-1 text-sm text-gray-900">15,482</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>;
};
export default SystemSettings;