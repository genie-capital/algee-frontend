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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface InstitutionParameter {
  id: number;
  name: string;
  description: string;
  recommendedRange: string;
  impact: string;
  normalizationFormula: string;
  uniqueCode: string;
  isActive: boolean;
}

interface EditParameterModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InstitutionParameter) => void;
  parameter: InstitutionParameter;
}

const EditParameterModal: React.FC<EditParameterModalProps> = ({
  open,
  onClose,
  onSubmit,
  parameter,
}) => {
  const [formData, setFormData] = useState<InstitutionParameter>(parameter);

  useEffect(() => {
    setFormData(parameter);
  }, [parameter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Parameter</DialogTitle>
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
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="normalizationFormula"
              label="Normalization Formula"
              value={formData.normalizationFormula}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={3}
              helperText="Enter formula following the normalization guide (e.g., =value/max_value)"
            />

            <TextField
              name="uniqueCode"
              label="Unique Code"
              value={formData.uniqueCode}
              onChange={handleChange}
              required
              fullWidth
              disabled
              helperText="Unique code cannot be changed"
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

            <Typography variant="caption" color="textSecondary">
              Note: Please refer to the normalization formulas guide for proper formula syntax and examples.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditParameterModal; 