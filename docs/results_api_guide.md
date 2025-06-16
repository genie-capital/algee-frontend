# Results API Documentation

## Overview

The Results API provides comprehensive endpoints for retrieving, filtering, searching, and analyzing credit scoring calculation results. It supports advanced filtering, pagination, comparison between different datasets, and detailed breakdowns of client results.

## Base URL
```
/api/results
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get All Results with Advanced Filtering

**GET** `/api/results`

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
GET /api/results?page=1&limit=10&search=john&minCreditLimit=100000&maxCreditLimit=1000000&sortBy=credit_limit&sortOrder=DESC
```

#### Example Response
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
        "minCreditLimit": 100000,
        "maxCreditLimit": 1000000
      }
    }
  }
}
```

### 2. Get Latest Client Result

**GET** `/api/results/client/:clientId/latest`

Get the most recent credit scoring result for a specific client.

#### Parameters
- `clientId` (path): Client ID

#### Query Parameters
- `uploadBatchId` (optional): Specific upload batch ID

#### Example Request
```bash
GET /api/results/client/123/latest?uploadBatchId=5
```

#### Example Response
```json
{
  "success": true,
  "message": "Latest client result retrieved successfully",
  "data": {
    "id": 1,
    "clientId": 123,
    "creditLimit": 750000,
    "interestRate": 15.5,
    "sumNormalisedCreditLimitWeights": 0.85,
    "sumNormalisedInterestRateWeights": 0.72,
    "uploadBatchId": 5,
    "createdAt": "2025-06-06T10:30:00Z",
    "client": {
      "reference_number": "CLIENT001",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 3. Get Client Result History

**GET** `/api/results/client/:clientId/history`

Get historical credit scoring results for a specific client.

#### Parameters
- `clientId` (path): Client ID

#### Query Parameters
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 10)
- `sortBy` (string): Sort field (default: createdAt)
- `sortOrder` (string): Sort order (default: DESC)
- `uploadBatchId` (number): Filter by upload batch

#### Example Request
```bash
GET /api/results/client/123/history?page=1&limit=5
```

### 4. Get Detailed Client Result

**GET** `/api/results/client/:clientId/detailed`

Get detailed client result with complete variable breakdown and normalization details.

#### Parameters
- `clientId` (path): Client ID

#### Query Parameters
- `uploadBatchId` (optional): Specific upload batch ID

#### Example Response
```json
{
  "success": true,
  "message": "Detailed client result retrieved successfully",
  "data": {
    "clientResult": {
      "id": 1,
      "creditLimit": 750000,
      "interestRate": 15.5
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
          "creditLimitWeight": 0.25,
          "interestRateWeight": 0.22,
          "variableProportion": 100,
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
          "creditLimitWeight": 0.15,
          "interestRateWeight": 0.18
        }
      ]
    },
    "totalVariables": 8,
    "categoriesCount": 4
  }
}
```

### 5. Get Results by Upload Batch

**GET** `/api/results/batch/:uploadBatchId`

Get all results for a specific upload batch.

#### Parameters
- `uploadBatchId` (path): Upload batch ID

#### Query Parameters
- `page`, `limit`, `sortBy`, `sortOrder`, `search`: Standard pagination and search

#### Example Response
```json
{
  "success": true,
  "message": "Batch results retrieved successfully",
  "data": {
    "results": [...],
    "pagination": {...},
    "batchSummary": {
      "totalClients": 50,
      "avgCreditLimit": 625000,
      "avgInterestRate": 16.25,
      "totalCreditLimit": 31250000
    }
  }
}
```

### 6. Compare Results

**GET** `/api/results/compare`

Compare results between different batches or time periods.

#### Query Parameters
- `batch1Id`: First batch ID for comparison
- `batch2Id`: Second batch ID for comparison
- `dateFrom1`, `dateTo1`: Date range for first dataset
- `dateFrom2`, `dateTo2`: Date range for second dataset
- `clientIds`: Comma-separated client IDs to compare

#### Example Request
```bash
GET /api/results/compare?batch1Id=5&batch2Id=6
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

### 7. Export Results

**GET** `/api/results/export`

Export results to CSV or JSON format.

#### Query Parameters
- `uploadBatchId`: Filter by upload batch
- `clientIds`: Comma-separated client IDs
- `dateFrom`, `dateTo`: Date range filters
- `format`: Export format (csv or json, default: csv)

#### Example Request
```bash
GET /api/results/export?uploadBatchId=5&format=csv
```

#### CSV Response
Returns a CSV file with headers:
```
Client ID,Client Name,Email,Phone,Credit Limit,Interest Rate,Credit Limit Weight,Interest Rate Weight,Upload Batch,Created At
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

## Common HTTP Status Codes

- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (missing or invalid token)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

## Usage Examples

### 1. Search for clients with high credit limits
```bash
GET /api/results?minCreditLimit=1000000&sortBy=credit_limit&sortOrder=DESC
```

### 2. Get results from last month
```bash
GET /api/results?dateFrom=2025-05-01&dateTo=2025-05-31
```

### 3. Find clients with low interest rates
```bash
GET /api/results?maxInterestRate=15&sortBy=interest_rate&sortOrder=ASC
```

### 4. Search by client name
```bash
GET /api/results?search=john%20doe
```

### 5. Export specific batch results
```bash
GET /api/results/export?uploadBatchId=5&format=csv
```

### 6. Compare two batches
```bash
GET /api/results/compare?batch1Id=5&batch2Id=6
```

## Best Practices

1. **Pagination**: Always use pagination for large datasets
2. **Filtering**: Use specific filters to reduce response size
3. **Caching**: Results are relatively static, consider caching on client side
4. **Export**: Use export endpoint for large datasets rather than fetching all pages
5. **Search**: Use search parameter for text-based queries
6. **Comparison**: Use comparison endpoint for analytics and reporting

## Rate Limiting

- Standard rate limiting applies: 100 requests per minute per user
- Export endpoints have lower limits: 10 requests per minute
- Large exports may take time to process

## Data Freshness

- Results are calculated during CSV upload
- Data is real-time for recently uploaded batches
- Historical data remains unchanged unless recalculated 