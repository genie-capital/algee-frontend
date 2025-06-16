import { Result } from '../services/resultsService';

export const mockResults: Result[] = [
  {
    id: 1,
    clientId: 101,
    credit_limit: 750000,
    interest_rate: 15.5,
    sum_normalised_credit_limit_weights: 0.85,
    sum_normalised_interest_rate_weights: 0.72,
    uploadBatchId: 1,
    createdAt: '2024-03-15T10:30:00Z',
    client: {
      reference_number: 'CLIENT001',
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '+1234567890'
    },
    uploadBatch: {
      name: 'March 2024 Batch',
      filename: 'march_2024_batch.csv'
    }
  },
  {
    id: 2,
    clientId: 102,
    credit_limit: 1200000,
    interest_rate: 12.8,
    sum_normalised_credit_limit_weights: 0.92,
    sum_normalised_interest_rate_weights: 0.65,
    uploadBatchId: 1,
    createdAt: '2024-03-15T11:15:00Z',
    client: {
      reference_number: 'CLIENT002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phoneNumber: '+1987654321'
    },
    uploadBatch: {
      name: 'March 2024 Batch',
      filename: 'march_2024_batch.csv'
    }
  },
  {
    id: 3,
    clientId: 103,
    credit_limit: 450000,
    interest_rate: 18.2,
    sum_normalised_credit_limit_weights: 0.68,
    sum_normalised_interest_rate_weights: 0.78,
    uploadBatchId: 2,
    createdAt: '2024-03-16T09:45:00Z',
    client: {
      reference_number: 'CLIENT003',
      name: 'Robert Johnson',
      email: 'robert@example.com',
      phoneNumber: '+1122334455'
    },
    uploadBatch: {
      name: 'April 2024 Batch',
      filename: 'april_2024_batch.csv'
    }
  }
];

export const mockSummary = {
  totalResults: 3,
  avgCreditLimit: 800000,
  avgInterestRate: 15.5,
  creditLimitRange: {
    min: 450000,
    max: 1200000
  },
  interestRateRange: {
    min: 12.8,
    max: 18.2
  }
};

export const mockPagination = {
  total: 3,
  page: 1,
  limit: 10,
  totalPages: 1
};

export const mockClientHistory = {
  results: [
    {
      id: 1,
      clientId: 101,
      credit_limit: 750000,
      interest_rate: 15.5,
      sum_normalised_credit_limit_weights: 0.85,
      sum_normalised_interest_rate_weights: 0.72,
      uploadBatchId: 1,
      createdAt: '2024-03-15T10:30:00Z',
      client: {
        reference_number: 'CLIENT001',
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890'
      },
      uploadBatch: {
        name: 'March 2024 Batch',
        filename: 'march_2024_batch.csv'
      }
    },
    {
      id: 4,
      clientId: 101,
      credit_limit: 650000,
      interest_rate: 16.2,
      sum_normalised_credit_limit_weights: 0.82,
      sum_normalised_interest_rate_weights: 0.75,
      uploadBatchId: 3,
      createdAt: '2024-02-15T10:30:00Z',
      client: {
        reference_number: 'CLIENT001',
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890'
      },
      uploadBatch: {
        name: 'February 2024 Batch',
        filename: 'feb_2024_batch.csv'
      }
    }
  ],
  pagination: {
    total: 2,
    page: 1,
    limit: 10,
    totalPages: 1
  }
}; 