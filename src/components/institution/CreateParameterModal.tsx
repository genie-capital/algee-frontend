import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface CreateParameterModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateParameterModal: React.FC<CreateParameterModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    recommendedRange: '',
    impact: '',
    uniqueCode: '',
    isActive: 'true',
    isRequired: 'false',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      uniqueCode: Number(formData.uniqueCode),
      isActive: formData.isActive === 'true',
      isRequired: formData.isRequired === 'true',
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Parameter</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="name"
              label="Parameter Name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              name="recommendedRange"
              label="Recommended Range"
              value={formData.recommendedRange}
              onChange={handleChange}
              required
              fullWidth
              helperText="Example: 0-100, 1000-5000, etc."
            />

            <FormControl fullWidth required>
              <InputLabel>Impact</InputLabel>
              <Select
                name="impact"
                value={formData.impact}
                onChange={handleChange}
                label="Impact"
              >
                <MenuItem value="positive">Positive</MenuItem>
                <MenuItem value="negative">Negative</MenuItem>
                <MenuItem value="neutral">Neutral</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="uniqueCode"
              label="Unique Code"
              value={formData.uniqueCode}
              onChange={handleChange}
              required
              fullWidth
              helperText="Enter a unique code for this parameter (e.g., 1001)"
              type="number"
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="isActive"
                value={formData.isActive}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Required</InputLabel>
              <Select
                name="isRequired"
                value={formData.isRequired}
                onChange={handleChange}
                label="Required"
              >
                <MenuItem value="true">Required</MenuItem>
                <MenuItem value="false">Optional</MenuItem>
              </Select>
            </FormControl>

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateParameterModal; 