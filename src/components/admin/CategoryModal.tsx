import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { Category } from '../../services/parameterManagementService';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  category?: Category;
  isEditing?: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  onClose,
  onSubmit,
  category,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    creditLimitWeight: 0,
    interestRateWeight: 0,
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    creditLimitWeight: '',
    interestRateWeight: '',
  });

  useEffect(() => {
    if (category && isEditing) {
      setFormData({
        name: category.name,
        description: category.description,
        creditLimitWeight: category.creditLimitWeight,
        interestRateWeight: category.interestRateWeight,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        creditLimitWeight: 0,
        interestRateWeight: 0,
      });
    }
  }, [category, isEditing]);

  const validateForm = () => {
    const newErrors = {
      name: '',
      description: '',
      creditLimitWeight: '',
      interestRateWeight: '',
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (formData.creditLimitWeight < 0 || formData.creditLimitWeight > 1) {
      newErrors.creditLimitWeight = 'Credit limit weight must be between 0 and 1';
      isValid = false;
    }

    if (formData.interestRateWeight < 0 || formData.interestRateWeight > 1) {
      newErrors.interestRateWeight = 'Interest rate weight must be between 0 and 1';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('Weight') ? parseFloat(value) || 0 : value,
    }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Category' : 'Create New Category'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
              fullWidth
            />

            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              required
              fullWidth
              multiline
              rows={3}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="creditLimitWeight"
                label="Credit Limit Weight"
                type="number"
                value={formData.creditLimitWeight}
                onChange={handleChange}
                error={!!errors.creditLimitWeight}
                helperText={errors.creditLimitWeight}
                required
                fullWidth
                inputProps={{ step: 0.1, min: 0, max: 1 }}
              />

              <TextField
                name="interestRateWeight"
                label="Interest Rate Weight"
                type="number"
                value={formData.interestRateWeight}
                onChange={handleChange}
                error={!!errors.interestRateWeight}
                helperText={errors.interestRateWeight}
                required
                fullWidth
                inputProps={{ step: 0.1, min: 0, max: 1 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryModal; 