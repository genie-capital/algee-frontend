import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

interface CategoryMapping {
  categoryName: string;
  numericValue: number | string;
}

interface Variable {
  id: number;
  name: string;
  description: string;
  uniqueCode: number;
  is_required: boolean;
  mask: boolean;
  isUsedInFormula: boolean;
  min_value: number;
  max_value: number;
  responseType: 'int_float' | 'boolean' | 'categorical';
  normalisationFormula?: string;
  variableCategoryId: number;
  variableProportion: number;
  createdAt: string;
  updatedAt: string;
}

const VariableManagement: React.FC = () => {
  const { token } = useAuth();
  const [variables, setVariables] = useState<Variable[]>([]);
  const [categories, setCategories] = useState<VariableCategory[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVariable, setEditingVariable] = useState<Variable | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    uniqueCode: '',
    is_required: true,
    mask: false,
    isUsedInFormula: false,
    min_value: '',
    max_value: '',
    responseType: '',
    normalisationFormula: '',
    variableCategoryId: '',
    variableProportion: '',
    categoryMappings: [] as CategoryMapping[]
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categoryVariables, setCategoryVariables] = useState<Variable[]>([]);
  const [proportionInputs, setProportionInputs] = useState<{ [id: string]: string }>({});

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/variableCategory/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Fetched categories response:', data); 
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        setCategoriesError(data.message || 'Failed to fetch categories');
      }
    } catch (err: any) {
      setCategoriesError(err.message || 'Failed to fetch categories');
    } finally {
      setCategoriesLoading(false);
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

  useEffect(() => {
    if (openDialog && formData.variableCategoryId) {
      // Filter variables by category for both new and edit modes
      const filtered = variables.filter(
        v => v.variableCategoryId === Number(formData.variableCategoryId)
      );
      
      // For edit mode, exclude the current variable being edited from display
      const categoryVariablesForDisplay = editingVariable 
        ? filtered.filter(v => v.id !== editingVariable.id)
        : filtered;
      
      setCategoryVariables(categoryVariablesForDisplay);
      const initialInputs: { [id: string]: string } = {};
      
      // Initialize all existing variables in the category (including the one being edited)
      filtered.forEach((v: Variable) => {
        if (editingVariable && v.id === editingVariable.id) {
          initialInputs[v.id] = formData.variableProportion || '';
        } else {
          initialInputs[v.id] = String(v.variableProportion);
        }
      });
      
      // Add the new variable key
      if (!editingVariable) {
        initialInputs['new'] = formData.variableProportion || '';
      }
      
      setProportionInputs(initialInputs);
    } else if (!formData.variableCategoryId) {
      setCategoryVariables([]);
      setProportionInputs({ 
        [editingVariable ? 'editing' : 'new']: formData.variableProportion || '' 
      });
    }
  }, [formData.variableCategoryId, openDialog, editingVariable, variables]);

  const handleOpenDialog = (variable?: Variable) => {
    if (variable) {
      setEditingVariable(variable);
      setFormData({
        name: variable.name,
        description: variable.description,
        uniqueCode: String(variable.uniqueCode),
        is_required: variable.is_required,
        mask: variable.mask,
        isUsedInFormula: variable.isUsedInFormula,
        min_value: String(variable.min_value),
        max_value: String(variable.max_value),
        responseType: variable.responseType,
        normalisationFormula: variable.normalisationFormula || '',
        variableCategoryId: String(variable.variableCategoryId),
        variableProportion: String(variable.variableProportion),
        categoryMappings: [] // Note: categoryMappings are not fetched for edit yet
      });
    } else {
      setEditingVariable(null);
      setFormData({
        name: '',
        description: '',
        uniqueCode: '',
        is_required: true,
        mask: false,
        isUsedInFormula: false,
        min_value: '',
        max_value: '',
        responseType: '',
        normalisationFormula: '',
        variableCategoryId: '',
        variableProportion: '',
        categoryMappings: []
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
      uniqueCode: '',
      is_required: true,
      mask: false,
      isUsedInFormula: false,
      min_value: '',
      max_value: '',
      responseType: '',
      normalisationFormula: '',
      variableCategoryId: '',
      variableProportion: '',
      categoryMappings: []
    });
  };

  const handleAddCategoryMapping = () => {
    setFormData(prev => ({
      ...prev,
      categoryMappings: [...prev.categoryMappings, { categoryName: '', numericValue: '' }]
    }));
  };

  const handleRemoveCategoryMapping = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categoryMappings: prev.categoryMappings.filter((_, i) => i !== index)
    }));
  };

  const handleCategoryMappingChange = (index: number, field: 'categoryName' | 'numericValue', value: string) => {
    const newMappings = [...formData.categoryMappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setFormData(prev => ({ ...prev, categoryMappings: newMappings }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Apply proportion validation for both creation and editing when there are other variables in the category
    if (categoryVariables.length > 0) {
      // Get all variables in the category including the one being edited
      const allCategoryVariables = variables.filter(
        v => v.variableCategoryId === Number(formData.variableCategoryId)
      );
      
      // Calculate total including all variables
      let total = 0;
      allCategoryVariables.forEach(v => {
        if (editingVariable && v.id === editingVariable.id) {
          total += Number(proportionInputs[v.id] || formData.variableProportion || 0);
        } else {
          total += Number(proportionInputs[v.id] || v.variableProportion || 0);
        }
      });
      
      // Add the new variable if creating
      if (!editingVariable) {
        total += Number(proportionInputs['new'] || formData.variableProportion || 0);
      }
      
      if (total !== 100) {
        setError('Total proportion for all variables in this category must be exactly 100%');
        return;
      }
    }

    // Validate that min_value is not empty and is a valid number
    if (formData.min_value === '') {
      setError('Minimum value is required');
      return;
    }

    const minValue = parseFloat(formData.min_value);
    if (isNaN(minValue) || minValue < 0) {
      setError('Minimum value must be a valid number greater than or equal to 0');
      return;
    }

    try {
      const url = editingVariable
        ? `${API_BASE_URL}/variable/update/${editingVariable.id}`
        : `${API_BASE_URL}/variable/create`;
      
      const body: any = {
        name: formData.name,
        description: formData.description,
        uniqueCode: parseInt(formData.uniqueCode),
        is_required: formData.is_required,
        mask: formData.mask,
        isUsedInFormula: formData.isUsedInFormula,
        min_value: parseFloat(formData.min_value),
        max_value: parseFloat(formData.max_value),
        responseType: formData.responseType,
        variableCategoryId: parseInt(formData.variableCategoryId),
        variableProportion: parseFloat(proportionInputs[editingVariable ? editingVariable.id : 'new'] || formData.variableProportion),
      };

      console.log('Request body being sent to server:', body);

      if (formData.responseType === 'int_float') {
        body.normalisationFormula = formData.normalisationFormula;
      }

      if (formData.responseType === 'categorical') {
        body.categoryMappings = formData.categoryMappings.map(m => ({
          ...m,
          numericValue: parseFloat(String(m.numericValue))
        }));
      }

      // Add redistributeProportions if there are existing variables in the category
      if (categoryVariables.length > 0) {
        // Get all variables in the category for redistribution
        const allCategoryVariables = variables.filter(
          v => v.variableCategoryId === Number(formData.variableCategoryId)
        );
        
        body.redistributeProportions = allCategoryVariables.map(v => ({
          variableId: v.id,
          proportion: parseFloat(proportionInputs[v.id] || String(v.variableProportion) || '0')
        }));
        
        console.log('Redistributing proportions for variables:', body.redistributeProportions);
      }

      const response = await fetch(url, {
        method: editingVariable ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log('Server response:', data);
      console.log('Response status:', response.status);
      
      if (data.success) {
        setSuccess(editingVariable ? 'Variable updated successfully' : 'Variable created successfully');
        fetchVariables();
        handleCloseDialog();
      } else {
        setError(data.message || 'Server error occurred');
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
                    <TableCell>Category</TableCell>
                    <TableCell>Response Type</TableCell>
                    <TableCell>Masked</TableCell>
                    <TableCell>Unique Code</TableCell>
                    <TableCell>Proportion</TableCell>
                    <TableCell>Min Value</TableCell>
                    <TableCell>Max Value</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {variables.map((variable) => (
                    <TableRow key={variable.id}>
                      <TableCell>{variable.name}</TableCell>
                      <TableCell>{getCategoryName(variable.variableCategoryId)}</TableCell>
                      <TableCell>{variable.responseType}</TableCell>
                      <TableCell>{variable.mask ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{variable.uniqueCode}</TableCell>
                      <TableCell>{variable.variableProportion}</TableCell>
                      <TableCell>{variable.min_value}</TableCell>
                      <TableCell>{variable.max_value}</TableCell>
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                  <Box sx={{ p: 1, width: { xs: '100%', sm: '50%' } }}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </Box>
                  <Box sx={{ p: 1, width: { xs: '100%', sm: '50%' } }}>
                    <TextField
                      fullWidth
                      label="Unique Code"
                      type="number"
                      value={formData.uniqueCode}
                      onChange={(e) => setFormData({ ...formData, uniqueCode: e.target.value })}
                      required
                    />
                  </Box>
                  <Box sx={{ p: 1, width: '100%' }}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      multiline
                      rows={3}
                    />
                  </Box>
                  <Box sx={{ p: 1, width: { xs: '100%', sm: '50%' } }}>
                    <FormControl fullWidth required>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={formData.variableCategoryId}
                        label="Category"
                        onChange={(e) => setFormData({ ...formData, variableCategoryId: e.target.value })}
                        disabled={categoriesLoading}
                      >
                        {categoriesLoading && <MenuItem disabled>Loading...</MenuItem>}
                        {categoriesError && <MenuItem disabled>Error loading categories</MenuItem>}
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ p: 1, width: { xs: '100%', sm: '50%' } }}>
                    <FormControl fullWidth required>
                      <InputLabel>Response Type</InputLabel>
                      <Select
                        value={formData.responseType}
                        label="Response Type"
                        onChange={(e) => setFormData({ ...formData, responseType: e.target.value })}
                      >
                        <MenuItem value="int_float">Integer/Float</MenuItem>
                        <MenuItem value="boolean">Boolean</MenuItem>
                        <MenuItem value="categorical">Categorical</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ p: 1, width: { xs: '100%', sm: '50%' } }}>
                    <TextField
                      fullWidth
                      label="Min Value"
                      type="number"
                      value={formData.min_value}
                      onChange={(e) => setFormData({ ...formData, min_value: e.target.value })}
                      required
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                  <Box sx={{ p: 1, width: { xs: '100%', sm: '50%' } }}>
                    <TextField
                      fullWidth
                      label="Max Value"
                      type="number"
                      value={formData.max_value}
                      onChange={(e) => setFormData({ ...formData, max_value: e.target.value })}
                      required
                    />
                  </Box>
                  <Box sx={{ p: 1, width: { xs: '100%', sm: '50%' } }}>
                     <TextField
                      fullWidth
                      label="Variable Proportion (%)"
                      type="number"
                      value={formData.variableProportion}
                      onChange={(e) => setFormData({ ...formData, variableProportion: e.target.value })}
                      required
                      inputProps={{ min: 0, max: 100, step: 0.01 }}
                    />
                  </Box>
                  <Box sx={{ p: 1, width: { xs: '100%', sm: '50%' } }}>
                    <FormControl fullWidth>
                      <InputLabel>Is Required?</InputLabel>
                      <Select
                        value={String(formData.is_required)}
                        label="Is Required?"
                        onChange={(e) => setFormData({ ...formData, is_required: e.target.value === 'true' })}
                      >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ p: 1, width: { xs: '100%', sm: '50%' } }}>
                    <FormControl fullWidth>
                      <InputLabel>Masked</InputLabel>
                      <Select
                        value={String(formData.mask)}
                        label="Masked"
                        onChange={(e) => setFormData({ ...formData, mask: e.target.value === 'true' })}
                      >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ p: 1, width: { xs: '100%', sm: '50%' } }}>
                    <FormControl fullWidth>
                      <InputLabel>Used In Formula?</InputLabel>
                      <Select
                        value={String(formData.isUsedInFormula)}
                        label="Used In Formula?"
                        onChange={(e) => setFormData({ ...formData, isUsedInFormula: e.target.value === 'true' })}
                      >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {formData.responseType === 'int_float' && (
                    <Box sx={{ p: 1, width: '100%' }}>
                      <TextField
                        fullWidth
                        label="Normalization Formula"
                        value={formData.normalisationFormula}
                        onChange={(e) => setFormData({ ...formData, normalisationFormula: e.target.value })}
                        helperText="e.g. value / max_value"
                      />
                    </Box>
                  )}

                  {formData.responseType === 'categorical' && (
                    <Box sx={{ p: 1, width: '100%' }}>
                      <Typography variant="h6" gutterBottom>Category Mappings</Typography>
                      {formData.categoryMappings.map((mapping, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1, mx: -1 }}>
                          <Box sx={{ width: '41.666%', p: 1 }}>
                            <TextField
                              fullWidth
                              label="Category Name"
                              value={mapping.categoryName}
                              onChange={(e) => handleCategoryMappingChange(index, 'categoryName', e.target.value)}
                            />
                          </Box>
                          <Box sx={{ width: '41.666%', p: 1 }}>
                            <TextField
                              fullWidth
                              label="Numeric Value"
                              type="number"
                              value={mapping.numericValue}
                              onChange={(e) => handleCategoryMappingChange(index, 'numericValue', e.target.value)}
                            />
                          </Box>
                          <Box sx={{ width: '16.666%', p: 1 }}>
                            <IconButton onClick={() => handleRemoveCategoryMapping(index)}>
                              <TrashIcon size={20} />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                      <Button onClick={handleAddCategoryMapping} startIcon={<PlusIcon size={16}/>}>
                        Add Mapping
                      </Button>
                    </Box>
                  )}

                  {/* Proportion Redistribution Table for Variable Creation/Editing */}
                  {categoryVariables.length > 0 && (
                    <Box sx={{ p: 1, width: '100%' }}>
                      <Typography variant="h6" gutterBottom>Set Proportions for Variables in this Category</Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Variable Name</TableCell>
                              <TableCell>Proportion (%)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {categoryVariables.map((v) => (
                              <TableRow key={v.id}>
                                <TableCell>{v.name}</TableCell>
                                <TableCell>
                                  <TextField
                                    type="number"
                                    value={proportionInputs[v.id] || ''}
                                    onChange={e => {
                                      const value = e.target.value;
                                      setProportionInputs(prev => ({ ...prev, [v.id]: value }));
                                    }}
                                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                                    size="small"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell>
                                <b>{editingVariable ? 'Editing Variable' : 'New Variable'}</b>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  value={proportionInputs[editingVariable ? editingVariable.id : 'new'] || ''}
                                  onChange={e => {
                                    const value = e.target.value;
                                    const key = editingVariable ? editingVariable.id : 'new';
                                    setProportionInputs(prev => ({ ...prev, [key]: value }));
                                    setFormData(prev => ({ ...prev, variableProportion: value }));
                                  }}
                                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                                  size="small"
                                  required
                                />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Typography variant="body2" color={
                        (Object.values(proportionInputs).reduce((sum, v) => sum + Number(v || 0), 0) !== 100)
                          ? 'error'
                          : 'success.main'
                      }>
                        Total: {Object.values(proportionInputs).reduce((sum, v) => sum + Number(v || 0), 0)}%
                      </Typography>
                    </Box>
                  )}
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