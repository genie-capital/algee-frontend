import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

interface ParameterFormProps {
  parameter?: any; // The parameter object if editing, undefined if creating
  onSubmit: (paramData: any) => void;
  onCancel: () => void;
  title: string;
}

const ParameterFormModal: React.FC<ParameterFormProps> = ({ parameter, onSubmit, onCancel, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    required: false,
    enabled: true,
  });

  useEffect(() => {
    if (parameter) {
      setFormData({
        name: parameter.name || '',
        description: parameter.description || '',
        required: parameter.is_required || false,
        enabled: parameter.is_active || true,
      });
    }
  }, [parameter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Parameter Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              title="Parameter description"
              placeholder="Enter parameter description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#07002F] focus:border-[#07002F]"
              rows={3}
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              id="required"
              name="required"
              type="checkbox"
              checked={formData.required}
              onChange={handleChange}
              className="h-4 w-4 text-[#07002F] focus:ring-[#07002F] border-gray-300 rounded"
            />
            <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
              Required Parameter
            </label>
          </div>
          <div className="mb-6 flex items-center">
            <input
              id="enabled"
              name="enabled"
              type="checkbox"
              checked={formData.enabled}
              onChange={handleChange}
              className="h-4 w-4 text-[#07002F] focus:ring-[#07002F] border-gray-300 rounded"
            />
            <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {parameter ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParameterFormModal;