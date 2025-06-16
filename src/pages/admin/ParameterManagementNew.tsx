import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import BackToDashboard from '../../components/admin/BackToDashboard';
import CreateParameterModal from '../../components/institution/CreateParameterModal';
import api from '../../services/api';

interface Category {
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
  uniqueCode: string;
  isRequired: boolean;
  mask: boolean;
  isUsedInFormula: boolean;
  minValue: number;
  maxValue: number;
  responseType: 'int_float' | 'boolean' | 'categorical';
  normalizationFormula: string;
  variableCategoryId: number;
  variableProportion: number;
}

interface Parameter {
  id: number;
  name: string;
  description: string;
  recommendedRange: string;
  impact: 'positive' | 'negative' | 'neutral';
  normalizationFormula: string;
  uniqueCode: string;
  isActive: boolean;
  isInstitutionSpecific: boolean;
  institutionValue?: number;
}

const ParameterManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);
  const [isParameterModalOpen, setIsParameterModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | Variable | Parameter | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, variablesRes, parametersRes] = await Promise.all([
        api.get('/api/v1/variable-categories'),
        api.get('/api/v1/variables'),
        api.get('/api/v1/parameters'),
      ]);

      setCategories(categoriesRes.data);
      setVariables(variablesRes.data);
      setParameters(parametersRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (categoryData: Partial<Category>) => {
    try {
      const response = await api.post('/api/v1/variable-categories', categoryData);
      setCategories([...categories, response.data]);
      setIsCategoryModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Category created successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to create category',
        severity: 'error',
      });
    }
  };

  const handleEditCategory = async (categoryData: Partial<Category>) => {
    if (!editingItem) return;
    try {
      const response = await api.put(`/api/v1/variable-categories/${editingItem.id}`, categoryData);
      setCategories(categories.map(cat => cat.id === editingItem.id ? response.data : cat));
      setIsCategoryModalOpen(false);
      setEditingItem(null);
      setSnackbar({
        open: true,
        message: 'Category updated successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update category',
        severity: 'error',
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await api.delete(`/api/v1/variable-categories/${id}`);
      setCategories(categories.filter(cat => cat.id !== id));
      setSnackbar({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete category',
        severity: 'error',
      });
    }
  };

  const handleCreateVariable = async (variableData: Partial<Variable>) => {
    try {
      const response = await api.post('/api/v1/variables', variableData);
      setVariables([...variables, response.data]);
      setIsVariableModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Variable created successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to create variable',
        severity: 'error',
      });
    }
  };

  const handleEditVariable = async (variableData: Partial<Variable>) => {
    if (!editingItem) return;
    try {
      const response = await api.put(`/api/v1/variables/${editingItem.id}`, variableData);
      setVariables(variables.map(var_ => var_.id === editingItem.id ? response.data : var_));
      setIsVariableModalOpen(false);
      setEditingItem(null);
      setSnackbar({
        open: true,
        message: 'Variable updated successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update variable',
        severity: 'error',
      });
    }
  };

  const handleDeleteVariable = async (id: number) => {
    try {
      await api.delete(`/api/v1/variables/${id}`);
      setVariables(variables.filter(var_ => var_.id !== id));
      setSnackbar({
        open: true,
        message: 'Variable deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete variable',
        severity: 'error',
      });
    }
  };

  const handleCreateParameter = async (parameterData: Partial<Parameter>) => {
    try {
      const response = await api.post('/api/v1/parameters', parameterData);
      setParameters([...parameters, response.data]);
      setIsParameterModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Parameter created successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to create parameter',
        severity: 'error',
      });
    }
  };

  const handleEditParameter = async (parameterData: Partial<Parameter>) => {
    if (!editingItem) return;
    try {
      const response = await api.put(`/api/v1/parameters/${editingItem.id}`, parameterData);
      setParameters(parameters.map(param => param.id === editingItem.id ? response.data : param));
      setIsParameterModalOpen(false);
      setEditingItem(null);
      setSnackbar({
        open: true,
        message: 'Parameter updated successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update parameter',
        severity: 'error',
      });
    }
  };

  const handleDeleteParameter = async (id: number) => {
    try {
      await api.delete(`/api/v1/parameters/${id}`);
      setParameters(parameters.filter(param => param.id !== id));
      setSnackbar({
        open: true,
        message: 'Parameter deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete parameter',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminNavbar />
      <Box sx={{ flex: 1, bgcolor: 'background.default', p: 3 }}>
        <BackToDashboard />
        <Card sx={{ mt: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Categories" />
            <Tab label="Variables" />
            <Tab label="Parameters" />
          </Tabs>

          <Box sx={{ p: 2 }}>
            {activeTab === 0 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={() => {
                      setEditingItem(null);
                      setIsCategoryModalOpen(true);
                    }}
                  >
                    Add Category
                  </Button>
                </Box>
                <TableContainer component={Paper}>
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
                          <TableCell>{category.creditLimitWeight}%</TableCell>
                          <TableCell>{category.interestRateWeight}%</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setEditingItem(category);
                                setIsCategoryModalOpen(true);
                              }}
                            >
                              <Pencil size={16} />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteCategory(category.id)}>
                              <Trash2 size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {activeTab === 1 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={() => {
                      setEditingItem(null);
                      setIsVariableModalOpen(true);
                    }}
                  >
                    Add Variable
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Category</TableCell>
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
                          <TableCell>{variable.description}</TableCell>
                          <TableCell>
                            {categories.find(c => c.id === variable.variableCategoryId)?.name}
                          </TableCell>
                          <TableCell>{variable.variableProportion}%</TableCell>
                          <TableCell>{variable.minValue}</TableCell>
                          <TableCell>{variable.maxValue}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setEditingItem(variable);
                                setIsVariableModalOpen(true);
                              }}
                            >
                              <Pencil size={16} />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteVariable(variable.id)}>
                              <Trash2 size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {activeTab === 2 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={() => {
                      setEditingItem(null);
                      setIsParameterModalOpen(true);
                    }}
                  >
                    Add Parameter
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Impact</TableCell>
                        <TableCell>Recommended Range</TableCell>
                        <TableCell>Institution Specific</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {parameters.map((parameter) => (
                        <TableRow key={parameter.id}>
                          <TableCell>{parameter.name}</TableCell>
                          <TableCell>{parameter.description}</TableCell>
                          <TableCell>{parameter.impact}</TableCell>
                          <TableCell>{parameter.recommendedRange}</TableCell>
                          <TableCell>{parameter.isInstitutionSpecific ? 'Yes' : 'No'}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setEditingItem(parameter);
                                setIsParameterModalOpen(true);
                              }}
                            >
                              <Pencil size={16} />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteParameter(parameter.id)}>
                              <Trash2 size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        </Card>
      </Box>

      {/* Modals */}
      <Dialog
        open={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingItem(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const categoryData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            creditLimitWeight: Number(formData.get('creditLimitWeight')),
            interestRateWeight: Number(formData.get('interestRateWeight')),
          };
          if (editingItem) {
            handleEditCategory(categoryData);
          } else {
            handleCreateCategory(categoryData);
          }
        }}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                name="name"
                label="Name"
                defaultValue={editingItem ? (editingItem as Category).name : ''}
                required
                fullWidth
              />
              <TextField
                name="description"
                label="Description"
                defaultValue={editingItem ? (editingItem as Category).description : ''}
                required
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                name="creditLimitWeight"
                label="Credit Limit Weight"
                type="number"
                defaultValue={editingItem ? (editingItem as Category).creditLimitWeight : 0}
                required
                fullWidth
                inputProps={{ step: 0.1, min: 0, max: 100 }}
              />
              <TextField
                name="interestRateWeight"
                label="Interest Rate Weight"
                type="number"
                defaultValue={editingItem ? (editingItem as Category).interestRateWeight : 0}
                required
                fullWidth
                inputProps={{ step: 0.1, min: 0, max: 100 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setIsCategoryModalOpen(false);
              setEditingItem(null);
            }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={isVariableModalOpen}
        onClose={() => {
          setIsVariableModalOpen(false);
          setEditingItem(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? 'Edit Variable' : 'Create New Variable'}
        </DialogTitle>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const variableData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            uniqueCode: formData.get('uniqueCode') as string,
            isRequired: formData.get('isRequired') === 'true',
            mask: formData.get('mask') === 'true',
            isUsedInFormula: formData.get('isUsedInFormula') === 'true',
            minValue: Number(formData.get('minValue')),
            maxValue: Number(formData.get('maxValue')),
            responseType: formData.get('responseType') as 'int_float' | 'boolean' | 'categorical',
            normalizationFormula: formData.get('normalizationFormula') as string,
            variableCategoryId: Number(formData.get('variableCategoryId')),
            variableProportion: Number(formData.get('variableProportion')),
          };
          if (editingItem) {
            handleEditVariable(variableData);
          } else {
            handleCreateVariable(variableData);
          }
        }}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                name="name"
                label="Name"
                defaultValue={editingItem ? (editingItem as Variable).name : ''}
                required
                fullWidth
              />
              <TextField
                name="description"
                label="Description"
                defaultValue={editingItem ? (editingItem as Variable).description : ''}
                required
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                name="uniqueCode"
                label="Unique Code"
                defaultValue={editingItem ? (editingItem as Variable).uniqueCode : ''}
                required
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel>Response Type</InputLabel>
                <Select
                  name="responseType"
                  defaultValue={editingItem ? (editingItem as Variable).responseType : 'int_float'}
                  label="Response Type"
                >
                  <MenuItem value="int_float">Numeric</MenuItem>
                  <MenuItem value="boolean">Boolean</MenuItem>
                  <MenuItem value="categorical">Categorical</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="variableCategoryId"
                  defaultValue={editingItem ? (editingItem as Variable).variableCategoryId : ''}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="variableProportion"
                label="Proportion (%)"
                type="number"
                defaultValue={editingItem ? (editingItem as Variable).variableProportion : 0}
                required
                fullWidth
                inputProps={{ step: 0.1, min: 0, max: 100 }}
              />
              <TextField
                name="minValue"
                label="Min Value"
                type="number"
                defaultValue={editingItem ? (editingItem as Variable).minValue : 0}
                required
                fullWidth
              />
              <TextField
                name="maxValue"
                label="Max Value"
                type="number"
                defaultValue={editingItem ? (editingItem as Variable).maxValue : 100}
                required
                fullWidth
              />
              <TextField
                name="normalizationFormula"
                label="Normalization Formula"
                defaultValue={editingItem ? (editingItem as Variable).normalizationFormula : ''}
                required
                fullWidth
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setIsVariableModalOpen(false);
              setEditingItem(null);
            }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <CreateParameterModal
        open={isParameterModalOpen}
        onClose={() => {
          setIsParameterModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={editingItem ? handleEditParameter : handleCreateParameter}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ParameterManagement; 