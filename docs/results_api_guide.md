# Results API Documentation

## Overview

The Results API provides comprehensive endpoints for retrieving, filtering, searching, and analyzing credit scoring calculation results. It supports advanced filtering, pagination, comparison between different datasets, and detailed breakdowns of client results.

**Important**: The API implements role-based access control where institutions can only see their own data, and sensitive weight fields are hidden from institution users and only visible to admin users.

## Base URL
```
/api/result
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Role-Based Access Control

### Admin Users
- Can see all results across all institutions
- Have access to sensitive weight fields (`sum_normalised_credit_limit_weights`, `sum_normalised_interest_rate_weights`)
- Can access detailed variable breakdowns with weight information

### Institution Users
- Can only see results from their own institution
- Sensitive weight fields are automatically filtered out
- Variable breakdowns exclude weight information

## Endpoints

### 1. Get All Results with Advanced Filtering

**GET** `/api/result/getAllResults`

Retrieve all results with comprehensive filtering and search capabilities.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 20 | Number of results per page |
| `sortBy` | string | createdAt | Field to sort by |
| `sortOrder` | string | DESC | Sort order (ASC/DESC) |
| `search` | string | - | Search in client name, reference, email, phone |
| `uploadBatchId` | number | - | Filter by upload batch |
| `minCreditLimit` | number | - | Minimum credit limit filter |
| `maxCreditLimit` | number | - | Maximum credit limit filter |
| `minInterestRate` | number | - | Minimum interest rate filter |
| `maxInterestRate` | number | - | Maximum interest rate filter |
| `dateFrom` | string | - | Start date filter (ISO format) |
| `dateTo` | string | - | End date filter (ISO format) |
| `clientId` | number | - | Filter by specific client |

#### Example Request
```bash
GET /api/result/getAllResults?page=1&limit=10&search=john&minCreditLimit=100000&maxCreditLimit=1000000&sortBy=credit_limit&sortOrder=DESC
```

#### Example Response (Admin User)
```json
{
  "success": true,
  "message": "Results retrieved successfully",
  "data": {
    "results": [
      {
        "id": 1,
        "clientId": 123,
        "credit_limit": 750000,
        "interest_rate": 15.5,
        "sum_normalised_credit_limit_weights": 0.85,
        "sum_normalised_interest_rate_weights": 0.72,
        "uploadBatchId": 5,
        "createdAt": "2025-06-06T10:30:00Z",
        "client": {
          "id": 123,
          "reference_number": "CLIENT001",
          "name": "John Doe",
          "email": "john@example.com",
          "phoneNumber": "+237677777777"
        },
        "uploadBatch": {
          "id": 5,
          "name": "Monthly Upload - June 2025",
          "filename": "clients_june_2025.csv",
          "createdAt": "2025-06-06T09:00:00Z",
          "status": "completed"
        }
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 10,
      "totalPages": 15
    },
    "summary": {
      "totalResults": 150,
      "avgCreditLimit": 625000,
      "creditLimitRange": {
        "min": 100000,
        "max": 2000000
      },
      "avgInterestRate": 16.25,
      "interestRateRange": {
        "min": 12.0,
        "max": 22.5
      }
    },
    "filters": {
      "applied": {
        "search": "john",
        "uploadBatchId": null,
        "minCreditLimit": 100000,
        "maxCreditLimit": 1000000,
        "minInterestRate": null,
        "maxInterestRate": null,
        "dateFrom": null,
        "dateTo": null,
        "clientId": null
      }
    }
  }
}
```

#### Example Response (Institution User)
```json
{
  "success": true,
  "message": "Results retrieved successfully",
  "data": {
    "results": [
      {
        "id": 1,
        "clientId": 123,
        "credit_limit": 750000,
        "interest_rate": 15.5,
        "uploadBatchId": 5,
        "createdAt": "2025-06-06T10:30:00Z",
        "client": {
          "id": 123,
          "reference_number": "CLIENT001",
          "name": "John Doe",
          "email": "john@example.com",
          "phoneNumber": "+237677777777"
        },
        "uploadBatch": {
          "id": 5,
          "name": "Monthly Upload - June 2025",
          "filename": "clients_june_2025.csv",
          "createdAt": "2025-06-06T09:00:00Z",
          "status": "completed"
        }
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    },
    "summary": {
      "totalResults": 50,
      "avgCreditLimit": 625000,
      "creditLimitRange": {
        "min": 100000,
        "max": 1500000
      },
      "avgInterestRate": 16.25,
      "interestRateRange": {
        "min": 12.0,
        "max": 20.0
      }
    },
    "filters": {
      "applied": {
        "search": "john",
        "uploadBatchId": null,
        "minCreditLimit": 100000,
        "maxCreditLimit": 1000000,
        "minInterestRate": null,
        "maxInterestRate": null,
        "dateFrom": null,
        "dateTo": null,
        "clientId": null
      }
    }
  }
}
```

### 2. Get Latest Client Result

**GET** `/api/result/client/:clientId/latest`

Get the most recent credit scoring result for a specific client.

#### Parameters
- `clientId` (path): Client ID

#### Query Parameters
- `uploadBatchId` (optional): Specific upload batch ID

#### Access Control
- Institution users can only access clients that belong to their institution
- Returns 404 if client doesn't exist or access is denied

#### Example Request
```bash
GET /api/result/client/123/latest?uploadBatchId=5
```

#### Example Response
```json
{
  "success": true,
  "message": "Latest client result retrieved successfully",
  "data": {
    "id": 1,
    "clientId": 123,
    "credit_limit": 750000,
    "interest_rate": 15.5,
    "sum_normalised_credit_limit_weights": 0.85,
    "sum_normalised_interest_rate_weights": 0.72,
    "uploadBatchId": 5,
    "createdAt": "2025-06-06T10:30:00Z",
    "client": {
      "reference_number": "CLIENT001",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+237677777777"
    },
    "uploadBatch": {
      "name": "Monthly Upload - June 2025",
      "filename": "clients_june_2025.csv"
    }
  }
}
```

### 3. Get Client Result History

**GET** `/api/result/client/:clientId/history`

Get historical credit scoring results for a specific client.

#### Parameters
- `clientId` (path): Client ID

#### Query Parameters
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 10)
- `sortBy` (string): Sort field (default: createdAt)
- `sortOrder` (string): Sort order (default: DESC)
- `uploadBatchId` (number): Filter by upload batch

#### Access Control
- Institution users can only access clients that belong to their institution
- Results are automatically filtered to show only data from the user's institution

#### Example Request
```bash
GET /api/result/client/123/history?page=1&limit=5&sortBy=createdAt&sortOrder=DESC
```

#### Example Response
```json
{
  "success": true,
  "message": "Client result history retrieved successfully",
  "data": {
    "results": [
      {
        "id": 3,
        "clientId": 123,
        "credit_limit": 750000,
        "interest_rate": 15.5,
        "uploadBatchId": 5,
        "createdAt": "2025-06-06T10:30:00Z",
        "client": {
          "id": 123,
          "reference_number": "CLIENT001",
          "name": "John Doe",
          "email": "john@example.com",
          "phoneNumber": "+237677777777"
        },
        "uploadBatch": {
          "id": 5,
          "name": "Monthly Upload - June 2025",
          "filename": "clients_june_2025.csv",
          "createdAt": "2025-06-06T09:00:00Z",
          "status": "completed"
        }
      },
      {
        "id": 2,
        "clientId": 123,
        "credit_limit": 700000,
        "interest_rate": 16.0,
        "uploadBatchId": 4,
        "createdAt": "2025-05-06T10:30:00Z",
        "client": {
          "id": 123,
          "reference_number": "CLIENT001",
          "name": "John Doe",
          "email": "john@example.com",
          "phoneNumber": "+237677777777"
        },
        "uploadBatch": {
          "id": 4,
          "name": "Monthly Upload - May 2025",
          "filename": "clients_may_2025.csv",
          "createdAt": "2025-05-06T09:00:00Z",
          "status": "completed"
        }
      }
    ],
    "pagination": {
      "total": 8,
      "page": 1,
      "limit": 5,
      "totalPages": 2
    }
  }
}
```

### 4. Get Detailed Client Result

**GET** `/api/result/client/:clientId/detailed`

Get detailed client result with complete variable breakdown and normalization details.

#### Parameters
- `clientId` (path): Client ID

#### Query Parameters
- `uploadBatchId` (optional): Specific upload batch ID

#### Access Control
- Institution users can only access clients that belong to their institution
- Weight information is only visible to admin users

#### Example Request
```bash
GET /api/result/client/123/detailed?uploadBatchId=5
```

#### Example Response (Admin User)
```json
{
  "success": true,
  "message": "Detailed client result retrieved successfully",
  "data": {
    "clientResult": {
      "id": 1,
      "clientId": 123,
      "credit_limit": 750000,
      "interest_rate": 15.5,
      "sum_normalised_credit_limit_weights": 0.85,
      "sum_normalised_interest_rate_weights": 0.72,
      "uploadBatchId": 5,
      "createdAt": "2025-06-06T10:30:00Z"
    },
    "variableBreakdown": {
      "Income Information": [
        {
          "variableId": 1,
          "variableName": "Verified Monthly Income",
          "uniqueCode": 2001,
          "responseType": "int_float",
          "rawValue": 500000,
          "normalizedValue": 0.8,
          "variableProportion": 100,
          "creditLimitWeight": 0.25,
          "interestRateWeight": 0.22,
          "categoryWeights": {
            "creditLimit": 0.3,
            "interestRate": 0.25
          }
        }
      ],
      "Employment Status": [
        {
          "variableId": 2,
          "variableName": "Employment Status",
          "uniqueCode": 1001,
          "responseType": "categorical",
          "rawValue": "Full-time",
          "normalizedValue": 1.0,
          "variableProportion": 100,
          "creditLimitWeight": 0.15,
          "interestRateWeight": 0.18,
          "categoryWeights": {
            "creditLimit": 0.2,
            "interestRate": 0.18
          }
        }
      ]
    },
    "totalVariables": 8,
    "categoriesCount": 4
  }
}
```

#### Example Response (Institution User)
```json
{
  "success": true,
  "message": "Detailed client result retrieved successfully",
  "data": {
    "clientResult": {
      "id": 1,
      "clientId": 123,
      "credit_limit": 750000,
      "interest_rate": 15.5,
      "uploadBatchId": 5,
      "createdAt": "2025-06-06T10:30:00Z"
    },
    "variableBreakdown": {
      "Income Information": [
        {
          "variableId": 1,
          "variableName": "Verified Monthly Income",
          "uniqueCode": 2001,
          "responseType": "int_float",
          "rawValue": 500000,
          "normalizedValue": 0.8,
          "variableProportion": 100
        }
      ],
      "Employment Status": [
        {
          "variableId": 2,
          "variableName": "Employment Status",
          "uniqueCode": 1001,
          "responseType": "categorical",
          "rawValue": "Full-time",
          "normalizedValue": 1.0,
          "variableProportion": 100
        }
      ]
    },
    "totalVariables": 8,
    "categoriesCount": 4
  }
}
```

### 5. Compare Client Results Across Batches

**GET** `/api/result/client/:clientId/compare`

Compare results for a specific client across different upload batches or time periods. This endpoint allows you to track how a client's credit scoring results have changed over time or between different batches.

#### Parameters
- `clientId` (path): Client ID

#### Query Parameters
- `batch1Id` (number): First batch ID for comparison
- `batch2Id` (number): Second batch ID for comparison  
- `dateFrom1` (string): Start date for first dataset (ISO format)
- `dateTo1` (string): End date for first dataset (ISO format)
- `dateFrom2` (string): Start date for second dataset (ISO format)
- `dateTo2` (string): End date for second dataset (ISO format)

**Note**: Either `batch1Id` or `dateFrom1` is required. You can compare by specific batches or by date ranges.

#### Access Control
- Institution users can only access clients that belong to their institution
- Institution users can only compare batches that belong to their institution
- Weight comparison information is only visible to admin users
- Returns 404 if client or batches don't exist or access is denied

#### Example Requests

**Compare specific batches:**
```bash
GET /api/result/client/123/compare?batch1Id=5&batch2Id=6
```

**Compare by date ranges:**
```bash
GET /api/result/client/123/compare?dateFrom1=2025-05-01&dateTo1=2025-05-31&dateFrom2=2025-06-01&dateTo2=2025-06-30
```

**Mixed comparison (batch vs date range):**
```bash
GET /api/result/client/123/compare?batch1Id=5&dateFrom2=2025-06-01&dateTo2=2025-06-30
```

#### Example Response (Admin User)
```json
{
  "success": true,
  "message": "Client results comparison completed successfully",
  "data": {
    "clientInfo": {
      "id": 123,
      "reference_number": "CLIENT001",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+237677777777"
    },
    "dataset1": {
      "result": {
        "id": 1,
        "clientId": 123,
        "credit_limit": 700000,
        "interest_rate": 16.0,
        "sum_normalised_credit_limit_weights": 0.78,
        "sum_normalised_interest_rate_weights": 0.75,
        "uploadBatchId": 5,
        "createdAt": "2025-05-06T10:30:00Z"
      },
      "batchInfo": {
        "id": 5,
        "name": "Monthly Upload - May 2025",
        "filename": "clients_may_2025.csv",
        "createdAt": "2025-05-06T09:00:00Z",
        "status": "completed"
      },
      "hasData": true
    },
    "dataset2": {
      "result": {
        "id": 2,
        "clientId": 123,
        "credit_limit": 750000,
        "interest_rate": 15.5,
        "sum_normalised_credit_limit_weights": 0.85,
        "sum_normalised_interest_rate_weights": 0.72,
        "uploadBatchId": 6,
        "createdAt": "2025-06-06T10:30:00Z"
      },
      "batchInfo": {
        "id": 6,
        "name": "Monthly Upload - June 2025",
        "filename": "clients_june_2025.csv",
        "createdAt": "2025-06-06T09:00:00Z",
        "status": "completed"
      },
      "hasData": true
    },
    "comparison": {
      "creditLimit": {
        "difference": 50000,
        "percentChange": 7.14,
        "improved": true
      },
      "interestRate": {
        "difference": -0.5,
        "percentChange": -3.13,
        "improved": true
      },
      "overallImprovement": true,
      "weights": {
        "creditLimitWeight": {
          "difference": 0.07,
          "percentChange": 8.97
        },
        "interestRateWeight": {
          "difference": -0.03,
          "percentChange": -4.0
        }
      }
    }
  }
}
```

#### Example Response (Institution User)
```json
{
  "success": true,
  "message": "Client results comparison completed successfully",
  "data": {
    "clientInfo": {
      "id": 123,
      "reference_number": "CLIENT001",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+237677777777"
    },
    "dataset1": {
      "result": {
        "id": 1,
        "clientId": 123,
        "credit_limit": 700000,
        "interest_rate": 16.0,
        "uploadBatchId": 5,
        "createdAt": "2025-05-06T10:30:00Z"
      },
      "batchInfo": {
        "id": 5,
        "name": "Monthly Upload - May 2025",
        "filename": "clients_may_2025.csv",
        "createdAt": "2025-05-06T09:00:00Z",
        "status": "completed"
      },
      "hasData": true
    },
    "dataset2": {
      "result": {
        "id": 2,
        "clientId": 123,
        "credit_limit": 750000,
        "interest_rate": 15.5,
        "uploadBatchId": 6,
        "createdAt": "2025-06-06T10:30:00Z"
      },
      "batchInfo": {
        "id": 6,
        "name": "Monthly Upload - June 2025",
        "filename": "clients_june_2025.csv",
        "createdAt": "2025-06-06T09:00:00Z",
        "status": "completed"
      },
      "hasData": true
    },
    "comparison": {
      "creditLimit": {
        "difference": 50000,
        "percentChange": 7.14,
        "improved": true
      },
      "interestRate": {
        "difference": -0.5,
        "percentChange": -3.13,
        "improved": true
      },
      "overallImprovement": true
    }
  }
}
```

#### Response When Only One Dataset Has Data
```json
{
  "success": true,
  "message": "Client results comparison completed successfully",
  "data": {
    "clientInfo": {
      "id": 123,
      "reference_number": "CLIENT001",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+237677777777"
    },
    "dataset1": {
      "result": {
        "id": 1,
        "clientId": 123,
        "credit_limit": 700000,
        "interest_rate": 16.0,
        "uploadBatchId": 5,
        "createdAt": "2025-05-06T10:30:00Z"
      },
      "batchInfo": {
        "id": 5,
        "name": "Monthly Upload - May 2025",
        "filename": "clients_may_2025.csv",
        "createdAt": "2025-05-06T09:00:00Z",
        "status": "completed"
      },
      "hasData": true
    },
    "dataset2": {
      "result": null,
      "batchInfo": null,
      "hasData": false
    },
    "comparison": null
  }
}
```

### 6. Get Results by Upload Batch

**GET** `/api/result/batch/:uploadBatchId`

Get all results for a specific upload batch.

#### Parameters
- `uploadBatchId` (path): Upload batch ID

#### Query Parameters
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 20)
- `sortBy` (string): Sort field (default: createdAt)
- `sortOrder` (string): Sort order (default: DESC)
- `search` (string): Search in client name, reference, email

#### Access Control
- Institution users can only access upload batches that belong to their institution
- Returns 404 if upload batch doesn't exist or access is denied

#### Example Request
```bash
GET /api/result/batch/5?page=1&limit=10&search=john
```

#### Example Response
```json
{
  "success": true,
  "message": "Batch results retrieved successfully",
  "data": {
    "results": [
      {
        "id": 1,
        "clientId": 123,
        "credit_limit": 750000,
        "interest_rate": 15.5,
        "uploadBatchId": 5,
        "createdAt": "2025-06-06T10:30:00Z",
        "client": {
          "id": 123,
          "reference_number": "CLIENT001",
          "name": "John Doe",
          "email": "john@example.com",
          "phoneNumber": "+237677777777"
        },
        "uploadBatch": {
          "id": 5,
          "name": "Monthly Upload - June 2025",
          "filename": "clients_june_2025.csv",
          "createdAt": "2025-06-06T09:00:00Z",
          "status": "completed"
        }
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    },
    "batchSummary": {
      "totalClients": 50,
      "avgCreditLimit": 625000,
      "avgInterestRate": 16.25,
      "totalCreditLimit": 31250000
    }
  }
}
```

### 7. Compare Results

**GET** `/api/result/compare`

Compare results between different batches or time periods.

#### Query Parameters
- `batch1Id` (required): First batch ID for comparison
- `batch2Id` (optional): Second batch ID for comparison
- `dateFrom1`, `dateTo1`: Date range for first dataset
- `dateFrom2`, `dateTo2`: Date range for second dataset
- `clientIds`: Comma-separated client IDs to compare

#### Access Control
- Institution users can only compare batches that belong to their institution
- Returns 404 if any specified batch doesn't exist or access is denied

#### Example Request
```bash
GET /api/result/compare?batch1Id=5&batch2Id=6
```

#### Example Response
```json
{
  "success": true,
  "message": "Results comparison completed successfully",
  "data": {
    "dataset1": {
      "count": 50,
      "avgCreditLimit": 625000,
      "avgInterestRate": 16.25,
      "creditLimitRange": { "min": 100000, "max": 2000000 },
      "interestRateRange": { "min": 12.0, "max": 22.5 }
    },
    "dataset2": {
      "count": 48,
      "avgCreditLimit": 680000,
      "avgInterestRate": 15.8,
      "creditLimitRange": { "min": 120000, "max": 1800000 },
      "interestRateRange": { "min": 11.5, "max": 21.0 }
    },
    "differences": {
      "countDiff": -2,
      "avgCreditLimitDiff": 55000,
      "avgInterestRateDiff": -0.45,
      "avgCreditLimitPercentChange": 8.8,
      "avgInterestRatePercentChange": -2.77
    }
  }
}
```

### 8. Export Results

**GET** `/api/result/export`

Export results to CSV or JSON format.

#### Query Parameters
- `uploadBatchId` (number): Filter by upload batch
- `clientIds` (string): Comma-separated client IDs
- `dateFrom`, `dateTo` (string): Date range filters (ISO format)
- `format` (string): Export format (csv or json, default: csv)

#### Access Control
- Institution users can only export data from their own institution
- Weight columns are only included for admin users in CSV exports

#### Example Request
```bash
GET /api/result/export?uploadBatchId=5&format=csv
```

#### CSV Response (Admin User)
Returns a CSV file with headers:
```
Client ID,Client Name,Email,Phone,Credit Limit,Interest Rate,Credit Limit Weight,Interest Rate Weight,Upload Batch,Created At
```

#### CSV Response (Institution User)
Returns a CSV file with headers:
```
Client ID,Client Name,Email,Phone,Credit Limit,Interest Rate,Upload Batch,Created At
```

#### JSON Response
```json
{
  "success": true,
  "message": "Results exported successfully",
  "data": [
    {
      "id": 1,
      "clientId": 123,
      "credit_limit": 750000,
      "interest_rate": 15.5,
      "uploadBatchId": 5,
      "createdAt": "2025-06-06T10:30:00Z",
      "client": {
        "reference_number": "CLIENT001",
        "name": "John Doe",
        "email": "john@example.com",
        "phoneNumber": "+237677777777"
      },
      "uploadBatch": {
        "name": "Monthly Upload - June 2025",
        "filename": "clients_june_2025.csv"
      }
    }
  ]
}
```

### 9. API Health Check

**GET** `/api/result/`

Simple endpoint to check if the results API is operational.

#### Example Request
```bash
GET /api/result/
```

#### Example Response
```json
{
  "message": "results api endpoint"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common Error Scenarios

#### Access Denied (Institution Users)
```json
{
  "success": false,
  "message": "Client not found or access denied"
}
```

```json
{
  "success": false,
  "message": "Upload batch not found or access denied"
}
```

#### Missing Required Parameters
```json
{
  "success": false,
  "message": "Either batch1Id or dateFrom1 is required for comparison"
}
```

#### Client Result Not Found
```json
{
  "success": false,
  "message": "No result found for this client"
}
```

## Common HTTP Status Codes

- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (missing or invalid token)
- `404`: Not Found (resource doesn't exist or access denied)
- `500`: Internal Server Error

## Usage Examples

### 1. Search for clients with high credit limits
```bash
GET /api/result/getAllResults?minCreditLimit=1000000&sortBy=credit_limit&sortOrder=DESC
```

### 2. Get results from last month
```bash
GET /api/result/getAllResults?dateFrom=2025-05-01&dateTo=2025-05-31
```

### 3. Find clients with low interest rates
```bash
GET /api/result/getAllResults?maxInterestRate=15&sortBy=interest_rate&sortOrder=ASC
```

### 4. Search by client name
```bash
GET /api/result/getAllResults?search=john%20doe
```

### 5. Export specific batch results
```bash
GET /api/result/export?uploadBatchId=5&format=csv
```

### 6. Compare two batches
```bash
GET /api/result/compare?batch1Id=5&batch2Id=6
```

### 7. Compare client results across batches
```bash
GET /api/result/client/123/compare?batch1Id=5&batch2Id=6
```

### 8. Compare client results by date ranges
```bash
GET /api/result/client/123/compare?dateFrom1=2025-05-01&dateTo1=2025-05-31&dateFrom2=2025-06-01&dateTo2=2025-06-30
```

### 9. Get detailed breakdown for a client
```bash
GET /api/result/client/123/detailed
```

### 10. Get client history with pagination
```bash
GET /api/result/client/123/history?page=1&limit=5&sortBy=createdAt&sortOrder=DESC
```

## Best Practices

1. **Pagination**: Always use pagination for large datasets to improve performance
2. **Filtering**: Use specific filters to reduce response size and improve query performance
3. **Caching**: Results are relatively static after calculation, consider client-side caching
4. **Export**: Use export endpoint for large datasets rather than fetching all pages
5. **Search**: Use search parameter for text-based queries across multiple fields
6. **Comparison**: Use comparison endpoint for analytics and reporting features
7. **Role Awareness**: Be aware that response data varies based on user role (admin vs institution)
8. **Error Handling**: Always handle 404 responses which may indicate access restrictions

## Rate Limiting

- Standard rate limiting applies: 100 requests per minute per user
- Export endpoints have lower limits: 10 requests per minute
- Large exports may take time to process, implement proper timeout handling

## Data Freshness

- Results are calculated during CSV upload processing
- Data is real-time for recently uploaded batches
- Historical data remains unchanged unless batches are reprocessed
- Summary statistics are calculated dynamically based on current filters

## Security Considerations

- All endpoints require valid JWT authentication
- Institution users are automatically restricted to their own data
- Sensitive weight information is filtered based on user role
- Upload batch access is verified before returning results
- Client access is verified for institution users 