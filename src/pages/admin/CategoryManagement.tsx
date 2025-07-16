import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AdminNavbar from '../../components/admin/AdminNavbar';
import BackToDashboard from '../../components/admin/BackToDashboard';
import { API_BASE_URL } from '../../config/api';

interface VariableCategory {
  id: number;
  name: string;
  description: string;
  creditLimitWeight: number;
  interestRateWeight: number;
  createdAt: string;
  updatedAt: string;
}

const CategoryManagement: React.FC = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<VariableCategory[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<VariableCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    creditLimitWeight: '' as string | number,
    interestRateWeight: '' as string | number
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchCategories = async () => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/variableCategory/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  const handleOpenDialog = (category?: VariableCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        creditLimitWeight: category.creditLimitWeight,
        interestRateWeight: category.interestRateWeight
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        creditLimitWeight: '',
        interestRateWeight: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      creditLimitWeight: '',
      interestRateWeight: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Authentication required');
      return;
    }

    // Ensure weights are numbers, defaulting to 0 if empty
    const creditLimitWeight = formData.creditLimitWeight === '' ? 0 : Number(formData.creditLimitWeight);
    const interestRateWeight = formData.interestRateWeight === '' ? 0 : Number(formData.interestRateWeight);

    // Validate that weights are within range
    if (
      creditLimitWeight < 0 ||
      creditLimitWeight > 100 ||
      interestRateWeight < 0 ||
      interestRateWeight > 100
    ) {
      setError('Weights must be between 0 and 100.');
      return;
    }

    const payload = {
      ...formData,
      creditLimitWeight,
      interestRateWeight,
    };

    try {
      const url = editingCategory
        ? `${API_BASE_URL}/variableCategory/update/${editingCategory.id}`
        : `${API_BASE_URL}/variableCategory/create`;
      
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(editingCategory ? 'Category updated successfully' : 'Category created successfully');
        setOpenDialog(false);
        fetchCategories();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/variableCategory/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setSuccess('Category deleted successfully');
          fetchCategories();
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to delete category');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <BackToDashboard />
          
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Category Management
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage categories for system variables
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button
                variant="contained"
                startIcon={<PlusIcon size={20} />}
                onClick={() => handleOpenDialog()}
                className="bg-[#008401] hover:bg-[#008401]/90"
              >
                Add Category
              </Button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Credit Limit Weight</TableCell>
                    <TableCell>Interest Rate Weight</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>{category.creditLimitWeight}</TableCell>
                      <TableCell>{category.interestRateWeight}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenDialog(category)}>
                          <PencilIcon size={20} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(category.id.toString())}>
                          <TrashIcon size={20} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    multiline
                    rows={3}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Credit Limit Weight"
                      type="number"
                      value={formData.creditLimitWeight === '' ? '' : String(formData.creditLimitWeight)}
                      onChange={(e) => setFormData({ ...formData, creditLimitWeight: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                      required
                      inputProps={{ step: 1, min: 0, max: 100 }}
                    />
                    <TextField
                      fullWidth
                      label="Interest Rate Weight"
                      type="number"
                      value={formData.interestRateWeight === '' ? '' : String(formData.interestRateWeight)}
                      onChange={(e) => setFormData({ ...formData, interestRateWeight: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                      required
                      inputProps={{ step: 1, min: 0, max: 100 }}
                    />
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" className="bg-[#008401] hover:bg-[#008401]/90">
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError(null)}
          >
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Snackbar>

          <Snackbar
            open={!!success}
            autoHideDuration={6000}
            onClose={() => setSuccess(null)}
          >
            <Alert severity="success" onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          </Snackbar>
        </div>
      </main>
    </div>
  );
};

export default CategoryManagement; 