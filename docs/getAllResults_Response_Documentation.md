# getAllResults() API Response Documentation

## Overview

The `getAllResults()` method is a comprehensive endpoint that retrieves paginated credit scoring results with advanced filtering, search capabilities, and role-based access control. This document provides detailed information about all possible response structures.

**Endpoint:** `GET /api/result`  
**Controller:** `ResultsController.getAllResults()`  
**Authentication:** Required (JWT Bearer Token)  
**Authorization:** Role-based access control (Admin/Institution)

---

## Request Parameters

### Query Parameters

| Parameter | Type | Required | Default | Description | Validation |
|-----------|------|----------|---------|-------------|------------|
| `page` | integer | ❌ No | `1` | Page number for pagination | Min: 1 |
| `limit` | integer | ❌ No | `20` | Number of results per page | Min: 1, Max: 100 |
| `sortBy` | string | ❌ No | `createdAt` | Field to sort results by | Allowed: `createdAt`, `updatedAt`, `credit_limit`, `interest_rate` |
| `sortOrder` | string | ❌ No | `DESC` | Sort order | Allowed: `ASC`, `DESC` |
| `search` | string | ❌ No | - | Search across client name, reference number, email, phone | Text search |
| `uploadBatchId` | integer | ❌ No | - | Filter by specific upload batch | Must exist |
| `minCreditLimit` | number | ❌ No | - | Minimum credit limit filter | Positive number |
| `maxCreditLimit` | number | ❌ No | - | Maximum credit limit filter | Positive number |
| `minInterestRate` | number | ❌ No | - | Minimum interest rate filter | Positive number |
| `maxInterestRate` | number | ❌ No | - | Maximum interest rate filter | Positive number |
| `dateFrom` | string | ❌ No | - | Start date filter | ISO 8601 format |
| `dateTo` | string | ❌ No | - | End date filter | ISO 8601 format |
| `clientId` | integer | ❌ No | - | Filter by specific client | Must exist |

---

## Response Structures

### Successful Response (200 OK)

#### Standard Response Wrapper
```json
{
  "success": true,
  "message": "Results retrieved successfully",
  "data": {
    "results": [...],
    "pagination": {...},
    "summary": {...},
    "filters": {...}
  }
}
```

#### Complete Success Response Example (Admin User)
```json
{
  "success": true,
  "message": "Results retrieved successfully",
  "data": {
    "results": [
      {
        "id": 1,
        "clientId": 123,
        "credit_limit": 750000.50,
        "interest_rate": 12.75,
        "sum_normalised_credit_limit_weights": 0.8542,
        "sum_normalised_interest_rate_weights": 0.7231,
        "uploadBatchId": 47,
        "createdAt": "2024-02-15T10:30:00.000Z",
        "updatedAt": "2024-02-15T10:30:00.000Z",
        "client": {
          "id": 123,
          "reference_number": "CLIENT123",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phoneNumber": "+237677123456"
        },
        "uploadBatch": {
          "id": 47,
          "name": "February 2024 Credit Assessment",
          "filename": "clients_feb_2024.csv",
          "createdAt": "2024-02-15T09:00:00.000Z",
          "status": "completed"
        }
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    },
    "summary": {
      "totalResults": 1,
      "avgCreditLimit": 750000.50,
      "creditLimitRange": {
        "min": 750000.50,
        "max": 750000.50
      },
      "avgInterestRate": 12.75,
      "interestRateRange": {
        "min": 12.75,
        "max": 12.75
      }
    },
    "filters": {
      "applied": {
        "search": null,
        "uploadBatchId": null,
        "minCreditLimit": null,
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

#### Institution User Response (Filtered)
```json
{
  "success": true,
  "message": "Results retrieved successfully",
  "data": {
    "results": [
      {
        "id": 1,
        "clientId": 123,
        "credit_limit": 750000.50,
        "interest_rate": 12.75,
        "uploadBatchId": 47,
        "createdAt": "2024-02-15T10:30:00.000Z",
        "updatedAt": "2024-02-15T10:30:00.000Z",
        "client": {
          "id": 123,
          "reference_number": "CLIENT123",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phoneNumber": "+237677123456"
        },
        "uploadBatch": {
          "id": 47,
          "name": "February 2024 Credit Assessment",
          "filename": "clients_feb_2024.csv",
          "createdAt": "2024-02-15T09:00:00.000Z",
          "status": "completed"
        }
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    },
    "summary": {
      "totalResults": 1,
      "avgCreditLimit": 750000.50,
      "creditLimitRange": {
        "min": 750000.50,
        "max": 750000.50
      },
      "avgInterestRate": 12.75,
      "interestRateRange": {
        "min": 12.75,
        "max": 12.75
      }
    },
    "filters": {
      "applied": {
        "search": null,
        "uploadBatchId": null,
        "minCreditLimit": null,
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

#### Empty Results Response
```json
{
  "success": true,
  "message": "Results retrieved successfully",
  "data": {
    "results": [],
    "pagination": {
      "total": 0,
      "page": 1,
      "limit": 20,
      "totalPages": 0
    },
    "summary": {
      "totalResults": 0,
      "avgCreditLimit": 0,
      "creditLimitRange": {
        "min": 0,
        "max": 0
      },
      "avgInterestRate": 0,
      "interestRateRange": {
        "min": 0,
        "max": 0
      }
    },
    "filters": {
      "applied": {
        "search": null,
        "uploadBatchId": null,
        "minCreditLimit": null,
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

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required",
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied",
  "error": "Insufficient permissions to access this resource"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error fetching results",
  "error": "Database connection failed"
}
```

---

## Data Models

### ClientResult Object Structure

| Field | Type | Description | Admin Only | Constraints |
|-------|------|-------------|------------|-------------|
| `id` | integer | Unique result identifier (Primary Key) | ❌ | Auto-generated, positive integer |
| `clientId` | integer | Client foreign key reference | ❌ | References Client.id |
| `credit_limit` | number | Calculated credit limit amount | ❌ | Positive float, in local currency (XAF) |
| `interest_rate` | number | Calculated interest rate percentage | ❌ | Positive float, decimal format (e.g., 12.75 = 12.75%) |
| `sum_normalised_credit_limit_weights` | number | Sum of normalized credit limit weights | ✅ | Float range: 0.0-1.0, used in calculations |
| `sum_normalised_interest_rate_weights` | number | Sum of normalized interest rate weights | ✅ | Float range: 0.0-1.0, used in calculations |
| `uploadBatchId` | integer | Upload batch foreign key reference | ❌ | References UploadBatch.id, nullable |
| `createdAt` | string | Result creation timestamp | ❌ | ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) |
| `updatedAt` | string | Result last modification timestamp | ❌ | ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) |
| `client` | object | Associated client information | ❌ | Nested Client object |
| `uploadBatch` | object | Associated upload batch information | ❌ | Nested UploadBatch object, nullable |

### Client Object Structure (Nested)

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | integer | Client unique identifier (Primary Key) | Auto-generated, positive integer |
| `reference_number` | string | Client reference number | Unique across system, alphanumeric |
| `name` | string | Client full name | Required, 1-255 characters |
| `email` | string | Client email address | Required, valid email format |
| `phoneNumber` | string | Client phone number | Required, international format (+237XXXXXXXXX) |

### UploadBatch Object Structure (Nested)

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | integer | Upload batch unique identifier (Primary Key) | Auto-generated, positive integer |
| `name` | string | Upload batch display name | Required, 1-255 characters |
| `filename` | string | Original uploaded filename | Required, includes file extension |
| `createdAt` | string | Upload batch creation timestamp | ISO 8601 format |
| `status` | string | Upload batch processing status | Enum: 'processing', 'completed', 'failed', 'completed_with_errors' |

### Pagination Object Structure

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `total` | integer | Total number of results available | Non-negative integer |
| `page` | integer | Current page number | Positive integer, matches request parameter |
| `limit` | integer | Number of results per page | Positive integer, matches request parameter |
| `totalPages` | integer | Total number of pages available | Calculated: Math.ceil(total / limit) |

### Summary Object Structure

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `totalResults` | integer | Total number of results matching filters | Non-negative integer |
| `avgCreditLimit` | number | Average credit limit across all results | Positive float, 2 decimal places |
| `creditLimitRange` | object | Credit limit range statistics | Contains min and max values |
| `avgInterestRate` | number | Average interest rate across all results | Positive float, 2 decimal places |
| `interestRateRange` | object | Interest rate range statistics | Contains min and max values |

#### Credit Limit Range Object
```json
{
  "min": 50000.00,
  "max": 2000000.00
}
```

#### Interest Rate Range Object
```json
{
  "min": 8.50,
  "max": 18.75
}
```

### Filters Object Structure

| Field | Type | Description | Always Present |
|-------|------|-------------|----------------|
| `applied` | object | Contains all applied filter parameters | ✅ |

#### Applied Filters Object
```json
{
  "search": "string or null",
  "uploadBatchId": "integer or null",
  "minCreditLimit": "number or null",
  "maxCreditLimit": "number or null",
  "minInterestRate": "number or null",
  "maxInterestRate": "number or null",
  "dateFrom": "string or null",
  "dateTo": "string or null",
  "clientId": "integer or null"
}
```

---

## Role-Based Filtering

### Admin Users
- **Access Level:** Full access to all client data across all institutions
- **Data Visibility:** Complete data including sensitive weight calculations
- **Filtered Fields:** None - all fields are visible
- **Special Fields Available:**
  - `sum_normalised_credit_limit_weights`
  - `sum_normalised_interest_rate_weights`

### Institution Users
- **Access Level:** Limited to clients from their own institution only
- **Data Visibility:** Filtered data without sensitive weight information
- **Filtered Fields:** Weight calculation fields are removed
- **Automatically Filtered Fields:**
  - `sum_normalised_credit_limit_weights` (removed)
  - `sum_normalised_interest_rate_weights` (removed)

### Filtering Implementation
The filtering is implemented through the `filterResultsArray()` method:

```javascript
static filterResultsArray(results, userRole) {
    if (userRole === 'admin') {
        return results;
    }
    
    return results.map(result => {
        const resultObj = result.toJSON ? result.toJSON() : result;
        return ResultsController.filterResultFields(resultObj, userRole);
    });
}
```

---

## Database Query Details

### Main Query Structure
```sql
SELECT ClientResult.*, Client.*, UploadBatch.*
FROM ClientResult
LEFT JOIN Client ON ClientResult.clientId = Client.id
LEFT JOIN UploadBatch ON ClientResult.uploadBatchId = UploadBatch.id
WHERE [dynamic filters]
ORDER BY [sortBy] [sortOrder]
LIMIT [limit] OFFSET [offset]
```

### Institution Filtering
For institution users, additional WHERE clauses are automatically added:
- `Client.institutionId = :userId`
- `UploadBatch.institutionId = :userId`

### Summary Statistics Query
```sql
SELECT 
  COUNT(ClientResult.id) as totalResults,
  AVG(credit_limit) as avgCreditLimit,
  MIN(credit_limit) as minCreditLimit,
  MAX(credit_limit) as maxCreditLimit,
  AVG(interest_rate) as avgInterestRate,
  MIN(interest_rate) as minInterestRate,
  MAX(interest_rate) as maxInterestRate
FROM ClientResult
[same WHERE and JOIN clauses as main query]
```

---

## Business Logic

### Credit Scoring Calculations
The endpoint returns pre-calculated results based on these formulas:

#### Credit Limit Calculation
```
credit_limit = min_lendable_amount × sum_normalised_credit_limit_weights × client_income × income_multiple
```

**Constraints:**
- Result is capped at `max_lendable_amount` if it exceeds the limit
- Minimum value is `min_lendable_amount`
- Rounded to 2 decimal places

#### Interest Rate Calculation
```
interest_rate = min_interest_rate + ((max_interest_rate - min_interest_rate) × sum_normalised_interest_rate_weights)
```

**Constraints:**
- Result cannot exceed `max_interest_rate`
- Cannot be below `min_interest_rate`
- Rounded to 4 decimal places

### Search Functionality
The search parameter performs case-insensitive partial matching across:
- Client name (`Client.name`)
- Client reference number (`Client.reference_number`)
- Client email (`Client.email`)
- Client phone number (`Client.phoneNumber`)

### Sorting Options
Available sorting fields:
- `createdAt` (default)
- `updatedAt`
- `credit_limit`
- `interest_rate`

### Pagination
- Default page size: 20 results
- Maximum page size: 100 results
- Uses offset-based pagination
- Returns total count for accurate pagination calculation

---

## Performance Considerations

### Database Optimizations
- Uses `distinct: true` for accurate count with joins
- Indexes on frequently queried fields
- Efficient JOIN operations with proper foreign key constraints

### Memory Management
- Pagination limits memory usage
- Filtered results reduce payload size for institution users
- Lazy loading of associated data

### Query Optimization
- Conditional WHERE clauses only add filters when parameters are provided
- Efficient use of Sequelize ORM with raw SQL for summary statistics
- Proper use of database indexes for sorting and filtering

---

## Usage Examples

### Basic Request
```bash
curl -X GET "http://localhost:3000/api/result" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

### Advanced Filtering
```bash
curl -X GET "http://localhost:3000/api/result?page=1&limit=10&search=John&minCreditLimit=500000&maxCreditLimit=1000000&sortBy=credit_limit&sortOrder=DESC" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

### Date Range Filtering
```bash
curl -X GET "http://localhost:3000/api/result?dateFrom=2024-01-01&dateTo=2024-12-31&uploadBatchId=47" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

---

## Related Models

### Database Schema Relationships
```
ClientResult
├── belongsTo Client (clientId)
├── belongsTo UploadBatch (uploadBatchId)

Client
├── belongsTo Institution (institutionId)
├── hasMany ClientResult (clientId)
├── hasMany ClientVariableValue (clientId)

UploadBatch
├── belongsTo Institution (institutionId)
├── hasMany ClientResult (uploadBatchId)
├── hasMany ClientVariableValue (uploadBatchId)
```

### Model Constraints
- **ClientResult.clientId:** Foreign key, CASCADE delete
- **ClientResult.uploadBatchId:** Foreign key, SET NULL delete
- **Client.institutionId:** Foreign key, RESTRICT delete
- **UploadBatch.institutionId:** Foreign key, RESTRICT delete

---

## Security Considerations

### Authentication
- JWT Bearer token required for all requests
- Token validation on every request
- Role-based access control enforcement

### Authorization
- Institution users can only access their own data
- Admin users have full system access
- Automatic data filtering based on user role

### Data Protection
- Sensitive weight calculations hidden from institution users
- Institution-level data isolation
- No direct database access from client applications

---

## Error Handling

### Common Error Scenarios
1. **Authentication Failures:** Missing or invalid JWT tokens
2. **Authorization Failures:** Insufficient permissions for requested data
3. **Database Errors:** Connection issues, query failures
4. **Validation Errors:** Invalid parameter values
5. **Not Found Errors:** Requested resources don't exist

### Error Response Format
All errors follow the standard format:
```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error details"
}
```

### HTTP Status Codes
- **200:** Success
- **400:** Bad Request (validation errors)
- **401:** Unauthorized (authentication required)
- **403:** Forbidden (insufficient permissions)
- **404:** Not Found (resource doesn't exist)
- **500:** Internal Server Error (system errors) 