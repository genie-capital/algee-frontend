# getLatestClientResult() Response Documentation

## Overview
This document provides comprehensive documentation for the `getLatestClientResult()` method in the `ResultsController` class, including all possible response structures, data models, and role-based filtering.

**Endpoint:** `GET /api/results/client/:clientId/latest`  
**Method:** `ResultsController.getLatestClientResult()`  
**Access:** Admin and Institution users  
**Authentication:** Required (JWT Token)

---

## Request Parameters

### Path Parameters
- `clientId` (integer, required): The unique identifier of the client

### Query Parameters
- `uploadBatchId` (integer, optional): Filter results by specific upload batch

### Headers
- `Authorization: Bearer <jwt_token>` (required)

---

## Response Structures

### Success Response (200 OK)

#### Admin User Response
Admins receive complete data including sensitive weight calculations:

```json
{
  "success": true,
  "message": "Latest client result retrieved successfully",
  "data": {
    "id": 42,
    "clientId": 123,
    "creditLimit": 750000.50,
    "interestRate": 12.75,
    "sumNormalisedCreditLimitWeights": 0.8234,
    "sumNormalisedInterestRateWeights": 0.6891,
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
      "createdAt": "2024-02-15T09:00:00.000Z"
    }
  }
}
```

#### Institution User Response
Institutions receive filtered data with sensitive weight calculations removed:

```json
{
  "success": true,
  "message": "Latest client result retrieved successfully",
  "data": {
    "id": 42,
    "clientId": 123,
    "creditLimit": 750000.50,
    "interestRate": 12.75,
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
      "createdAt": "2024-02-15T09:00:00.000Z"
    }
  }
}
```

### Error Responses

#### 404 Not Found - Client Not Found or Access Denied
```json
{
  "success": false,
  "message": "Client not found or access denied"
}
```

#### 404 Not Found - No Results Available
```json
{
  "success": false,
  "message": "Client result not found"
}
```

#### 401 Unauthorized - Missing or Invalid Token
```json
{
  "success": false,
  "message": "Authentication required",
  "error": "No token provided"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error fetching latest client result",
  "error": "Database connection failed"
}
```

---

## Data Models

### Response Wrapper Structure

| Field | Type | Description | Always Present |
|-------|------|-------------|----------------|
| `success` | boolean | Indicates if the request was successful | ✅ |
| `message` | string | Human-readable status message | ✅ |
| `data` | object | Main response payload (null on error) | ✅ |
| `error` | string | Error details (only present on errors) | ❌ |

### ClientResult Object Structure

| Field | Type | Description | Admin Only | Constraints |
|-------|------|-------------|------------|-------------|
| `id` | integer | Unique result identifier (Primary Key) | ❌ | Auto-generated, positive integer |
| `clientId` | integer | Client foreign key reference | ❌ | References Client.id |
| `creditLimit` | number | Calculated credit limit amount | ❌ | Positive float, in local currency (XAF) |
| `interestRate` | number | Calculated interest rate percentage | ❌ | Positive float, decimal format (e.g., 12.75 = 12.75%) |
| `sumNormalisedCreditLimitWeights` | number | Sum of normalized credit limit weights | ✅ | Float range: 0.0-1.0, used in calculations |
| `sumNormalisedInterestRateWeights` | number | Sum of normalized interest rate weights | ✅ | Float range: 0.0-1.0, used in calculations |
| `uploadBatchId` | integer | Upload batch foreign key reference | ❌ | References UploadBatch.id, nullable |
| `createdAt` | string | Result creation timestamp | ❌ | ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) |
| `updatedAt` | string | Result last modification timestamp | ❌ | ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) |
| `client` | object | Associated client information | ❌ | Nested Client object |
| `uploadBatch` | object | Associated upload batch information | ❌ | Nested UploadBatch object, nullable |

**Database Model Structure (ClientResult):**
```json
{
  "id": "integer (primary key, auto-increment)",
  "clientId": "integer (foreign key to Client)",
  "credit_limit": "float (calculated credit limit)",
  "interest_rate": "float (calculated interest rate percentage)",
  "sum_normalised_credit_limit_weights": "float (0-1 range, nullable)",
  "sum_normalised_interest_rate_weights": "float (0-1 range, nullable)",
  "uploadBatchId": "integer (foreign key to UploadBatch, nullable)",
  "createdAt": "datetime (auto-generated)",
  "updatedAt": "datetime (auto-generated)"
}
```

### Client Object Structure (Nested)

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | integer | Client unique identifier (Primary Key) | Auto-generated, positive integer |
| `reference_number` | string | Client reference number | Unique across system, alphanumeric |
| `name` | string | Client full name | Required, 1-255 characters |
| `email` | string | Client email address | Required, valid email format |
| `phoneNumber` | string | Client phone number | Required, international format (+237XXXXXXXXX) |

**Complete Client Model Structure:**
```json
{
  "id": "integer (primary key, auto-increment)",
  "name": "string (client full name)",
  "phoneNumber": "string (client phone number)",
  "email": "string (client email address)",
  "institutionId": "integer (foreign key to Institution)",
  "reference_number": "string (unique client identifier)",
  "createdAt": "datetime (auto-generated)",
  "updatedAt": "datetime (auto-generated)"
}
```

### UploadBatch Object Structure (Nested)

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | integer | Upload batch unique identifier (Primary Key) | Auto-generated, positive integer |
| `name` | string | Upload batch display name | Required, 1-255 characters |
| `filename` | string | Original uploaded filename | Required, includes file extension |
| `createdAt` | string | Upload batch creation timestamp | ISO 8601 format |

**Complete UploadBatch Model Structure:**
```json
{
  "id": "integer (primary key, auto-increment)",
  "institutionId": "integer (foreign key to Institution)",
  "filename": "string (original filename)",
  "file_path": "string (server file path, nullable)",
  "status": "enum ('processing', 'completed', 'failed', 'completed_with_errors')",
  "uploaded_by": "integer (user ID who uploaded, nullable)",
  "total_records": "integer (total rows in CSV, default: 0)",
  "processed_records": "integer (successfully processed rows, default: 0)",
  "failed_records": "integer (failed rows, default: 0)",
  "error_details": "text (JSON string of errors, nullable)",
  "name": "string (batch display name)",
  "description": "text (batch description)",
  "createdAt": "datetime (auto-generated)",
  "updatedAt": "datetime (auto-generated)"
}
```

**Upload Batch Status Values:**
- `processing` - Batch is currently being processed
- `completed` - Batch processed successfully
- `failed` - Batch processing failed completely
- `completed_with_errors` - Batch completed with some errors

---

## Business Logic

### Data Flow

1. **Request Processing:**
   - Extract `clientId` from URL parameters
   - Extract optional `uploadBatchId` from query parameters
   - Validate user authentication and role

2. **Institution Access Control:**
   - For institution users: Verify client belongs to their institution
   - Query Client table with `institutionId` filter
   - Return 404 if client not found or access denied

3. **Data Retrieval:**
   - Call `CreditScoringCalculationService.getClientResult()`
   - Service queries ClientResult with includes for Client and UploadBatch
   - Returns most recent result ordered by `createdAt DESC`

4. **Role-based Filtering:**
   - Admin users: Receive complete data including weight calculations
   - Institution users: Weight fields are filtered out using `filterResultFields()`

5. **Response Assembly:**
   - Wrap result in standard API response format
   - Include success status and descriptive message

### Credit Scoring Calculation

The endpoint returns pre-calculated results based on these formulas:

#### Credit Limit Formula
```
credit_limit = min_lendable_amount × sum_normalised_credit_limit_weights × client_income × income_multiple
```

**Constraints:**
- Result is capped at `max_lendable_amount` if it exceeds the limit
- Rounded to 2 decimal places

#### Interest Rate Formula
```
interest_rate = min_interest_rate + ((max_interest_rate - min_interest_rate) × sum_normalised_interest_rate_weights)
```

**Constraints:**
- Result cannot exceed `max_interest_rate`
- Rounded to 4 decimal places

### Role-based Data Access

#### Admin Users
- **Access:** All clients across all institutions
- **Data:** Complete response including sensitive weight calculations
- **Fields:** All ClientResult fields including:
  - `sumNormalisedCreditLimitWeights`
  - `sumNormalisedInterestRateWeights`

#### Institution Users
- **Access:** Only clients from their own institution (`institutionId` filter)
- **Data:** Filtered response with weight calculations removed
- **Fields:** All ClientResult fields except:
  - `sumNormalisedCreditLimitWeights` (filtered out)
  - `sumNormalisedInterestRateWeights` (filtered out)

---

## Database Relationships

### ClientResult Associations
```javascript
ClientResult.belongsTo(Client, {
  foreignKey: 'clientId',
  as: 'client'
});

ClientResult.belongsTo(UploadBatch, {
  foreignKey: 'uploadBatchId',
  as: 'uploadBatch',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
```

### Client Associations
```javascript
Client.belongsTo(Institution, {
  foreignKey: 'institutionId',
  as: 'institution'
});

Client.hasMany(ClientResult, {
  foreignKey: 'clientId',
  as: 'results'
});
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
```

---

## Error Handling

### Common Error Scenarios

1. **Client Not Found (Institution Users):**
   - Occurs when client doesn't belong to the institution
   - Returns 404 with "Client not found or access denied"

2. **No Results Available:**
   - Occurs when no ClientResult exists for the client
   - Returns 404 with "Client result not found"

3. **Authentication Errors:**
   - Missing or invalid JWT token
   - Returns 401 with authentication error

4. **Database Errors:**
   - Connection failures, query errors
   - Returns 500 with generic error message

### Error Response Format
All errors follow the standard API response format:
```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error details (optional)"
}
```

---

## Usage Examples

### cURL Examples

#### Get Latest Result (Admin)
```bash
curl -X GET "http://localhost:3000/api/results/client/123/latest" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Get Latest Result with Batch Filter (Institution)
```bash
curl -X GET "http://localhost:3000/api/results/client/123/latest?uploadBatchId=47" \
  -H "Authorization: Bearer <institution-jwt-token>" \
  -H "Content-Type: application/json"
```

### JavaScript Examples

#### Using Fetch API
```javascript
async function getLatestClientResult(clientId, uploadBatchId = null) {
  const url = new URL(`/api/results/client/${clientId}/latest`, 'http://localhost:3000');
  if (uploadBatchId) {
    url.searchParams.append('uploadBatchId', uploadBatchId);
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

// Usage
try {
  const clientResult = await getLatestClientResult(123, 47);
  console.log(`Credit Limit: ${clientResult.creditLimit}`);
  console.log(`Interest Rate: ${clientResult.interestRate}%`);
} catch (error) {
  console.error('Error:', error.message);
}
```

#### React Component Example
```jsx
import React, { useState, useEffect } from 'react';

const ClientResultDisplay = ({ clientId, uploadBatchId, userRole }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClientResult();
  }, [clientId, uploadBatchId]);

  const fetchClientResult = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/results/client/${clientId}/latest${uploadBatchId ? `?uploadBatchId=${uploadBatchId}` : ''}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch client result');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!result) return <div>No result found</div>;

  return (
    <div className="client-result">
      <h2>Latest Credit Scoring Result</h2>
      
      <div className="client-info">
        <h3>Client Information</h3>
        <p><strong>Name:</strong> {result.client.name}</p>
        <p><strong>Reference:</strong> {result.client.reference_number}</p>
        <p><strong>Email:</strong> {result.client.email}</p>
        <p><strong>Phone:</strong> {result.client.phoneNumber}</p>
      </div>

      <div className="scoring-results">
        <h3>Credit Scoring Results</h3>
        <div className="result-grid">
          <div className="result-item">
            <label>Credit Limit</label>
            <span className="value">
              {result.creditLimit.toLocaleString('en-US', {
                style: 'currency',
                currency: 'XAF',
                minimumFractionDigits: 0
              })}
            </span>
          </div>
          <div className="result-item">
            <label>Interest Rate</label>
            <span className="value">{result.interestRate}%</span>
          </div>
          
          {/* Show weight information only if available (admin users) */}
          {result.sumNormalisedCreditLimitWeights !== undefined && (
            <>
              <div className="result-item">
                <label>Credit Limit Weight</label>
                <span className="value">
                  {(result.sumNormalisedCreditLimitWeights * 100).toFixed(2)}%
                </span>
              </div>
              <div className="result-item">
                <label>Interest Rate Weight</label>
                <span className="value">
                  {(result.sumNormalisedInterestRateWeights * 100).toFixed(2)}%
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {result.uploadBatch && (
        <div className="batch-info">
          <h3>Upload Batch Information</h3>
          <p><strong>Batch Name:</strong> {result.uploadBatch.name}</p>
          <p><strong>Filename:</strong> {result.uploadBatch.filename}</p>
          <p><strong>Created:</strong> {new Date(result.uploadBatch.createdAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default ClientResultDisplay;
```

---

## Performance Considerations

### Database Optimization
- **Indexes:** Ensure proper indexes on `clientId` and `uploadBatchId` in ClientResult table
- **Query Optimization:** Uses `findOne` with `ORDER BY createdAt DESC` for latest result
- **Eager Loading:** Includes Client and UploadBatch data in single query to avoid N+1 problems

### Caching Strategies
- **Result Caching:** Consider caching results for frequently accessed clients
- **TTL:** Set appropriate cache expiration based on data update frequency
- **Cache Keys:** Use pattern like `client_result:${clientId}:${uploadBatchId || 'latest'}`

### Security Considerations
- **Role-based Access:** Strict filtering based on user role and institution
- **Data Sanitization:** Sensitive weight data filtered for institution users
- **Input Validation:** Client ID and upload batch ID validation
- **Authentication:** JWT token validation for all requests

---

## Testing

### Unit Test Examples

```javascript
describe('ResultsController.getLatestClientResult', () => {
  it('should return complete data for admin users', async () => {
    const req = {
      params: { clientId: '123' },
      query: {},
      user: { role: 'admin', id: 1 }
    };
    const res = mockResponse();

    await ResultsController.getLatestClientResult(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Latest client result retrieved successfully',
      data: expect.objectContaining({
        sumNormalisedCreditLimitWeights: expect.any(Number),
        sumNormalisedInterestRateWeights: expect.any(Number)
      })
    });
  });

  it('should filter sensitive data for institution users', async () => {
    const req = {
      params: { clientId: '123' },
      query: {},
      user: { role: 'institution', id: 2 }
    };
    const res = mockResponse();

    await ResultsController.getLatestClientResult(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Latest client result retrieved successfully',
      data: expect.not.objectContaining({
        sumNormalisedCreditLimitWeights: expect.anything(),
        sumNormalisedInterestRateWeights: expect.anything()
      })
    });
  });

  it('should return 404 for non-existent client', async () => {
    const req = {
      params: { clientId: '999' },
      query: {},
      user: { role: 'admin', id: 1 }
    };
    const res = mockResponse();

    await ResultsController.getLatestClientResult(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Client result not found'
    });
  });
});
```

### Integration Test Examples

```javascript
describe('GET /api/results/client/:clientId/latest', () => {
  it('should return latest client result for valid client', async () => {
    const response = await request(app)
      .get('/api/results/client/123/latest')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: 'Latest client result retrieved successfully',
      data: {
        id: expect.any(Number),
        clientId: 123,
        creditLimit: expect.any(Number),
        interestRate: expect.any(Number),
        client: {
          id: expect.any(Number),
          reference_number: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
          phoneNumber: expect.any(String)
        }
      }
    });
  });

  it('should filter results by upload batch', async () => {
    const response = await request(app)
      .get('/api/results/client/123/latest?uploadBatchId=47')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.data.uploadBatchId).toBe(47);
  });
});
```

---

## Changelog

### Version History

- **v1.0.0** - Initial implementation with basic client result retrieval
- **v1.1.0** - Added role-based filtering for admin vs institution users
- **v1.2.0** - Added upload batch filtering support
- **v1.3.0** - Enhanced error handling and validation
- **v1.4.0** - Added comprehensive documentation and examples

### Recent Changes

- **2024-02-15:** Added institution-specific access control
- **2024-02-10:** Implemented weight field filtering for institution users
- **2024-02-05:** Added upload batch filtering capability
- **2024-01-30:** Enhanced error handling and response standardization

---

## Related Documentation

- [CreditScoringCalculationService Documentation](./credit_scoring_calculation_service.md)
- [Client Result History Endpoint](./client-result-history-endpoint.md)
- [Detailed Client Result Endpoint](./detailed-client-result-endpoint.md)
- [API Authentication Guide](./api_authentication.md)
- [Database Schema Documentation](./database_schema.md) 