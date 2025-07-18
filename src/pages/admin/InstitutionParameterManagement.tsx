import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  TextField,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

import {
  getAllParameters,
  createParameter,
  updateParameter,
  deleteParameter,
  updateInstitutionParameterByAdmin,
  getInstitutionParametersDetailed,
} from '../../services/parameterService';

import CreateParameterModal from '../../components/institution/CreateParameterModal';
import EditParameterModal from '../../components/institution/EditParameterModal';
import AdminNavbar from '../../components/admin/AdminNavbar';
import BackToDashboard from '../../components/admin/BackToDashboard';
import { useSnackbar } from 'notistack';
import axios from 'axios';

interface InstitutionParameter {
  id: number;
  name: string;
  description: string;
  recommendedRange: string;
  impact: string;
  uniqueCode: string;
  isActive: boolean;
  isRequired?: boolean;
  value?: number;
  institutionValue?: number;
}

const InstitutionParameterManagement: React.FC = () => {
  const [parameters, setParameters] = useState<InstitutionParameter[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState<InstitutionParameter | null>(null);
  const [editMode, setEditMode] = useState<'admin' | 'parameter'>('admin');
  const { enqueueSnackbar } = useSnackbar();
  const [institutionId, setInstitutionId] = useState<string>('');
  const [isInstitutionSearch, setIsInstitutionSearch] = useState(false);

  const fetchParameters = async () => {
    try {
      if (isInstitutionSearch && institutionId) {
        const response = await getInstitutionParametersDetailed(institutionId);
        // Map the API response to match the table's expected format
        setParameters(
          response.data.data.map((item: any) => ({
            id: item.id,
            name: item.parameter?.name || '',
            description: item.parameter?.description || '',
            recommendedRange: '', // Not provided in detailed endpoint
            impact: '', // Not provided in detailed endpoint
            uniqueCode: item.parameterId,
            isActive: item.parameter?.is_active ?? true,
            isRequired: item.parameter?.is_required ?? true,
            value: item.value,
          }))
        );
      } else {
        const response = await getAllParameters();
        setParameters(response.data.data.map((item: any) => ({
          ...item,
          isRequired: item.is_required ?? true,
          isActive: item.is_active ?? true,
        })));
      }
    } catch (error) {
      enqueueSnackbar('Failed to fetch parameters', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  const handleCreateParameter = async (parameterData: Omit<InstitutionParameter, 'id'>) => {
    try {
      // Only send the fields that the API expects, plus extra UI fields for future compatibility
      const apiPayload = {
        name: parameterData.name,
        description: parameterData.description,
        uniqueCode: Number(parameterData.uniqueCode),
        recommendedRange: parameterData.recommendedRange,
        impact: parameterData.impact,
        isRequired: parameterData.isRequired ?? false,
        isActive: typeof parameterData.isActive === 'string' ? parameterData.isActive === 'true' : !!parameterData.isActive,
      };
      await createParameter(apiPayload);
      enqueueSnackbar('Parameter created successfully', { variant: 'success' });
      setIsCreateModalOpen(false);
      fetchParameters();
    } catch (error) {
      enqueueSnackbar('Failed to create parameter', { variant: 'error' });
    }
  };

  const handleEditParameter = async (parameterData: InstitutionParameter & { institutionValue?: number }) => {
    try {
      // Check if we're editing an institution parameter (when searching by institution)
      if (isInstitutionSearch && institutionId && parameterData.institutionValue !== undefined) {
        await updateInstitutionParameterByAdmin(parameterData.id, {
          institutionId: Number(institutionId),
          parameterId: Number(parameterData.uniqueCode),
          value: parameterData.institutionValue ?? 0,
        });
      } else {
        // Editing a regular parameter
        const updatePayload = {
          name: parameterData.name,
          description: parameterData.description,
          recommendedRange: parameterData.recommendedRange,
          impact: parameterData.impact,
          isRequired: parameterData.isRequired ?? true,
          isActive: typeof parameterData.isActive === 'string' ? parameterData.isActive === 'true' : !!parameterData.isActive,
        };
        
        console.log('Updating parameter with payload:', updatePayload);
        await updateParameter(parameterData.id, updatePayload);
      }
      enqueueSnackbar('Parameter updated successfully', { variant: 'success' });
      setIsEditModalOpen(false);
      fetchParameters();
    } catch (error) {
      console.error('Error updating parameter:', error);
      enqueueSnackbar('Failed to update parameter', { variant: 'error' });
      throw error; // Re-throw to let the modal handle the error display
    }
  };

  const handleDeleteParameter: (id: number) => Promise<void> = async (id) => {
    try {
      await deleteParameter(id);
      enqueueSnackbar('Parameter deleted successfully', { variant: 'success' });
      fetchParameters();
    } catch (error) {
      enqueueSnackbar('Failed to delete parameter', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <AdminNavbar mb-4 />
      <div className="mt-4">
      <BackToDashboard />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Institution Parameter Management
        </Typography>
        <Button
          className="bg-green-500"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Parameter
        </Button>
      </Box>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          label="Institution ID"
          value={institutionId}
          onChange={e => setInstitutionId(e.target.value)}
          size="small"
          type="number"
          placeholder="Enter institution ID"
        />
        <Button
          variant="outlined"
          onClick={() => {
            setIsInstitutionSearch(!!institutionId);
            fetchParameters();
          }}
        >
          Search by Institution
        </Button>
        <Button
          variant="text"
          onClick={() => {
            setInstitutionId('');
            setIsInstitutionSearch(false);
            fetchParameters();
          }}
          disabled={!isInstitutionSearch}
        >
          Show All
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Unique Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Recommended Range</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parameters?.map((parameter) => (
              <TableRow key={parameter.id}>
                <TableCell>{parameter.uniqueCode}</TableCell>
                <TableCell>{parameter.name}</TableCell>
                <TableCell>{parameter.description}</TableCell>
                <TableCell>{parameter.recommendedRange}</TableCell>
                <TableCell>{parameter.isActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => {
                        if (isInstitutionSearch) {
                          setSelectedParameter({ ...parameter, institutionValue: parameter.value });
                        } else {
                          setSelectedParameter(parameter);
                        }
                        setEditMode('admin');
                        setIsEditModalOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDeleteParameter(parameter.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateParameterModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateParameter}
      />

      {selectedParameter && (
        <EditParameterModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedParameter(null);
          }}
          onSubmit={handleEditParameter}
          parameter={selectedParameter}
          showInstitutionValueField={isInstitutionSearch}
          editMode={editMode}
          institutionId={institutionId ? Number(institutionId) : undefined}
        />
      )}
      </div>
    </Container>
  );
};

export default InstitutionParameterManagement; 