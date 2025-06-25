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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
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
}

const InstitutionParameterManagement: React.FC = () => {
  const [parameters, setParameters] = useState<InstitutionParameter[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState<InstitutionParameter | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchParameters = async () => {
    try {
      const response = await axios.get('/parameter/all');
      setParameters(response.data.data);
    } catch (error) {
      enqueueSnackbar('Failed to fetch parameters', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  const handleCreateParameter = async (parameterData: Omit<InstitutionParameter, 'id'>) => {
    try {
      await axios.post('/parameter/create', {
        parameters: [{
          parameterId: parameterData.uniqueCode,
        }]
      });
      enqueueSnackbar('Parameter created successfully', { variant: 'success' });
      setIsCreateModalOpen(false);
      fetchParameters();
    } catch (error) {
      enqueueSnackbar('Failed to create parameter', { variant: 'error' });
    }
  };

  const handleEditParameter = async (parameterData: InstitutionParameter) => {
    try {
      await axios.put(`/parameter/update/{id}`, {
        institutionId: 1, // This should be dynamic based on the current institution
        parameterId: parameterData.uniqueCode,
      });
      enqueueSnackbar('Parameter updated successfully', { variant: 'success' });
      setIsEditModalOpen(false);
      fetchParameters();
    } catch (error) {
      enqueueSnackbar('Failed to update parameter', { variant: 'error' });
    }
  };

  const handleDeleteParameter = async (id: number) => {
    try {
      await axios.delete(`/parameter/delete/${id}`);
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
                        setSelectedParameter(parameter);
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
        />
      )}
      </div>
    </Container>
  );
};

export default InstitutionParameterManagement; 