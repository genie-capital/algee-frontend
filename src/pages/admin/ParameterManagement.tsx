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
  InputLabel,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import { PencilIcon, TrashIcon, PlusIcon, InfoIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AdminNavbar from '../../components/admin/AdminNavbar';
import BackToDashboard from '../../components/admin/BackToDashboard';
import CreateParameterModal from '../../components/institution/CreateParameterModal';
import { API_BASE_URL } from '../../config';
import parameterManagementService, {
  Category,
  Variable,
  Parameter,
} from '../../services/parameterManagementService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`parameter-tabpanel-${index}`}
      aria-labelledby={`parameter-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ParameterManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);
  const [isParameterModalOpen, setIsParameterModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | Variable | Parameter | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch categories
      const categoriesResponse = await parameterManagementService.getCategories();
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }

      // Fetch variables
      const variablesResponse = await parameterManagementService.getVariables();
      if (variablesResponse.success) {
        setVariables(variablesResponse.data);
      }

      // Fetch parameters
      const parametersResponse = await parameterManagementService.getParameters();
      if (parametersResponse.success) {
        setParameters(parametersResponse.data);
      }

      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Category handlers
  const handleCreateCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/variable/category/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      if (data.success) {
        setSnackbar({
          open: true,
          message: 'Category created successfully',
          severity: 'success',
        });
        setIsCategoryModalOpen(false);
        fetchData();
      } else {
        setSnackbar({
          open: true,
          message: data.message || 'Failed to create category',
          severity: 'error',
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'An error occurred while creating the category',
        severity: 'error',
      });
    }
  };

  const handleEditCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingItem) return;
    try {
      const response = await parameterManagementService.updateCategory(editingItem.id, categoryData);
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Category updated successfully',
          severity: 'success',
        });
        setIsCategoryModalOpen(false);
        setEditingItem(null);
        fetchData();
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to update category',
          severity: 'error',
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'An error occurred while updating the category',
        severity: 'error',
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await parameterManagementService.deleteCategory(id);
        if (response.success) {
          setSnackbar({
            open: true,
            message: 'Category deleted successfully',
            severity: 'success',
          });
          fetchData();
        } else {
          setSnackbar({
            open: true,
            message: response.message || 'Failed to delete category',
            severity: 'error',
          });
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'An error occurred while deleting the category',
          severity: 'error',
        });
      }
    }
  };

  // Variable handlers
  const handleCreateVariable = async (variableData: Omit<Variable, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/variable/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variableData),
      });
      const data = await response.json();
      if (data.success) {
        setSnackbar({
          open: true,
          message: 'Variable created successfully',
          severity: 'success',
        });
        setIsVariableModalOpen(false);
        fetchData();
      } else {
        setSnackbar({
          open: true,
          message: data.message || 'Failed to create variable',
          severity: 'error',
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'An error occurred while creating the variable',
        severity: 'error',
      });
    }
  };

  const handleEditVariable = async (variableData: Omit<Variable, 'id'>) => {
    if (!editingItem) return;
    try {
      const response = await parameterManagementService.updateVariable(editingItem.id, variableData);
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Variable updated successfully',
          severity: 'success',
        });
        setIsVariableModalOpen(false);
        setEditingItem(null);
        fetchData();
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to update variable',
          severity: 'error',
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'An error occurred while updating the variable',
        severity: 'error',
      });
    }
  };

  const handleDeleteVariable = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this variable?')) {
      try {
        const response = await parameterManagementService.deleteVariable(id);
        if (response.success) {
          setSnackbar({
            open: true,
            message: 'Variable deleted successfully',
            severity: 'success',
          });
          fetchData();
        } else {
          setSnackbar({
            open: true,
            message: response.message || 'Failed to delete variable',
            severity: 'error',
          });
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'An error occurred while deleting the variable',
          severity: 'error',
        });
      }
    }
  };

  // Parameter handlers
  const handleCreateParameter = async (parameterData: Omit<Parameter, 'id'>) => {
    try {
      const response = await parameterManagementService.createParameter(parameterData);
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Parameter created successfully',
          severity: 'success',
        });
        setIsParameterModalOpen(false);
        fetchData();
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to create parameter',
          severity: 'error',
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'An error occurred while creating the parameter',
        severity: 'error',
      });
    }
  };

  const handleEditParameter = async (parameterData: Omit<Parameter, 'id'>) => {
    if (!editingItem) return;
    try {
      const response = await parameterManagementService.updateParameter(editingItem.id, parameterData);
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Parameter updated successfully',
          severity: 'success',
        });
        setIsParameterModalOpen(false);
        setEditingItem(null);
        fetchData();
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to update parameter',
          severity: 'error',
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'An error occurred while updating the parameter',
        severity: 'error',
      });
    }
  };

  const handleDeleteParameter = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this parameter?')) {
      try {
        const response = await parameterManagementService.deleteParameter(id);
        if (response.success) {
          setSnackbar({
            open: true,
            message: 'Parameter deleted successfully',
            severity: 'success',
          });
          fetchData();
        } else {
          setSnackbar({
            open: true,
            message: response.message || 'Failed to delete parameter',
            severity: 'error',
          });
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'An error occurred while deleting the parameter',
          severity: 'error',
        });
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminNavbar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <BackToDashboard />
        
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Parameter Management
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="parameter management tabs">
                <Tab label="Categories" />
                <Tab label="Variables" />
                <Tab label="Parameters" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PlusIcon />}
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
                        <TableCell>{category.creditLimitWeight}</TableCell>
                        <TableCell>{category.interestRateWeight}</TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditingItem(category);
                                setIsCategoryModalOpen(true);
                              }}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PlusIcon />}
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
                      <TableCell>Category</TableCell>
                      <TableCell>Proportion</TableCell>
                      <TableCell>Min Value</TableCell>
                      <TableCell>Max Value</TableCell>
                      <TableCell>Normalization Formula</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {variables.map((variable) => (
                      <TableRow key={variable.id}>
                        <TableCell>{variable.name}</TableCell>
                        <TableCell>
                          {categories.find(c => c.id === variable.variableCategoryId)?.name}
                        </TableCell>
                        <TableCell>{variable.variableProportion}%</TableCell>
                        <TableCell>{variable.minValue}</TableCell>
                        <TableCell>{variable.maxValue}</TableCell>
                        <TableCell>{variable.normalizationFormula}</TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditingItem(variable);
                                setIsVariableModalOpen(true);
                              }}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteVariable(variable.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PlusIcon />}
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
                      <TableCell>Recommended Range</TableCell>
                      <TableCell>Impact</TableCell>
                      <TableCell>Normalization Formula</TableCell>
                      <TableCell>Institution Value</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parameters.map((parameter) => (
                      <TableRow key={parameter.id}>
                        <TableCell>{parameter.name}</TableCell>
                        <TableCell>{parameter.description}</TableCell>
                        <TableCell>{parameter.recommendedRange}</TableCell>
                        <TableCell>{parameter.impact}</TableCell>
                        <TableCell>{parameter.normalizationFormula}</TableCell>
                        <TableCell>
                          {parameter.isInstitutionSpecific ? parameter.institutionValue : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditingItem(parameter);
                                setIsParameterModalOpen(true);
                              }}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteParameter(parameter.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          </CardContent>
        </Card>

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
    </Box>
  );
};

export default ParameterManagement; 