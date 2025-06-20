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
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AdminNavbar from '../../components/admin/AdminNavbar';
import BackToDashboard from '../../components/admin/BackToDashboard';
import { API_BASE_URL } from '../../config';

interface VariableCategory {
  id: number;
  name: string;
  description: string;
  creditLimitWeight: number;
  interestRateWeight: number;
}

interface Variable {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  responseType: string;
  isMasked: boolean;
  createdAt: string;
  updatedAt: string;
}

const VariableManagement: React.FC = () => {
  const { token } = useAuth();
  const [variables, setVariables] = useState<Variable[]>([]);
  const [categories, setCategories] = useState<VariableCategory[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVariable, setEditingVariable] = useState<Variable | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    responseType: '',
    isMasked: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchCategories = async () => {
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

  const fetchVariables = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/variable/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setVariables(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch variables');
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchVariables();
  }, [token]);

  const handleOpenDialog = (variable?: Variable) => {
    if (variable) {
      setEditingVariable(variable);
      setFormData({
        name: variable.name,
        description: variable.description,
        categoryId: variable.categoryId.toString(),
        responseType: variable.responseType,
        isMasked: variable.isMasked
      });
    } else {
      setEditingVariable(null);
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        responseType: '',
        isMasked: false
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVariable(null);
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      responseType: '',
      isMasked: false
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingVariable
        ? `${API_BASE_URL}/variable/update/${editingVariable.id}`
        : `${API_BASE_URL}/variable/create`;
      
      const response = await fetch(url, {
        method: editingVariable ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          categoryId: parseInt(formData.categoryId)
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(editingVariable ? 'Variable updated successfully' : 'Variable created successfully');
        fetchVariables();
        handleCloseDialog();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to save variable');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this variable?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/variable/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Variable deleted successfully');
        fetchVariables();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete variable');
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
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
                Variable Management
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Configure system-wide variables and their categories
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button
                variant="contained"
                startIcon={<PlusIcon size={20} />}
                onClick={() => handleOpenDialog()}
                className="bg-[#008401] hover:bg-[#008401]/90"
              >
                Add Variable
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
                    <TableCell>Category</TableCell>
                    <TableCell>Response Type</TableCell>
                    <TableCell>Masked</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {variables.map((variable) => (
                    <TableRow key={variable.id}>
                      <TableCell>{variable.name}</TableCell>
                      <TableCell>{variable.description}</TableCell>
                      <TableCell>{getCategoryName(variable.categoryId)}</TableCell>
                      <TableCell>{variable.responseType}</TableCell>
                      <TableCell>{variable.isMasked ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenDialog(variable)}>
                          <PencilIcon size={20} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(variable.id)}>
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
              {editingVariable ? 'Edit Variable' : 'Add New Variable'}
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
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.categoryId}
                      label="Category"
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth required>
                    <InputLabel>Response Type</InputLabel>
                    <Select
                      value={formData.responseType}
                      label="Response Type"
                      onChange={(e) => setFormData({ ...formData, responseType: e.target.value })}
                    >
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="boolean">Boolean</MenuItem>
                      <MenuItem value="date">Date</MenuItem>
                      <MenuItem value="select">Select</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Masked</InputLabel>
                    <Select
                      value={formData.isMasked.toString()}
                      label="Masked"
                      onChange={(e) => setFormData({ ...formData, isMasked: e.target.value === 'true' })}
                    >
                      <MenuItem value="true">Yes</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained" className="bg-[#008401] hover:bg-[#008401]/90">
                  {editingVariable ? 'Update' : 'Create'}
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

export default VariableManagement; 