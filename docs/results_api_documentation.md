# Results API Documentation

## Overview

The Results API provides comprehensive endpoints for retrieving, analyzing, and exporting credit scoring results. This API supports role-based access control with different data visibility for administrators and institutions.

**Base URL:** `http://localhost:3000/api/result`  
**Authentication:** Required (JWT Bearer Token)  
**Content-Type:** `application/json`

## Authentication

All endpoints require authentication using JWT Bearer tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **Admin**: Full access to all data including sensitive weight calculations
- **Institution**: Access limited to their own client data, sensitive weight fields are filtered out

## Data Models

### ClientResult Model
```json
{
  "id": "integer (primary key)",
  "clientId": "integer (foreign key to Client)",
  "credit_limit": "float (calculated credit limit)",
  "interest_rate": "float (calculated interest rate)",
  "sum_normalised_credit_limit_weights": "float (admin only)",
  "sum_normalised_interest_rate_weights": "float (admin only)",
  "uploadBatchId": "integer (foreign key to UploadBatch)",
  "createdAt": "datetime (ISO 8601)",
  "updatedAt": "datetime (ISO 8601)"
}
```

### Client Model
```json
{
  "id": "integer (primary key)",
  "reference_number": "string (unique identifier)",
  "name": "string (client full name)",
  "email": "string (client email)",
  "phoneNumber": "string (client phone)",
  "institutionId": "integer (foreign key to Institution)",
  "createdAt": "datetime (ISO 8601)",
  "updatedAt": "datetime (ISO 8601)"
}
```

### UploadBatch Model
```json
{
  "id": "integer (primary key)",
  "name": "string (batch name)",
  "filename": "string (original filename)",
  "status": "enum ('processing', 'completed', 'failed', 'completed_with_errors')",
  "institutionId": "integer (foreign key to Institution)",
  "createdAt": "datetime (ISO 8601)",
  "updatedAt": "datetime (ISO 8601)"
}
```

## API Endpoints

### 1. Get All Results

Retrieve all results with advanced filtering, search, and pagination capabilities.

**Endpoint:** `GET /api/result`  
**Authentication:** Required  
**Access:** Admin (all data), Institution (own data only)

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 20 | Number of results per page (max 100) |
| `sortBy` | string | No | createdAt | Field to sort by (createdAt, credit_limit, interest_rate) |
| `sortOrder` | string | No | DESC | Sort order (ASC, DESC) |
| `search` | string | No | - | Search in client name, reference, email, phone |
| `uploadBatchId` | integer | No | - | Filter by specific upload batch |
| `minCreditLimit` | float | No | - | Minimum credit limit filter |
| `maxCreditLimit` | float | No | - | Maximum credit limit filter |
| `minInterestRate` | float | No | - | Minimum interest rate filter |
| `maxInterestRate` | float | No | - | Maximum interest rate filter |
| `dateFrom` | string | No | - | Start date filter (ISO 8601 format) |
| `dateTo` | string | No | - | End date filter (ISO 8601 format) |
| `clientId` | integer | No | - | Filter by specific client |

#### Request Example

```bash
curl -X GET "http://localhost:3000/api/result?page=1&limit=10&search=john&minCreditLimit=100000&sortBy=credit_limit&sortOrder=DESC" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Results retrieved successfully",
  "data": {
    "results": [
      {
        "id": 1,
        "clientId": 123,
        "credit_limit": 500000.00,
        "interest_rate": 12.5,
        "uploadBatchId": 45,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "client": {
          "id": 123,
          "reference_number": "CLIENT001",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phoneNumber": "+237677777777"
        },
        "uploadBatch": {
          "id": 45,
          "name": "January 2024 Upload",
          "filename": "clients_jan_2024.csv",
          "createdAt": "2024-01-15T09:00:00.000Z",
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
      "avgCreditLimit": 425000.50,
      "creditLimitRange": {
        "min": 50000.00,
        "max": 1000000.00
      },
      "avgInterestRate": 14.2,
      "interestRateRange": {
        "min": 8.5,
        "max": 25.0
      }
    },
    "filters": {
      "applied": {
        "search": "john",
        "minCreditLimit": 100000,
        "uploadBatchId": null,
        "maxCreditLimit": null,
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

**Error Responses**

*401 Unauthorized*
```json
{
  "success": false,
  "message": "Unauthorized: No authorization header provided"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Error fetching results",
  "error": "Database connection failed"
}
```

---

### 2. Get Latest Client Result

Retrieve the most recent result for a specific client.

**Endpoint:** `GET /api/result/client/{clientId}/latest`  
**Authentication:** Required  
**Access:** Admin (all clients), Institution (own clients only)

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `clientId` | integer | Yes | Unique client identifier |

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `uploadBatchId` | integer | No | - | Get result from specific upload batch |

#### Request Example

```bash
curl -X GET "http://localhost:3000/api/result/client/123/latest?uploadBatchId=45" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Latest client result retrieved successfully",
  "data": {
    "id": 1,
    "clientId": 123,
    "credit_limit": 500000.00,
    "interest_rate": 12.5,
    "uploadBatchId": 45,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "client": {
      "id": 123,
      "reference_number": "CLIENT001",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "+237677777777"
    },
    "uploadBatch": {
      "id": 45,
      "name": "January 2024 Upload",
      "filename": "clients_jan_2024.csv",
      "createdAt": "2024-01-15T09:00:00.000Z"
    }
  }
}
```

**Error Responses**

*404 Not Found*
```json
{
  "success": false,
  "message": "Client not found or access denied"
}
```

*404 Not Found*
```json
{
  "success": false,
  "message": "Client result not found"
}
```

---

### 3. Get Client Result History

Retrieve paginated history of all results for a specific client.

**Endpoint:** `GET /api/result/client/{clientId}/history`  
**Authentication:** Required  
**Access:** Admin (all clients), Institution (own clients only)

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `clientId` | integer | Yes | Unique client identifier |

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 10 | Number of results per page |
| `sortBy` | string | No | createdAt | Field to sort by |
| `sortOrder` | string | No | DESC | Sort order (ASC, DESC) |
| `uploadBatchId` | integer | No | - | Filter by upload batch |

#### Request Example

```bash
curl -X GET "http://localhost:3000/api/result/client/123/history?page=1&limit=5&sortOrder=DESC" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Client result history retrieved successfully",
  "data": {
    "results": [
      {
        "id": 3,
        "clientId": 123,
        "credit_limit": 520000.00,
        "interest_rate": 11.8,
        "uploadBatchId": 47,
        "createdAt": "2024-02-15T10:30:00.000Z",
        "updatedAt": "2024-02-15T10:30:00.000Z",
        "client": {
          "id": 123,
          "reference_number": "CLIENT001",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phoneNumber": "+237677777777"
        },
        "uploadBatch": {
          "id": 47,
          "name": "February 2024 Upload",
          "filename": "clients_feb_2024.csv",
          "createdAt": "2024-02-15T09:00:00.000Z",
          "status": "completed"
        }
      },
      {
        "id": 1,
        "clientId": 123,
        "credit_limit": 500000.00,
        "interest_rate": 12.5,
        "uploadBatchId": 45,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "client": {
          "id": 123,
          "reference_number": "CLIENT001",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phoneNumber": "+237677777777"
        },
        "uploadBatch": {
          "id": 45,
          "name": "January 2024 Upload",
          "filename": "clients_jan_2024.csv",
          "createdAt": "2024-01-15T09:00:00.000Z",
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

---

### 4. Get Detailed Client Result

Retrieve detailed client result with variable breakdown and normalization data.

**Endpoint:** `GET /api/result/client/{clientId}/detailed`  
**Authentication:** Required  
**Access:** Admin (full details), Institution (limited details, no weights)

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `clientId` | integer | Yes | Unique client identifier |

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `uploadBatchId` | integer | No | - | Get details from specific upload batch |

#### Request Example

```bash
curl -X GET "http://localhost:3000/api/result/client/123/detailed?uploadBatchId=45" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Response

**Success (200 OK) - Admin View**
```json
{
  "success": true,
  "message": "Detailed client result retrieved successfully",
  "data": {
    "clientResult": {
      "id": 1,
      "clientId": 123,
      "credit_limit": 500000.00,
      "interest_rate": 12.5,
      "sum_normalised_credit_limit_weights": 0.75,
      "sum_normalised_interest_rate_weights": 0.68,
      "uploadBatchId": 45,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "client": {
        "id": 123,
        "reference_number": "CLIENT001",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+237677777777"
      },
      "uploadBatch": {
        "id": 45,
        "name": "January 2024 Upload",
        "filename": "clients_jan_2024.csv",
        "createdAt": "2024-01-15T09:00:00.000Z"
      }
    },
    "variableBreakdown": {
      "Financial Information": [
        {
          "variableId": 1,
          "variableName": "Monthly Income",
          "uniqueCode": "monthly_income",
          "responseType": "number",
          "rawValue": 750000,
          "normalizedValue": 0.85,
          "variableProportion": 0.25,
          "creditLimitWeight": 0.22,
          "interestRateWeight": 0.18,
          "categoryWeights": {
            "creditLimit": 0.40,
            "interestRate": 0.35
          }
        }
      ],
      "Personal Information": [
        {
          "variableId": 2,
          "variableName": "Age",
          "uniqueCode": "age",
          "responseType": "number",
          "rawValue": 35,
          "normalizedValue": 0.70,
          "variableProportion": 0.15,
          "creditLimitWeight": 0.12,
          "interestRateWeight": 0.10,
          "categoryWeights": {
            "creditLimit": 0.20,
            "interestRate": 0.15
          }
        }
      ]
    },
    "totalVariables": 8,
    "categoriesCount": 3
  }
}
```

**Success (200 OK) - Institution View**
```json
{
  "success": true,
  "message": "Detailed client result retrieved successfully",
  "data": {
    "clientResult": {
      "id": 1,
      "clientId": 123,
      "credit_limit": 500000.00,
      "interest_rate": 12.5,
      "uploadBatchId": 45,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "client": {
        "id": 123,
        "reference_number": "CLIENT001",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+237677777777"
      },
      "uploadBatch": {
        "id": 45,
        "name": "January 2024 Upload",
        "filename": "clients_jan_2024.csv",
        "createdAt": "2024-01-15T09:00:00.000Z"
      }
    },
    "variableBreakdown": {
      "Financial Information": [
        {
          "variableId": 1,
          "variableName": "Monthly Income",
          "uniqueCode": "monthly_income",
          "responseType": "number",
          "rawValue": 750000,
          "normalizedValue": 0.85,
          "variableProportion": 0.25
        }
      ],
      "Personal Information": [
        {
          "variableId": 2,
          "variableName": "Age",
          "uniqueCode": "age",
          "responseType": "number",
          "rawValue": 35,
          "normalizedValue": 0.70,
          "variableProportion": 0.15
        }
      ]
    },
    "totalVariables": 8,
    "categoriesCount": 3
  }
}
```

---

### 5. Get Results by Upload Batch

Retrieve all results from a specific upload batch with pagination and search.

**Endpoint:** `GET /api/result/batch/{uploadBatchId}`  
**Authentication:** Required  
**Access:** Admin (all batches), Institution (own batches only)

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `uploadBatchId` | integer | Yes | Upload batch identifier |

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 20 | Number of results per page |
| `sortBy` | string | No | createdAt | Field to sort by |
| `sortOrder` | string | No | DESC | Sort order (ASC, DESC) |
| `search` | string | No | - | Search in client name, reference, email |

#### Request Example

```bash
curl -X GET "http://localhost:3000/api/result/batch/45?page=1&limit=10&search=john" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Batch results retrieved successfully",
  "data": {
    "results": [
      {
        "id": 1,
        "clientId": 123,
        "credit_limit": 500000.00,
        "interest_rate": 12.5,
        "uploadBatchId": 45,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "client": {
          "id": 123,
          "reference_number": "CLIENT001",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phoneNumber": "+237677777777"
        },
        "uploadBatch": {
          "id": 45,
          "name": "January 2024 Upload",
          "filename": "clients_jan_2024.csv",
          "createdAt": "2024-01-15T09:00:00.000Z",
          "status": "completed"
        }
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    },
    "batchSummary": {
      "totalClients": 25,
      "avgCreditLimit": 425000.50,
      "avgInterestRate": 14.2,
      "totalCreditLimit": 10625012.50
    }
  }
}
```

**Error Responses**

*404 Not Found*
```json
{
  "success": false,
  "message": "Upload batch not found or access denied"
}
```

---

### 6. Compare Results

Compare results between different batches or time periods with statistical analysis.

**Endpoint:** `GET /api/result/compare`  
**Authentication:** Required  
**Access:** Admin (all data), Institution (own data only)

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `batch1Id` | integer | No* | - | First batch ID for comparison |
| `batch2Id` | integer | No | - | Second batch ID for comparison |
| `dateFrom1` | string | No* | - | Start date for first dataset (ISO 8601) |
| `dateTo1` | string | No | - | End date for first dataset (ISO 8601) |
| `dateFrom2` | string | No | - | Start date for second dataset (ISO 8601) |
| `dateTo2` | string | No | - | End date for second dataset (ISO 8601) |
| `clientIds` | string | No | - | Comma-separated client IDs to compare |

*Either `batch1Id` or `dateFrom1` is required for the first dataset.

#### Request Example

```bash
curl -X GET "http://localhost:3000/api/result/compare?batch1Id=45&batch2Id=47&clientIds=123,124,125" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Results comparison completed successfully",
  "data": {
    "dataset1": {
      "count": 25,
      "avgCreditLimit": 425000.50,
      "avgInterestRate": 14.2,
      "creditLimitRange": {
        "min": 50000.00,
        "max": 800000.00
      },
      "interestRateRange": {
        "min": 8.5,
        "max": 22.0
      }
    },
    "dataset2": {
      "count": 28,
      "avgCreditLimit": 445000.75,
      "avgInterestRate": 13.8,
      "creditLimitRange": {
        "min": 60000.00,
        "max": 850000.00
      },
      "interestRateRange": {
        "min": 8.0,
        "max": 21.5
      }
    },
    "differences": {
      "countDiff": 3,
      "avgCreditLimitDiff": 20000.25,
      "avgInterestRateDiff": -0.4,
      "avgCreditLimitPercentChange": 4.71,
      "avgInterestRatePercentChange": -2.82
    }
  }
}
```

**Error Responses**

*400 Bad Request*
```json
{
  "success": false,
  "message": "Either batch1Id or dateFrom1 is required for comparison"
}
```

*404 Not Found*
```json
{
  "success": false,
  "message": "Batch 1 not found or access denied"
}
```

---

### 7. Export Results

Export results to CSV or JSON format with filtering options.

**Endpoint:** `GET /api/result/export`  
**Authentication:** Required  
**Access:** Admin (all data), Institution (own data only)

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `uploadBatchId` | integer | No | - | Filter by upload batch |
| `clientIds` | string | No | - | Comma-separated client IDs |
| `dateFrom` | string | No | - | Start date filter (ISO 8601) |
| `dateTo` | string | No | - | End date filter (ISO 8601) |
| `format` | string | No | csv | Export format (csv, json) |

#### Request Example

```bash
# Export as CSV
curl -X GET "http://localhost:3000/api/result/export?uploadBatchId=45&format=csv" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -o results_export.csv

# Export as JSON
curl -X GET "http://localhost:3000/api/result/export?clientIds=123,124,125&format=json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Response

**Success (200 OK) - CSV Format**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="client_results_export.csv"

"Client ID","Client Name","Email","Phone","Credit Limit","Interest Rate","Upload Batch","Created At"
"CLIENT001","John Doe","john.doe@example.com","+237677777777","500000","12.5","January 2024 Upload","2024-01-15T10:30:00.000Z"
"CLIENT002","Jane Smith","jane.smith@example.com","+237688888888","450000","13.2","January 2024 Upload","2024-01-15T10:35:00.000Z"
```

**Success (200 OK) - JSON Format**
```json
{
  "success": true,
  "message": "Results exported successfully",
  "data": [
    {
      "id": 1,
      "clientId": 123,
      "credit_limit": 500000.00,
      "interest_rate": 12.5,
      "uploadBatchId": 45,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "client": {
        "reference_number": "CLIENT001",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+237677777777"
      },
      "uploadBatch": {
        "name": "January 2024 Upload",
        "filename": "clients_jan_2024.csv"
      }
    }
  ]
}
```

## Error Handling

### Common Error Responses

#### Authentication Errors

**401 Unauthorized - Missing Token**
```json
{
  "success": false,
  "message": "Unauthorized: No authorization header provided"
}
```

**401 Unauthorized - Invalid Token**
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token",
  "error": "jwt malformed"
}
```

**401 Unauthorized - Expired Token**
```json
{
  "success": false,
  "message": "Authorization failed: Token expired",
  "error": "jwt expired"
}
```

**403 Forbidden - Inactive Account**
```json
{
  "success": false,
  "message": "Your institution account has been deactivated. Please contact support."
}
```

#### Access Control Errors

**404 Not Found - Access Denied**
```json
{
  "success": false,
  "message": "Client not found or access denied"
}
```

**404 Not Found - Resource Not Found**
```json
{
  "success": false,
  "message": "Client result not found"
}
```

#### Server Errors

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Error fetching results",
  "error": "Database connection failed"
}
```

## Rate Limiting

- **Rate Limit:** 1000 requests per hour per user
- **Burst Limit:** 100 requests per minute
- **Headers:** Rate limit information is included in response headers:
  - `X-RateLimit-Limit`: Total requests allowed per hour
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when rate limit resets (Unix timestamp)

## Data Security & Privacy

### Role-Based Data Filtering

**Admin Users:**
- Access to all client data across all institutions
- Can view sensitive weight calculations and normalization details
- Full access to comparison and analytics features

**Institution Users:**
- Access limited to their own client data only
- Sensitive weight fields are automatically filtered out
- Cannot access data from other institutions

### Sensitive Fields (Admin Only)

The following fields are only visible to admin users:
- `sum_normalised_credit_limit_weights`
- `sum_normalised_interest_rate_weights`
- `creditLimitWeight` (in detailed variable breakdown)
- `interestRateWeight` (in detailed variable breakdown)
- `categoryWeights` (in detailed variable breakdown)

## Best Practices

### Pagination
- Always use pagination for large datasets
- Default page size is 20, maximum is 100
- Include pagination metadata in responses

### Filtering
- Use specific filters to reduce response size
- Combine multiple filters for precise results
- Date filters should use ISO 8601 format

### Caching
- Results are cached for 5 minutes
- Use ETags for conditional requests
- Cache-Control headers indicate caching policy

### Performance
- Use `limit` parameter to control response size
- Avoid requesting unnecessary fields
- Use batch operations when possible

## SDK Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

class ResultsAPI {
  constructor(baseURL, token) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getAllResults(params = {}) {
    try {
      const response = await this.client.get('/api/result', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch results: ${error.response?.data?.message || error.message}`);
    }
  }

  async getClientLatest(clientId, uploadBatchId = null) {
    try {
      const params = uploadBatchId ? { uploadBatchId } : {};
      const response = await this.client.get(`/api/result/client/${clientId}/latest`, { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch client result: ${error.response?.data?.message || error.message}`);
    }
  }

  async exportResults(params = {}) {
    try {
      const response = await this.client.get('/api/result/export', { 
        params: { ...params, format: 'json' }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to export results: ${error.response?.data?.message || error.message}`);
    }
  }
}

// Usage
const api = new ResultsAPI('http://localhost:3000', 'your-jwt-token');

// Get all results with filtering
api.getAllResults({
  page: 1,
  limit: 10,
  search: 'john',
  minCreditLimit: 100000
}).then(data => {
  console.log('Results:', data.data.results);
  console.log('Total:', data.data.pagination.total);
});

// Get latest result for a client
api.getClientLatest(123).then(data => {
  console.log('Latest result:', data.data);
});
```

### Python

```python
import requests
from typing import Optional, Dict, Any

class ResultsAPI:
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def get_all_results(self, **params) -> Dict[str, Any]:
        """Get all results with optional filtering"""
        response = requests.get(
            f'{self.base_url}/api/result',
            headers=self.headers,
            params=params
        )
        response.raise_for_status()
        return response.json()
    
    def get_client_latest(self, client_id: int, upload_batch_id: Optional[int] = None) -> Dict[str, Any]:
        """Get latest result for a specific client"""
        params = {'uploadBatchId': upload_batch_id} if upload_batch_id else {}
        response = requests.get(
            f'{self.base_url}/api/result/client/{client_id}/latest',
            headers=self.headers,
            params=params
        )
        response.raise_for_status()
        return response.json()
    
    def export_results(self, format: str = 'json', **params) -> Dict[str, Any]:
        """Export results in specified format"""
        params['format'] = format
        response = requests.get(
            f'{self.base_url}/api/result/export',
            headers=self.headers,
            params=params
        )
        response.raise_for_status()
        
        if format == 'csv':
            return response.text
        return response.json()

# Usage
api = ResultsAPI('http://localhost:3000', 'your-jwt-token')

# Get filtered results
results = api.get_all_results(
    page=1,
    limit=10,
    search='john',
    min_credit_limit=100000
)
print(f"Found {results['data']['pagination']['total']} results")

# Get client's latest result
latest = api.get_client_latest(123)
print(f"Credit limit: {latest['data']['credit_limit']}")
```

## Changelog

### Version 1.0.0 (Current)
- Initial release with full CRUD operations
- Role-based access control implementation
- Advanced filtering and search capabilities
- Export functionality (CSV/JSON)
- Comprehensive pagination support
- Statistical comparison features

---

**Last Updated:** January 2024  
**API Version:** 1.0.0  
**Documentation Version:** 1.0.0 