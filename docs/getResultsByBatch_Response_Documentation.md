# getResultsByBatch() Response Documentation

## Overview

The `getResultsByBatch()` method retrieves paginated results for a specific upload batch with optional search functionality. This endpoint supports role-based access control with different data visibility for administrators and institutions.

**Endpoint:** `GET /api/results/batch/:uploadBatchId`  
**Controller Method:** `ResultsController.getResultsByBatch()`  
**Authentication:** Required (JWT Bearer Token)  
**Access Control:** Role-based (admin/institution)

## Request Parameters

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `uploadBatchId` | integer | ✅ | Unique identifier of the upload batch |

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | ❌ | 1 | Page number for pagination |
| `limit` | integer | ❌ | 20 | Number of results per page |
| `sortBy` | string | ❌ | 'createdAt' | Field to sort by |
| `sortOrder` | string | ❌ | 'DESC' | Sort order (ASC/DESC) |
| `search` | string | ❌ | null | Search term for client name, reference number, or email |

## Response Structure

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Batch results retrieved successfully",
  "data": {
    "results": [
      {
        // ClientResult objects - see detailed structure below
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    },
    "batchSummary": {
      "totalClients": 150,
      "avgCreditLimit": 45750.50,
      "avgInterestRate": 11.8,
      "totalCreditLimit": 6862575.00
    }
  }
}
```

### Error Responses

#### 404 Not Found - Batch Access Denied (Institution Role)
```json
{
  "success": false,
  "message": "Upload batch not found or access denied"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error fetching batch results",
  "error": "Detailed error message"
}
```

## Detailed Data Structure

### Main Response Object

| Field | Type | Description | Always Present |
|-------|------|-------------|----------------|
| `success` | boolean | Indicates if the request was successful | ✅ |
| `message` | string | Human-readable status message | ✅ |
| `data` | object | Main response payload (null on error) | ✅ |

### Data Object Structure

| Field | Type | Description | Always Present |
|-------|------|-------------|----------------|
| `results` | array | Array of ClientResult objects | ✅ |
| `pagination` | object | Pagination information | ✅ |
| `batchSummary` | object | Statistical summary of the batch | ✅ |

## ClientResult Object Structure

### Core ClientResult Fields

| Field | Type | Description | Admin Only | Institution | Notes |
|-------|------|-------------|------------|-------------|-------|
| `id` | integer | Unique result identifier (Primary Key) | ❌ | ✅ | Auto-generated |
| `clientId` | integer | Client foreign key reference | ❌ | ✅ | References Client.id |
| `credit_limit` | number | Calculated credit limit amount | ❌ | ✅ | In local currency (XAF) |
| `interest_rate` | number | Calculated interest rate percentage | ❌ | ✅ | Decimal format (e.g., 12.75%) |
| `sum_normalised_credit_limit_weights` | number | Sum of normalized credit limit weights | ✅ | ❌ | Range: 0.0-1.0, filtered for institutions |
| `sum_normalised_interest_rate_weights` | number | Sum of normalized interest rate weights | ✅ | ❌ | Range: 0.0-1.0, filtered for institutions |
| `uploadBatchId` | integer | Upload batch foreign key reference | ❌ | ✅ | References UploadBatch.id |
| `createdAt` | string | Result creation timestamp | ❌ | ✅ | ISO 8601 format |
| `updatedAt` | string | Result last modification timestamp | ❌ | ✅ | ISO 8601 format |
| `client` | object | Associated client information | ❌ | ✅ | Nested Client object |
| `uploadBatch` | object | Associated upload batch information | ❌ | ✅ | Nested UploadBatch object |

### Client Object (Nested)

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | integer | Client unique identifier (Primary Key) | Auto-generated, positive integer |
| `reference_number` | string | Client reference number | Unique across system, alphanumeric |
| `name` | string | Client full name | Required, 1-255 characters |
| `email` | string | Client email address | Required, valid email format |
| `phoneNumber` | string | Client phone number | Required, international format |

**Complete Client Model Structure:**
```json
{
  "id": 456,
  "reference_number": "REF-2024-001",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+237677777777"
}
```

### UploadBatch Object (Nested)

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | integer | Upload batch unique identifier (Primary Key) | Auto-generated, positive integer |
| `name` | string | Upload batch display name | Required, 1-255 characters |
| `filename` | string | Original uploaded filename | Required, includes file extension |
| `createdAt` | string | Upload batch creation timestamp | ISO 8601 format |
| `status` | string | Upload batch processing status | Enum values (see below) |

**Upload Batch Status Values:**
- `processing` - Batch is being processed
- `completed` - Batch processed successfully
- `failed` - Batch processing failed
- `completed_with_errors` - Batch completed with some errors

**Complete UploadBatch Model Structure:**
```json
{
  "id": 123,
  "name": "Q1 2024 Credit Assessment",
  "filename": "clients_q1_2024.csv",
  "createdAt": "2024-01-15T09:00:00.000Z",
  "status": "completed"
}
```

**Full UploadBatch Model Fields (not all returned in response):**
- `id`: integer (Primary Key)
- `institutionId`: integer (Foreign Key to Institution)
- `filename`: string (Original filename)
- `file_path`: string (Server file path)
- `status`: enum ('processing', 'completed', 'failed', 'completed_with_errors')
- `uploaded_by`: integer (User ID who uploaded)
- `total_records`: integer (Total records in batch)
- `processed_records`: integer (Successfully processed records)
- `failed_records`: integer (Failed records)
- `error_details`: text (Error details if any)
- `name`: string (Display name)
- `description`: text (Batch description)
- `createdAt`: datetime
- `updatedAt`: datetime

## Pagination Object Structure

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `total` | integer | Total number of results available | Non-negative integer |
| `page` | integer | Current page number | Positive integer, starts from 1 |
| `limit` | integer | Number of results per page | Positive integer, max 100 |
| `totalPages` | integer | Total number of pages available | Calculated: Math.ceil(total / limit) |

**Example:**
```json
{
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

## Batch Summary Object Structure

| Field | Type | Description | Calculation |
|-------|------|-------------|-------------|
| `totalClients` | integer | Total number of clients in the batch | COUNT of ClientResult records |
| `avgCreditLimit` | number | Average credit limit across all clients | AVG of credit_limit field |
| `avgInterestRate` | number | Average interest rate across all clients | AVG of interest_rate field |
| `totalCreditLimit` | number | Sum of all credit limits in the batch | SUM of credit_limit field |

**Example:**
```json
{
  "totalClients": 150,
  "avgCreditLimit": 45750.50,
  "avgInterestRate": 11.8,
  "totalCreditLimit": 6862575.00
}
```

## Role-Based Data Filtering

### Administrator Access
- **Full Access**: Can see all fields including sensitive weight calculations
- **No Restrictions**: Can access any upload batch across all institutions
- **Weight Fields Included**:
  - `sum_normalised_credit_limit_weights`
  - `sum_normalised_interest_rate_weights`

### Institution Access
- **Restricted Access**: Can only see upload batches belonging to their institution
- **Filtered Fields**: Weight-related fields are removed from response
- **Access Control**: 
  - Must own the upload batch (`uploadBatch.institutionId = user.id`)
  - Can only see clients belonging to their institution
- **Weight Fields Excluded**:
  - `sum_normalised_credit_limit_weights` (removed)
  - `sum_normalised_interest_rate_weights` (removed)

## Search Functionality

When the `search` query parameter is provided, the system searches across:
- Client `name` (case-insensitive partial match)
- Client `reference_number` (case-insensitive partial match)
- Client `email` (case-insensitive partial match)

**Search Implementation:**
```sql
WHERE (
  name ILIKE '%search_term%' OR
  reference_number ILIKE '%search_term%' OR
  email ILIKE '%search_term%'
)
```

## Database Relationships

### Primary Query Structure
```sql
SELECT ClientResult.*, Client.*, UploadBatch.*
FROM ClientResult
JOIN Client ON ClientResult.clientId = Client.id
JOIN UploadBatch ON ClientResult.uploadBatchId = UploadBatch.id
WHERE ClientResult.uploadBatchId = :uploadBatchId
```

### Institution Filtering (when user role = 'institution')
```sql
-- Additional WHERE clauses added:
AND Client.institutionId = :userId
AND UploadBatch.institutionId = :userId
```

## Complete Example Responses

### Admin User Response
```json
{
  "success": true,
  "message": "Batch results retrieved successfully",
  "data": {
    "results": [
      {
        "id": 1,
        "clientId": 456,
        "credit_limit": 750000.00,
        "interest_rate": 12.5,
        "sum_normalised_credit_limit_weights": 0.75,
        "sum_normalised_interest_rate_weights": 0.68,
        "uploadBatchId": 123,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "client": {
          "id": 456,
          "reference_number": "REF-2024-001",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phoneNumber": "+237677777777"
        },
        "uploadBatch": {
          "id": 123,
          "name": "Q1 2024 Credit Assessment",
          "filename": "clients_q1_2024.csv",
          "createdAt": "2024-01-15T09:00:00.000Z",
          "status": "completed"
        }
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    },
    "batchSummary": {
      "totalClients": 150,
      "avgCreditLimit": 45750.50,
      "avgInterestRate": 11.8,
      "totalCreditLimit": 6862575.00
    }
  }
}
```

### Institution User Response
```json
{
  "success": true,
  "message": "Batch results retrieved successfully",
  "data": {
    "results": [
      {
        "id": 1,
        "clientId": 456,
        "credit_limit": 750000.00,
        "interest_rate": 12.5,
        "uploadBatchId": 123,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "client": {
          "id": 456,
          "reference_number": "REF-2024-001",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phoneNumber": "+237677777777"
        },
        "uploadBatch": {
          "id": 123,
          "name": "Q1 2024 Credit Assessment",
          "filename": "clients_q1_2024.csv",
          "createdAt": "2024-01-15T09:00:00.000Z",
          "status": "completed"
        }
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    },
    "batchSummary": {
      "totalClients": 150,
      "avgCreditLimit": 45750.50,
      "avgInterestRate": 11.8,
      "totalCreditLimit": 6862575.00
    }
  }
}
```

## Error Handling

### Common Error Scenarios

1. **Invalid Upload Batch ID**
   - Status: 404 Not Found
   - Message: "Upload batch not found or access denied"

2. **Institution Access Violation**
   - Status: 404 Not Found
   - Message: "Upload batch not found or access denied"
   - Occurs when institution tries to access batch they don't own

3. **Database Connection Issues**
   - Status: 500 Internal Server Error
   - Message: "Error fetching batch results"
   - Includes detailed error message

4. **Invalid Query Parameters**
   - Status: 500 Internal Server Error
   - May occur with invalid pagination parameters

## Implementation Notes

### Data Filtering Process
1. Query executes with institution-specific WHERE clauses if user role is 'institution'
2. Results are retrieved with associated Client and UploadBatch data
3. `filterResultsArray()` method processes each result:
   - For admin users: Returns data unchanged
   - For institution users: Removes weight-related fields using `filterResultFields()`

### Performance Considerations
- Uses `distinct: true` in `findAndCountAll()` for accurate pagination with JOINs
- Implements proper indexing on foreign keys
- Search functionality uses case-insensitive ILIKE queries (PostgreSQL)
- Batch summary calculated with separate aggregation query

### Security Features
- Role-based access control enforced at database level
- Institution data isolation prevents cross-institution data access
- Sensitive weight calculations hidden from institution users
- Input validation on all query parameters

## Related Endpoints

- `GET /api/results/client/:clientId/latest` - Get latest result for specific client
- `GET /api/results/client/:clientId/history` - Get client result history
- `GET /api/results` - Get all results with filtering
- `GET /api/results/compare` - Compare results between batches
- `GET /api/results/export` - Export results to CSV 