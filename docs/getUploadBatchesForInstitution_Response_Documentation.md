# getUploadBatchesForInstitution() Response Documentation

## Overview

The `getUploadBatchesForInstitution()` method retrieves a paginated list of upload batches for a specific institution with optional status filtering. This endpoint supports role-based access control, allowing administrators to view batches for any institution while restricting institution users to their own data.

**Endpoint:** `GET /api/csv/upload/batches/{institutionId}`  
**Controller Method:** `CSVUploadController.getUploadBatchesForInstitution()`  
**Authentication:** Required (JWT Bearer Token)  
**Access Control:** Role-based (admin/institution)

## Request Parameters

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `institutionId` | integer | ✅ | Unique identifier of the institution whose upload batches to retrieve |

### Query Parameters
| Parameter | Type | Required | Default | Description | Validation |
|-----------|------|----------|---------|-------------|------------|
| `page` | integer | ❌ | 1 | Page number for pagination | Min: 1 |
| `limit` | integer | ❌ | 10 | Number of results per page | Min: 1, Max: 100 |
| `status` | string | ❌ | null | Filter by batch status | Enum values (see below) |
| `dateFrom` | string | ❌ | null | Start date filter | ISO 8601 format |
| `dateTo` | string | ❌ | null | End date filter | ISO 8601 format |

### Status Filter Values
- `processing` - Batch is currently being processed
- `completed` - Batch processed successfully
- `failed` - Batch processing failed completely
- `completed_with_errors` - Batch completed with some errors

## Response Structure

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "batches": [
      {
        // UploadBatch objects - see detailed structure below
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

### Error Responses

#### 400 Bad Request - Invalid Institution ID
```json
{
  "success": false,
  "message": "Invalid institution ID provided"
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

#### 403 Forbidden - Institution Access Violation
```json
{
  "success": false,
  "message": "Access denied to institution data"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error fetching upload batches for institution",
  "error": "Database query failed"
}
```

## Detailed Data Structure

### Main Response Object

| Field | Type | Description | Always Present |
|-------|------|-------------|----------------|
| `success` | boolean | Indicates if the request was successful | ✅ |
| `data` | object | Main response payload (null on error) | ✅ |

### Data Object Structure

| Field | Type | Description | Always Present |
|-------|------|-------------|----------------|
| `batches` | array | Array of UploadBatch objects | ✅ |
| `pagination` | object | Pagination information | ✅ |

## UploadBatch Object Structure

### Core UploadBatch Fields

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | integer | Unique batch identifier (Primary Key) | Auto-generated, positive integer |
| `institutionId` | integer | Institution foreign key reference | References Institution.id |
| `filename` | string | Original uploaded filename | Required, includes file extension |
| `name` | string | Upload batch display name | Required, 1-255 characters |
| `description` | text | Upload batch description | Optional, nullable |
| `status` | string | Upload batch processing status | Enum values (see below) |
| `total_records` | integer | Total records in the batch | Non-negative integer, default: 0 |
| `processed_records` | integer | Successfully processed records | Non-negative integer, default: 0 |
| `failed_records` | integer | Failed records | Non-negative integer, default: 0 |
| `uploaded_by` | integer | User ID who uploaded the batch | Foreign key, nullable |
| `createdAt` | string | Batch creation timestamp | ISO 8601 format |
| `updatedAt` | string | Batch last modification timestamp | ISO 8601 format |

### Upload Batch Status Values

| Status | Description | Use Case |
|--------|-------------|----------|
| `processing` | Batch is currently being processed | Active uploads |
| `completed` | Batch processed successfully | Successful uploads |
| `failed` | Batch processing failed completely | Failed uploads |
| `completed_with_errors` | Batch completed with some errors | Partial failures |

**Complete UploadBatch Model Structure:**
```json
{
  "id": "integer (primary key, auto-increment)",
  "institutionId": "integer (foreign key to Institution)",
  "filename": "string (original filename)",
  "file_path": "string (server file path, nullable)",
  "name": "string (batch display name)",
  "description": "text (batch description, nullable)",
  "status": "enum ('processing', 'completed', 'failed', 'completed_with_errors')",
  "uploaded_by": "integer (user ID who uploaded, nullable)",
  "total_records": "integer (total rows in CSV, default: 0)",
  "processed_records": "integer (successfully processed rows, default: 0)",
  "failed_records": "integer (failed rows, default: 0)",
  "error_details": "text (JSON string of errors, nullable)",
  "createdAt": "datetime (auto-generated)",
  "updatedAt": "datetime (auto-updated)"
}
```

## Pagination Object Structure

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `total` | integer | Total number of batches available | Non-negative integer |
| `page` | integer | Current page number | Positive integer, starts from 1 |
| `limit` | integer | Number of results per page | Positive integer, max 100 |
| `totalPages` | integer | Total number of pages available | Calculated: Math.ceil(total / limit) |

**Example:**
```json
{
  "total": 45,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

## Complete Example Responses

### Success Response with Multiple Batches
```json
{
  "success": true,
  "data": {
    "batches": [
      {
        "id": 123,
        "institutionId": 5,
        "filename": "clients_data.csv",
        "name": "January 2024 Client Upload",
        "description": "Monthly client data upload for January 2024",
        "status": "completed",
        "total_records": 150,
        "processed_records": 148,
        "failed_records": 2,
        "uploaded_by": 1,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": 122,
        "institutionId": 5,
        "filename": "weekly_update.csv",
        "name": "Weekly Update Batch",
        "description": "Weekly client data update",
        "status": "completed_with_errors",
        "total_records": 75,
        "processed_records": 70,
        "failed_records": 5,
        "uploaded_by": 1,
        "createdAt": "2024-01-10T14:20:00.000Z",
        "updatedAt": "2024-01-10T14:20:00.000Z"
      },
      {
        "id": 121,
        "institutionId": 5,
        "filename": "new_clients.csv",
        "name": "New Client Registration",
        "description": "New client registration batch",
        "status": "processing",
        "total_records": 25,
        "processed_records": 0,
        "failed_records": 0,
        "uploaded_by": 1,
        "createdAt": "2024-01-20T09:15:00.000Z",
        "updatedAt": "2024-01-20T09:15:00.000Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

### Empty Results Response
```json
{
  "success": true,
  "data": {
    "batches": [],
    "pagination": {
      "total": 0,
      "page": 1,
      "limit": 20,
      "totalPages": 0
    }
  }
}
```

### Filtered Results Response (Status: completed)
```json
{
  "success": true,
  "data": {
    "batches": [
      {
        "id": 123,
        "institutionId": 5,
        "filename": "clients_data.csv",
        "name": "January 2024 Client Upload",
        "description": "Monthly client data upload for January 2024",
        "status": "completed",
        "total_records": 150,
        "processed_records": 150,
        "failed_records": 0,
        "uploaded_by": 1,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

## Role-Based Access Control

### Administrator Access
- **Full Access:** Can view upload batches for any institution
- **No Restrictions:** Can access any institution's batch data
- **Filtering:** Can filter by any institution ID
- **Use Cases:** System monitoring, audit trails, cross-institution analysis

### Institution Access
- **Restricted Access:** Can only view upload batches for their own institution
- **Automatic Filtering:** Access is automatically restricted to their institution ID
- **Security:** Cannot access batches from other institutions
- **Use Cases:** Own upload history, processing status monitoring

### Access Control Implementation
```javascript
// The endpoint automatically filters by institutionId
const whereCondition = { institutionId: institutionId, ...whereCondition };

// Institution users are restricted to their own institution
// Admin users can access any institution's data
```

## Business Logic

### Data Flow
1. **Request Processing:**
   - Extract `institutionId` from URL parameters
   - Extract query parameters (page, limit, status, dateFrom, dateTo)
   - Validate user authentication and role

2. **Access Control:**
   - For institution users: Verify they can access the requested institution
   - For admin users: Allow access to any institution
   - Return 403 if access is denied

3. **Data Retrieval:**
   - Query UploadBatch table with institution filter
   - Apply optional status filtering
   - Apply optional date range filtering using `dateFrom` and `dateTo`
   - Implement pagination with offset-based approach
   - Order results by creation date (newest first)

4. **Response Assembly:**
   - Format results with pagination metadata
   - Include success status and data structure

### Pagination Logic
- **Default Page Size:** 10 results per page
- **Maximum Page Size:** 100 results per page
- **Offset Calculation:** `(page - 1) * limit`
- **Total Pages:** `Math.ceil(total / limit)`

### Status and Date Filtering
When the `status` parameter is provided, the system adds a WHERE clause:
```sql
WHERE institutionId = :institutionId AND status = :status
```

When `dateFrom` and/or `dateTo` parameters are provided, the system adds date range filtering:
```sql
WHERE institutionId = :institutionId 
[AND status = :status]
[AND createdAt >= :dateFrom]
[AND createdAt <= :dateTo]
```

## Database Relationships

### Primary Query Structure
```sql
SELECT UploadBatch.*
FROM UploadBatch
WHERE institutionId = :institutionId
[AND status = :status]
[AND createdAt >= :dateFrom]
[AND createdAt <= :dateTo]
ORDER BY createdAt DESC
LIMIT :limit OFFSET :offset
```

### UploadBatch Associations
```javascript
UploadBatch.belongsTo(Institution, {
  foreignKey: 'institutionId',
  as: 'institution'
});

UploadBatch.hasMany(ClientResult, {
  foreignKey: 'uploadBatchId',
  as: 'clientResults'
});

UploadBatch.hasMany(ClientVariableValue, {
  foreignKey: 'uploadBatchId',
  as: 'clientVariableValues'
});
```

## Error Handling

### Common Error Scenarios

1. **Invalid Institution ID**
   - Status: 400 Bad Request
   - Message: "Invalid institution ID provided"
   - Occurs when institutionId is not a valid integer

2. **Institution Access Violation**
   - Status: 403 Forbidden
   - Message: "Access denied to institution data"
   - Occurs when institution user tries to access another institution's data

3. **Authentication Errors**
   - Status: 401 Unauthorized
   - Message: "Authentication required"
   - Occurs with missing or invalid JWT tokens

4. **Database Errors**
   - Status: 500 Internal Server Error
   - Message: "Error fetching upload batches for institution"
   - Includes detailed error message for debugging

### Error Response Format
All errors follow the standard API response format:
```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error details (optional)"
}
```

## Usage Examples

### cURL Examples

#### Get All Upload Batches for Institution
```bash
curl -X GET "http://localhost:3000/api/csv/upload/batches/5" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Get Upload Batches with Pagination
```bash
curl -X GET "http://localhost:3000/api/csv/upload/batches/5?page=2&limit=15" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Get Completed Upload Batches Only
```bash
curl -X GET "http://localhost:3000/api/csv/upload/batches/5?status=completed" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Get Failed Upload Batches with Pagination
```bash
curl -X GET "http://localhost:3000/api/csv/upload/batches/5?status=failed&page=1&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Get Upload Batches with Date Range Filtering
```bash
curl -X GET "http://localhost:3000/api/csv/upload/batches/5?dateFrom=2024-01-01&dateTo=2024-01-31" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Get Completed Batches Within Date Range
```bash
curl -X GET "http://localhost:3000/api/csv/upload/batches/5?status=completed&dateFrom=2024-01-01&dateTo=2024-01-31&page=1&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

### JavaScript Examples

#### Using Fetch API
```javascript
async function getUploadBatchesForInstitution(institutionId, options = {}) {
  const { page = 1, limit = 10, status = null, dateFrom = null, dateTo = null } = options;
  
  const url = new URL(`/api/csv/upload/batches/${institutionId}`, 'http://localhost:3000');
  url.searchParams.append('page', page);
  url.searchParams.append('limit', limit);
  if (status) {
    url.searchParams.append('status', status);
  }
  if (dateFrom) {
    url.searchParams.append('dateFrom', dateFrom);
  }
  if (dateTo) {
    url.searchParams.append('dateTo', dateTo);
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message);
  }
  
  return result.data;
}

// Usage examples
try {
  // Get all batches
  const allBatches = await getUploadBatchesForInstitution(5);
  console.log(`Total batches: ${allBatches.pagination.total}`);

  // Get completed batches only
  const completedBatches = await getUploadBatchesForInstitution(5, { 
    status: 'completed' 
  });
  console.log(`Completed batches: ${completedBatches.batches.length}`);

  // Get paginated results
  const page2Batches = await getUploadBatchesForInstitution(5, { 
    page: 2, 
    limit: 15 
  });
  console.log(`Page 2 batches: ${page2Batches.batches.length}`);

  // Get batches within date range
  const dateRangeBatches = await getUploadBatchesForInstitution(5, { 
    dateFrom: '2024-01-01', 
    dateTo: '2024-01-31' 
  });
  console.log(`Batches in date range: ${dateRangeBatches.batches.length}`);

  // Get completed batches within date range
  const completedInRange = await getUploadBatchesForInstitution(5, { 
    status: 'completed',
    dateFrom: '2024-01-01', 
    dateTo: '2024-01-31' 
  });
  console.log(`Completed batches in range: ${completedInRange.batches.length}`);
} catch (error) {
  console.error('Error:', error.message);
}
```

#### React Component Example
```jsx
import React, { useState, useEffect } from 'react';

const InstitutionUploadBatches = ({ institutionId, userRole }) => {
  const [batches, setBatches] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchBatches();
  }, [institutionId, filters]);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const url = new URL(`/api/csv/upload/batches/${institutionId}`, window.location.origin);
      Object.entries(filters).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBatches(data.data.batches);
        setPagination(data.data.pagination);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch upload batches');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (loading) return <div>Loading upload batches...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="institution-upload-batches">
      <h2>Upload Batches for Institution {institutionId}</h2>
      
      {/* Status Filter */}
      <div className="filters">
        <button 
          onClick={() => handleStatusFilter('')}
          className={filters.status === '' ? 'active' : ''}
        >
          All
        </button>
        <button 
          onClick={() => handleStatusFilter('processing')}
          className={filters.status === 'processing' ? 'active' : ''}
        >
          Processing
        </button>
        <button 
          onClick={() => handleStatusFilter('completed')}
          className={filters.status === 'completed' ? 'active' : ''}
        >
          Completed
        </button>
        <button 
          onClick={() => handleStatusFilter('failed')}
          className={filters.status === 'failed' ? 'active' : ''}
        >
          Failed
        </button>
        <button 
          onClick={() => handleStatusFilter('completed_with_errors')}
          className={filters.status === 'completed_with_errors' ? 'active' : ''}
        >
          Completed with Errors
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="date-filters">
        <div className="date-input">
          <label>From Date:</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value, page: 1 }))}
          />
        </div>
        <div className="date-input">
          <label>To Date:</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value, page: 1 }))}
          />
        </div>
        <button 
          onClick={() => setFilters(prev => ({ ...prev, dateFrom: '', dateTo: '', page: 1 }))}
          className="clear-dates"
        >
          Clear Dates
        </button>
      </div>

      {/* Batches List */}
      <div className="batches-list">
        {batches.map(batch => (
          <div key={batch.id} className={`batch-item status-${batch.status}`}>
            <div className="batch-header">
              <h3>{batch.name}</h3>
              <span className={`status-badge ${batch.status}`}>
                {batch.status.replace('_', ' ')}
              </span>
            </div>
            <div className="batch-details">
              <p><strong>Filename:</strong> {batch.filename}</p>
              <p><strong>Description:</strong> {batch.description || 'No description'}</p>
              <p><strong>Records:</strong> {batch.processed_records}/{batch.total_records} processed</p>
              {batch.failed_records > 0 && (
                <p><strong>Failed:</strong> {batch.failed_records} records</p>
              )}
              <p><strong>Created:</strong> {new Date(batch.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="summary">
        <p>Total batches: {pagination.total}</p>
        <p>Showing {batches.length} of {pagination.total} batches</p>
      </div>
    </div>
  );
};

export default InstitutionUploadBatches;
```

## Performance Considerations

### Database Optimization
- **Indexes:** Ensure proper indexes on `institutionId` and `status` in UploadBatch table
- **Query Optimization:** Uses efficient WHERE clauses with proper indexing
- **Pagination:** Implements offset-based pagination for large datasets

### Caching Strategies
- **Result Caching:** Consider caching results for frequently accessed institutions
- **TTL:** Set appropriate cache expiration based on data update frequency
- **Cache Keys:** Use pattern like `upload_batches:${institutionId}:${status}:${page}:${limit}`

### Security Considerations
- **Role-based Access:** Strict filtering based on user role and institution
- **Input Validation:** Institution ID and query parameter validation
- **Authentication:** JWT token validation for all requests
- **Data Isolation:** Institution users cannot access other institutions' data

## Testing

### Unit Test Examples

```javascript
describe('CSVUploadController.getUploadBatchesForInstitution', () => {
  it('should return upload batches for valid institution', async () => {
    const req = {
      params: { institutionId: '5' },
      query: { page: '1', limit: '10' },
      user: { role: 'admin', id: 1 }
    };
    const res = mockResponse();

    await CSVUploadController.getUploadBatchesForInstitution(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        batches: expect.any(Array),
        pagination: expect.objectContaining({
          total: expect.any(Number),
          page: 1,
          limit: 10,
          totalPages: expect.any(Number)
        })
      }
    });
  });

  it('should filter by status when provided', async () => {
    const req = {
      params: { institutionId: '5' },
      query: { status: 'completed' },
      user: { role: 'admin', id: 1 }
    };
    const res = mockResponse();

    await CSVUploadController.getUploadBatchesForInstitution(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.objectContaining({
        batches: expect.arrayContaining([
          expect.objectContaining({ status: 'completed' })
        ])
      })
    });
  });

  it('should return 400 for invalid institution ID', async () => {
    const req = {
      params: { institutionId: 'invalid' },
      query: {},
      user: { role: 'admin', id: 1 }
    };
    const res = mockResponse();

    await CSVUploadController.getUploadBatchesForInstitution(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid institution ID provided'
    });
  });
});
```

### Integration Test Examples

```javascript
describe('GET /api/csv/upload/batches/:institutionId', () => {
  it('should return upload batches for valid institution', async () => {
    const response = await request(app)
      .get('/api/csv/upload/batches/5')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        batches: expect.any(Array),
        pagination: expect.objectContaining({
          total: expect.any(Number),
          page: 1,
          limit: 10,
          totalPages: expect.any(Number)
        })
      }
    });
  });

  it('should filter results by status', async () => {
    const response = await request(app)
      .get('/api/csv/upload/batches/5?status=completed')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.data.batches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ status: 'completed' })
      ])
    );
  });

  it('should enforce institution access control', async () => {
    const response = await request(app)
      .get('/api/csv/upload/batches/999')
      .set('Authorization', `Bearer ${institutionToken}`)
      .expect(403);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Access denied to institution data'
    });
  });
});
```

## Related Endpoints

- `GET /api/csv/batches` - Get all upload batches (admin only)
- `GET /api/csv/batch/{id}` - Get specific upload batch details
- `GET /api/csv/batch/{id}/errors` - Get upload batch errors
- `POST /api/csv/upload` - Upload and process CSV file
- `GET /api/csv/template` - Download CSV template

## Changelog

### Version History

- **v1.0.0** - Initial implementation with basic institution batch retrieval
- **v1.1.0** - Added status filtering capability
- **v1.2.0** - Enhanced pagination and error handling
- **v1.3.0** - Added comprehensive access control and validation

### Recent Changes

- **2024-02-15:** Added institution-specific access control
- **2024-02-10:** Implemented status filtering functionality
- **2024-02-05:** Enhanced pagination with proper metadata
- **2024-01-30:** Added comprehensive error handling and validation

---

## Related Documentation

- [CSV Upload Management Endpoints](./api_endpoints.md#csv-upload-management-endpoints)
- [UploadBatch Model Documentation](./database_schema.md#uploadbatch-model)
- [API Authentication Guide](./api_authentication.md)
- [Role-Based Access Control](./rbac_documentation.md) 