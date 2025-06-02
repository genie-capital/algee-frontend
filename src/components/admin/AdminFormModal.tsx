import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

interface AdminFormProps {
  admin?: any; // The admin object if editing, undefined if creating
  onSubmit: (adminData: any) => void;
  onCancel: () => void;
  title: string;
}

const AdminFormModal: React.FC<AdminFormProps> = ({ admin, onSubmit, onCancel, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || '',
        email: admin.email || '',
        password: '', // Don't populate password for security reasons
      });
    }
  }, [admin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
              label="Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
          </div>
          <div className="mb-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
          </div>
          <div className="mb-6">
            <Input
              label={admin ? "New Password (leave blank to keep current)" : "Password"}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required={!admin} // Only required for new admins
              fullWidth
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {admin ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminFormModal;