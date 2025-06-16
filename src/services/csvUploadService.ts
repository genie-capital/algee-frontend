import api from './api';

export interface UploadBatch {
  id: number;
  filename: string;
  status: 'completed' | 'failed' | 'processing';
  total_records: number;
  processed_records: number;
  failed_records: number;
  createdAt: string;
}

export interface UploadBatchDetails extends UploadBatch {
  clients: Array<{
    id: number;
    reference_number: string;
    name: string;
    email: string;
    phoneNumber: string;
    status: string;
    processed_at: string;
  }>;
  errors: Array<{
    row: number;
    client_id: string;
    error: string;
    data: Record<string, any>;
  }>;
}

export interface UploadBatchError {
  row: number;
  client_id: string;
  error: string;
  data: Record<string, any>;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    uploadBatchId: number;
    fileInfo: {
      originalName: string;
      size: number;
      mimetype: string;
    };
    validation: {
      warnings: string[];
    };
    processing: {
      totalRecords: number;
      successfulRecords: number;
      failedRecords: number;
      statistics: {
        newClients: number;
        updatedClients: number;
        variablesProcessed: number;
      };
    };
    errors: UploadBatchError[];
    normalization: {
      success: boolean;
      totalVariablesNormalized: number;
      clientsProcessed: number;
      errors: any[];
    };
    creditScoring: {
      success: boolean;
      clientsProcessed: number;
      resultsGenerated: number;
      errors: any[];
    };
  };
}

export const csvUploadService = {
  // Upload CSV file
  uploadCSV: async (
    file: File,
    batchName: string,
    batchDescription?: string
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('csvFile', file);
    formData.append('batchName', batchName);
    if (batchDescription) {
      formData.append('batchDescription', batchDescription);
    }

    const response = await api.post('/csv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all upload batches
  getUploadBatches: async (params: {
    page?: number;
    limit?: number;
    status?: 'processing' | 'completed' | 'failed' | 'completed_with_errors';
  }) => {
    const response = await api.get('/csv/batches', { params });
    return response.data;
  },

  // Get upload batch details
  getUploadBatchDetails: async (batchId: number): Promise<{ success: boolean; data: UploadBatchDetails }> => {
    const response = await api.get(`/csv/batch/${batchId}`);
    return response.data;
  },

  // Get upload batch errors
  getUploadBatchErrors: async (batchId: number): Promise<{
    success: boolean;
    data: {
      uploadBatchId: number;
      totalErrors: number;
      errors: UploadBatchError[];
    };
  }> => {
    const response = await api.get(`/csv/batch/${batchId}/errors`);
    return response.data;
  },

  // Download CSV template
  downloadCSVTemplate: async (): Promise<Blob> => {
    const response = await api.get('/csv/template', {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default csvUploadService; 