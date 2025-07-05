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
  CircularProgress,
  Alert,
} from '@mui/material';
import { updateParameter, updateInstitutionParameterByAdmin } from '../../services/parameterService';

interface InstitutionParameter {
  id: number;
  name: string;
  description: string;
  recommendedRange: string;
  impact: string;
  uniqueCode: string;
  isActive: boolean;
}

interface EditParameterModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InstitutionParameter & { institutionValue?: number }) => void;
  parameter: InstitutionParameter;
  showInstitutionValueField?: boolean;
  editMode?: 'admin' | 'parameter';
  institutionId?: number;
}

const EditParameterModal: React.FC<EditParameterModalProps> = ({
  open,
  onClose,
  onSubmit,
  parameter,
  showInstitutionValueField = false,
  editMode = 'parameter',
  institutionId,
}) => {
  const [formData, setFormData] = useState<InstitutionParameter & { institutionValue?: number }>(parameter);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(parameter);
    setError(null);
    setValidationErrors({});
  }, [parameter]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Parameter name is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.recommendedRange.trim()) {
      errors.recommendedRange = 'Recommended range is required';
    }

    if (!formData.impact) {
      errors.impact = 'Impact level is required';
    }

    if (showInstitutionValueField && (formData.institutionValue === undefined || formData.institutionValue === null)) {
      errors.institutionValue = 'Institution value is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name as string]) {
      setValidationErrors(prev => ({
        ...prev,
        [name as string]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call the parent's onSubmit handler which will handle the API call
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update parameter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      setValidationErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editMode === 'admin' ? 'Edit Institution Parameter' : 'Edit Parameter'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="name"
              label="Parameter Name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              error={!!validationErrors.name}
              helperText={validationErrors.name}
              disabled={loading}
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
              error={!!validationErrors.description}
              helperText={validationErrors.description}
              disabled={loading}
            />

            <TextField
              name="recommendedRange"
              label="Recommended Range"
              value={formData.recommendedRange}
              onChange={handleChange}
              required
              fullWidth
              helperText="Example: 0-100, 1000-5000, etc."
              error={!!validationErrors.recommendedRange}
              disabled={loading}
            />

            <FormControl fullWidth required error={!!validationErrors.impact}>
              <InputLabel>Impact</InputLabel>
              <Select
                name="impact"
                value={formData.impact}
                onChange={handleChange}
                label="Impact"
                disabled={loading}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
              {validationErrors.impact && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {validationErrors.impact}
                </Typography>
              )}
            </FormControl>

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
                disabled={loading}
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>

            {showInstitutionValueField && (
              <TextField
                name="institutionValue"
                label="Institution Value"
                type="number"
                value={formData.institutionValue ?? ''}
                onChange={handleChange}
                fullWidth
                required
                helperText="Value set by the institution. Editable by admin."
                error={!!validationErrors.institutionValue}
                disabled={loading}
              />
            )}
            
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditParameterModal; 