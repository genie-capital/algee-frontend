# Credit Scoring Calculation Service

## Overview

The Credit Scoring Calculation Service implements the final step in the credit scoring system by applying hardcoded formulas to calculate client credit limits and interest rates. This service integrates with the existing Variable Normalization Service and stores results in the ClientResult table.

## Architecture

### Service Location
- **File**: `backend/src/services/CreditScoringCalculationService.js`
- **Controller Integration**: `backend/src/controllers/variableController.js`
- **Routes**: `backend/src/routes/variableRoutes.js`

### Dependencies
- `VariableNormalizationService`: For calculating weighted scores
- `ClientResult` model: For storing calculation results
- `InstitutionParameter` model: For fetching institution parameters
- `Variable` model: For client income variable lookup
- `ClientVariableValue` model: For client data retrieval

## Hardcoded Formulas

The service implements two specific formulas as per requirements:

### Credit Limit Formula
```
credit_limit = min_lendable_amount(1003) × sum_normalised_credit_limit_weights × client_income(variable_2001) × income_multiple(1001)
```

**Credit Limit Capping:**
If the calculated credit limit exceeds the institution's maximum loan amount (1002), the credit limit is automatically capped at the maximum loan amount.

```
final_credit_limit = min(calculated_credit_limit, max_loan_amount(1002))
```

### Interest Rate Formula
```
interest_rate = min_interest_rate(1005) + ((max_interest_rate(1004) - min_interest_rate(1005)) × sum_normalised_interest_rate_weights)
```

**Where:**
- `min_interest_rate`: Institution parameter (uniqueCode: 1005)
- `max_interest_rate`: Institution parameter (uniqueCode: 1004)
- `sum_normalised_interest_rate_weights`: Calculated by VariableNormalizationService

## Institution Parameters

The service requires these institution parameters with specific unique codes:

| Parameter | Unique Code | Description |
|-----------|-------------|-------------|
| Income Multiple | 1001 | Factor for multiplying client income |
| Maximum Risky Loan Amount | 1002 | Maximum loan amount (not used in current formulas) |
| Minimum Risky Loan Amount | 1003 | Minimum loan amount (used as base in credit limit formula) |
| Maximum Interest Rate | 1004 | Maximum interest rate ceiling |
| Minimum Interest Rate | 1005 | Minimum interest rate floor |

## API Endpoints

### 1. Calculate Single Client Result
```http
POST /api/variables/calculate-client-result/:clientId
```

**Request Body:**
```json
{
  "uploadBatchId": 123,  // Optional
  "institutionId": 1     // Required if not in user context
}
```

**Response:**
```json
{
  "success": true,
  "message": "Credit scoring calculation completed successfully",
  "data": {
    "clientId": 1,
    "creditLimit": 100000000,
    "interestRate": 17,
    "originalCreditLimit": 937500000,
    "creditLimitCapped": true,
    "sumNormalisedCreditLimitWeights": 0.75,
    "sumNormalisedInterestRateWeights": 0.6,
    "clientResultId": 1,
    "calculationDetails": {
      "clientIncome": 50000000,
      "institutionParams": {
        "incomeMultiple": 2.5,
        "minLoanAmount": 10000000,
        "maxLoanAmount": 100000000,
        "maxInterestRate": 25,
        "minInterestRate": 5
      },
      "weightScores": {
        "creditLimitWeight": 0.75,
        "interestRateWeight": 0.6,
        "totalVariablesProcessed": 5
      }
    }
  },
  "status": 200
}
```

### 2. Calculate Batch Results
```http
POST /api/variables/calculate-batch-results
```

**Request Body:**
```json
{
  "clientIds": [1, 2, 3, 4, 5],
  "uploadBatchId": 123,  // Optional
  "institutionId": 1     // Required if not in user context
}
```

**Response:**
```json
{
  "success": true,
  "message": "Batch calculation completed: 4 successful, 1 failed",
  "data": {
    "totalClients": 5,
    "successfulCalculations": 4,
    "failedCalculations": 1,
    "results": [
      {
        "clientId": 1,
        "success": true,
        "data": { /* calculation results */ }
      }
    ],
    "errors": [
      {
        "clientId": 5,
        "success": false,
        "error": "Missing client income data"
      }
    ]
  },
  "status": 200
}
```

### 3. Get Client Result
```http
GET /api/variables/client-result/:clientId?uploadBatchId=123
```

**Response:**
```json
{
  "success": true,
  "message": "Client result retrieved successfully",
  "data": {
    "id": 1,
    "clientId": 1,
    "creditLimit": 100000000,
    "interestRate": 17,
    "originalCreditLimit": 937500000,
    "creditLimitCapped": true,
    "sumNormalisedCreditLimitWeights": 0.75,
    "sumNormalisedInterestRateWeights": 0.6,
    "uploadBatchId": 123,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "client": {
      "id": 1,
      "reference_number": "CLIENT001",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+237677777777"
    },
    "uploadBatch": {
      "id": 123,
      "name": "January 2024 Upload",
      "filename": "clients_jan_2024.csv",
      "createdAt": "2024-01-15T09:00:00Z"
    }
  },
  "status": 200
}
```

## Automatic Integration

### CSV Upload Integration

The service automatically triggers during CSV uploads after normalization:

1. **CSV Processing**: Client data is uploaded and validated
2. **Variable Normalization**: Values are normalized and weights calculated
3. **Credit Scoring**: Automatically calculates credit limits and interest rates
4. **Result Storage**: Results stored in `ClientResult` table

**CSV Upload Response includes:**
```json
{
  "success": true,
  "message": "CSV processed successfully",
  "data": {
    "uploadBatchId": 123,
    "processing": { /* processing stats */ },
    "normalization": {
      "success": true,
      "totalVariablesNormalized": 25,
      "clientsProcessed": 5
    },
    "creditScoring": {
      "success": true,
      "totalClientsProcessed": 5,
      "successfulCalculations": 4,
      "failedCalculations": 1,
      "errors": [
        {
          "clientId": 5,
          "error": "Missing client income data"
        }
      ]
    }
  }
}
```

## Service Methods

### Core Methods

#### `calculateClientResult(clientId, institutionId, uploadBatchId?, transaction?)`
Calculates credit scoring results for a single client.

#### `calculateBatchResults(clientIds, institutionId, uploadBatchId?, transaction?)`
Calculates credit scoring results for multiple clients in batch.

#### `getClientResult(clientId, uploadBatchId?, transaction?)`
Retrieves stored client result from database.

### Helper Methods

#### `getInstitutionParameters(institutionId, transaction)`
Fetches and validates required institution parameters.

#### `getClientIncome(clientId, transaction)`
Retrieves client income from Variable with uniqueCode: 2001.

#### `applyCalculationFormulas(institutionParams, clientIncome, weightScores)`
Applies the hardcoded calculation formulas.

#### `storeClientResult(clientId, calculations, weightScores, uploadBatchId, transaction)`
Stores or updates client result in database.

## Error Handling

### Common Error Scenarios

1. **Missing Institution Parameters**
   ```json
   {
     "success": false,
     "message": "Failed to fetch institution parameters",
     "data": { "error": "Missing required institution parameters: 1001, 1003" }
   }
   ```

2. **Missing Client Income**
   ```json
   {
     "success": false,
     "message": "Failed to fetch client income data",
     "data": { "error": "Client income data not found for client 789" }
   }
   ```

3. **Invalid Calculation Results**
   ```json
   {
     "success": false,
     "message": "Failed to apply calculation formulas",
     "data": { "error": "Calculated interest rate exceeds maximum allowed rate" }
   }
   ```

### Validation Rules

- All institution parameters must exist and be numeric
- Client income must exist and be positive
- Calculated interest rate cannot exceed maximum rate
- Calculated values cannot be negative
- Weight scores must be valid numbers between 0 and 1

## Database Schema

### ClientResult Table
```sql
CREATE TABLE ClientResult (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clientId INTEGER NOT NULL,
  credit_limit FLOAT NOT NULL,
  interest_rate FLOAT NOT NULL,
  sum_normalised_credit_limit_weights FLOAT DEFAULT 0,
  sum_normalised_interest_rate_weights FLOAT DEFAULT 0,
  uploadBatchId INTEGER,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (clientId) REFERENCES Client(id),
  FOREIGN KEY (uploadBatchId) REFERENCES UploadBatch(id)
);
```

## Usage Examples

### Manual Calculation
```javascript
const CreditScoringCalculationService = require('./services/CreditScoringCalculationService');
const creditScoringService = new CreditScoringCalculationService();

// Calculate for single client
const result = await creditScoringService.calculateClientResult(
  clientId: 789,
  institutionId: 456,
  uploadBatchId: 123,
  transaction
);

if (result.success) {
  console.log(`Credit Limit: ${result.data.creditLimit}`);
  console.log(`Interest Rate: ${result.data.interestRate}%`);
}
```

### Batch Calculation
```javascript
// Calculate for multiple clients
const batchResult = await creditScoringService.calculateBatchResults(
  [789, 790, 791],
  institutionId: 456,
  uploadBatchId: 123,
  transaction
);

console.log(`Processed: ${batchResult.data.successfulCalculations} clients`);
```

## Performance Considerations

- **Batch Processing**: Use batch methods for multiple clients to optimize database transactions
- **Transaction Management**: All operations use database transactions for consistency
- **Error Isolation**: Individual client failures don't affect batch processing
- **Logging**: Comprehensive logging for debugging and monitoring

## Security & Access Control

- **Authentication Required**: All endpoints require valid authentication
- **Institution Isolation**: Clients can only access their own institution's data
- **Parameter Validation**: All inputs are validated before processing
- **Transaction Safety**: Database transactions ensure data consistency

## Monitoring & Logging

The service provides detailed logging for:
- Calculation start/completion
- Formula inputs and outputs
- Error conditions and failures
- Performance metrics
- Database operations

Log levels include calculation details, warnings for edge cases, and errors for failures.

## Future Enhancements

Potential improvements for the service:
- Configurable formula parameters
- Historical result tracking
- Bulk export capabilities
- Advanced validation rules
- Performance optimization for large batches
- Real-time calculation updates 