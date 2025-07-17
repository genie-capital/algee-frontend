# Variable Management API Documentation

## Overview
The Variable Management API provides comprehensive endpoints for managing variables used in credit scoring calculations. This API supports variable creation, updates, normalization, and credit scoring operations.

## Base URL
```
http://localhost:3000/api/variable
```

## Authentication
All endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

### User Roles
- **Admin**: Full access to all endpoints including system configuration
- **Institution**: Limited access to read operations and client-specific calculations

---

## Data Structures Reference

### Variable Object Structure
```json
{
  "id": "integer (auto-generated)",
  "name": "string (1-255 characters)",
  "description": "text (detailed description)",
  "uniqueCode": "integer (unique identifier)",
  "is_required": "boolean (default: true)",
  "mask": "boolean (default: false) - Admin only field",
  "isUsedInFormula": "boolean (default: false) - Admin only field", 
  "min_value": "float (minimum allowed value)",
  "max_value": "float (maximum allowed value)",
  "responseType": "enum ['int_float', 'boolean', 'categorical']",
  "normalisationFormula": "text (required for int_float, null for others)",
  "variableCategoryId": "integer (foreign key)",
  "variableProportion": "float (0-100, percentage within category)",
  "createdAt": "ISO 8601 datetime string",
  "updatedAt": "ISO 8601 datetime string",
  "variableCategory": "VariableCategory object (when included)",
  "categoryMappings": "array of CategoryMapping objects (for categorical type)"
}
```

### Category Mappings Structure (for categorical variables)
```json
{
  "categoryMappings": [
    {
      "id": "integer (auto-generated, present in responses)",
      "variableId": "integer (auto-assigned, present in responses)",
      "categoryName": "string (required, 1-100 characters)",
      "numericValue": "float (required, 0.0-1.0 inclusive)",
      "createdAt": "ISO 8601 datetime (present in responses)",
      "updatedAt": "ISO 8601 datetime (present in responses)"
    }
  ]
}
```

**Category Mappings Examples:**
```json
// Example 1: Education Level
"categoryMappings": [
  {
    "categoryName": "No Education",
    "numericValue": 0.1
  },
  {
    "categoryName": "Primary Education",
    "numericValue": 0.3
  },
  {
    "categoryName": "Secondary Education", 
    "numericValue": 0.6
  },
  {
    "categoryName": "University Education",
    "numericValue": 1.0
  }
]

// Example 2: Employment Status
"categoryMappings": [
  {
    "categoryName": "Unemployed",
    "numericValue": 0.0
  },
  {
    "categoryName": "Part-time",
    "numericValue": 0.4
  },
  {
    "categoryName": "Full-time",
    "numericValue": 0.8
  },
  {
    "categoryName": "Self-employed",
    "numericValue": 1.0
  }
]
```

**Category Mappings Validation Rules:**
- Each `categoryName` must be unique within the variable
- Each `numericValue` must be unique within the variable
- `numericValue` must be between 0.0 and 1.0 (inclusive)
- At least 2 category mappings required for categorical variables
- Maximum 20 category mappings per variable

### Redistribute Proportions Structure
```json
{
  "redistributeProportions": [
    {
      "variableId": "integer (required, must exist in same category)",
      "proportion": "float (required, 0.0-100.0)"
    }
  ]
}
```

**Redistribute Proportions Examples:**
```json
// Example: Redistributing 4 variables in Financial Category
// Total must equal 100 - new variable proportion
"redistributeProportions": [
  {
    "variableId": 1,
    "proportion": 20.0
  },
  {
    "variableId": 2, 
    "proportion": 25.0
  },
  {
    "variableId": 3,
    "proportion": 30.0
  },
  {
    "variableId": 4,
    "proportion": 15.0
  }
]
// If new variable has 10% proportion, total = 90% + 10% = 100%
```

**Redistribute Proportions Validation Rules:**
- Must include ALL existing variables in the target category
- Sum of all proportions + new variable proportion must equal 100%
- Each proportion must be greater than 0
- Variable IDs must exist and belong to the same category

### Variable Category Object Structure
```json
{
  "id": "integer (auto-generated)",
  "name": "string (category name)",
  "description": "text (category description)",
  "creditLimitWeight": "float (0.0-1.0, weight for credit limit calculation)",
  "interestRateWeight": "float (0.0-1.0, weight for interest rate calculation)",
  "createdAt": "ISO 8601 datetime string",
  "updatedAt": "ISO 8601 datetime string"
}
```

### Client Variable Value Structure
```json
{
  "variableId": "integer (required)",
  "value": "mixed type based on variable responseType",
  "clientId": "integer (optional in some contexts)",
  "uploadBatchId": "integer (optional)"
}
```

**Client Variable Value Examples by Response Type:**
```json
// int_float type
{
  "variableId": 1,
  "value": 50000.50
}

// boolean type  
{
  "variableId": 2,
  "value": true
}

// categorical type (use categoryName, not numericValue)
{
  "variableId": 3,
  "value": "University Education"
}
```

### Pagination Structure
```json
{
  "pagination": {
    "currentPage": "integer (1-based page number)",
    "totalPages": "integer (total number of pages)",
    "totalRecords": "integer (total number of records)",
    "recordsPerPage": "integer (records per page limit)"
  }
}
```

### Credit Scoring Result Structure
```json
{
  "clientId": "integer",
  "creditLimit": "float (calculated credit limit amount)",
  "interestRate": "float (calculated interest rate percentage)",
  "riskScore": "float (0.0-1.0, lower is better)",
  "categoryScores": [
    {
      "categoryId": "integer",
      "categoryName": "string",
      "weightedScore": "float (0.0-1.0)",
      "creditContribution": "float (contribution to credit limit)",
      "interestContribution": "float (contribution to interest rate)"
    }
  ],
  "variableScores": [
    {
      "variableId": "integer",
      "variableName": "string", 
      "normalizedValue": "float (0.0-1.0)",
      "weightedScore": "float (normalized * proportion)",
      "proportion": "float (variable proportion within category)"
    }
  ],
  "calculationMetadata": {
    "calculatedAt": "ISO 8601 datetime",
    "uploadBatchId": "integer (optional)",
    "institutionId": "integer"
  }
}
```

### Proportion Change History Structure
```json
{
  "id": "integer (auto-generated)",
  "variableId": "integer",
  "oldProportion": "float (previous proportion value)",
  "newProportion": "float (new proportion value)", 
  "proportionChange": "float (difference: new - old)",
  "changedAt": "ISO 8601 datetime",
  "changedBy": "string (user ID who made the change)",
  "reason": "string (reason for the change)",
  "batchId": "string (UUID for grouping related changes)"
}
```

### Standard API Response Structure
```json
{
  "success": "boolean (true for success, false for error)",
  "message": "string (human-readable message)",
  "data": "object|array (response payload, null on error)",
  "status": "integer (HTTP status code)",
  "error": "string (error details, only present on errors)"
}
```

---

## Endpoints

### 1. Create Variable
Creates a new variable in the system.

**Endpoint:** `POST /create`  
**Access:** Admin only  
**Authentication:** Required

#### Complete Request Body Structure
```json
{
  "name": "string (required, 1-255 chars)",
  "description": "string (required, 1-1000 chars)",
  "uniqueCode": "integer (required, must be unique)",
  "is_required": "boolean (optional, default: true)",
  "mask": "boolean (optional, default: false)",
  "isUsedInFormula": "boolean (optional, default: false)",
  "min_value": "number (required)",
  "max_value": "number (required, must be > min_value)",
  "responseType": "string (required: 'int_float'|'boolean'|'categorical')",
  "normalisationFormula": "string (required for int_float, null for others)",
  "variableCategoryId": "integer (required, must exist)",
  "variableProportion": "number (required, 0.1-100.0)",
  "categoryMappings": "array (required for categorical, empty for others)",
  "redistributeProportions": "array (required when adding to existing category)"
}
```

#### Complete Request Examples

**Example 1: Creating an int_float variable (first in category)**
```json
{
  "name": "Monthly Income",
  "description": "Client's gross monthly income in local currency",
  "uniqueCode": 1001,
  "is_required": true,
  "mask": false,
  "isUsedInFormula": true,
  "min_value": 0,
  "max_value": 1000000,
  "responseType": "int_float",
  "normalisationFormula": "(value - min_value) / (max_value - min_value)",
  "variableCategoryId": 1,
  "variableProportion": 100.0,
  "categoryMappings": []
}
```

**Example 2: Creating a categorical variable (adding to existing category)**
```json
{
  "name": "Education Level",
  "description": "Highest level of education completed by the client",
  "uniqueCode": 1002,
  "is_required": true,
  "mask": false,
  "isUsedInFormula": false,
  "min_value": 0,
  "max_value": 1,
  "responseType": "categorical",
  "normalisationFormula": null,
  "variableCategoryId": 1,
  "variableProportion": 25.0,
  "categoryMappings": [
    {
      "categoryName": "No Education",
      "numericValue": 0.1
    },
    {
      "categoryName": "Primary Education", 
      "numericValue": 0.3
    },
    {
      "categoryName": "Secondary Education",
      "numericValue": 0.6
    },
    {
      "categoryName": "University Education",
      "numericValue": 1.0
    }
  ],
  "redistributeProportions": [
    {
      "variableId": 1,
      "proportion": 75.0
    }
  ]
}
```

**Example 3: Creating a boolean variable**
```json
{
  "name": "Has Bank Account",
  "description": "Whether the client has an active bank account",
  "uniqueCode": 1003,
  "is_required": true,
  "mask": false,
  "isUsedInFormula": false,
  "min_value": 0,
  "max_value": 1,
  "responseType": "boolean",
  "normalisationFormula": null,
  "variableCategoryId": 2,
  "variableProportion": 100.0,
  "categoryMappings": []
}
```

#### Complete Success Response Structure
```json
{
  "success": true,
  "message": "Variable created successfully",
  "data": {
    "variable": {
      "id": 1,
      "name": "Monthly Income",
      "description": "Client's gross monthly income in local currency",
      "uniqueCode": 1001,
      "is_required": true,
      "mask": false,
      "isUsedInFormula": true,
      "min_value": 0,
      "max_value": 1000000,
      "responseType": "int_float",
      "normalisationFormula": "(value - min_value) / (max_value - min_value)",
      "variableCategoryId": 1,
      "variableProportion": 100.0,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "categoryMappings": [],
    "redistributionResult": null,
    "proportionHistory": {
      "id": 1,
      "variableId": 1,
      "oldProportion": 0,
      "newProportion": 100.0,
      "proportionChange": 100.0,
      "changedAt": "2024-01-15T10:30:00.000Z",
      "changedBy": "admin-123",
      "reason": "Variable creation",
      "batchId": "550e8400-e29b-41d4-a716-446655440000"
    }
  },
  "status": 201
}
```

#### Detailed Error Responses
```json
// 400 - Missing Required Fields
{
  "success": false,
  "message": "Required fields: name, description, uniqueCode, min_value, max_value, responseType, variableCategoryId, variableProportion",
  "status": 400
}

// 400 - Invalid Category Mappings
{
  "success": false,
  "message": "Invalid numeric value 1.5 for category \"High Risk\". Numeric values must be between 0 and 1 (inclusive).",
  "status": 400
}

// 400 - Duplicate Unique Code
{
  "success": false,
  "message": "Variable with this uniqueCode already exists",
  "status": 400
}

// 400 - Invalid Proportion Redistribution
{
  "success": false,
  "message": "Total proportions must equal 100%. Redistributed variables: 60%, new variable: 25%, total: 85%",
  "status": 400
}

// 400 - Invalid Normalization Formula
{
  "success": false,
  "message": "Invalid formula: Undefined variable 'invalid_var' in formula",
  "status": 400
}
```

---

### 2. Update Variable
Updates an existing variable.

**Endpoint:** `PUT /update/{id}`  
**Access:** Admin only  
**Authentication:** Required

#### Path Parameters
- `id` (integer, required): Variable ID

#### Request Body
Same structure as create variable, all fields optional except those being updated.

#### Success Response (200)
```json
{
  "success": true,
  "message": "Variable updated successfully",
  "data": {
    "variable": {
      "id": 1,
      "name": "Updated Monthly Income",
      "description": "Updated description",
      // ... other fields
    },
    "changes": {
      "proportionRedistribution": {
        "applied": true,
        "affectedVariables": 3,
        "batchId": "uuid-string"
      }
    }
  },
  "status": 200
}
```

#### Error Responses
```json
// 404 - Variable Not Found
{
  "success": false,
  "message": "Variable not found",
  "status": 404
}
```

---

### 3. Delete Variable
Deletes a variable from the system.

**Endpoint:** `DELETE /delete/{id}`  
**Access:** Admin only  
**Authentication:** Required

#### Path Parameters
- `id` (integer, required): Variable ID

#### Success Response (200)
```json
{
  "success": true,
  "message": "Variable deleted successfully",
  "data": {
    "deletedVariable": {
      "id": 1,
      "name": "Monthly Income"
    },
    "redistributionResult": {
      "affectedVariables": 2,
      "batchId": "uuid-string"
    }
  },
  "status": 200
}
```

---

### 4. Get All Variables
Retrieves all variables with pagination and filtering.

**Endpoint:** `GET /all`  
**Access:** Admin and Institution  
**Authentication:** Required

#### Query Parameters
- `page` (integer, optional, default: 1): Page number (only used when paginate=true)
- `limit` (integer, optional, default: 10): Records per page (only used when paginate=true)
- `includeAssociations` (boolean, optional, default: true): Whether to include variable category and category mappings
- `paginate` (boolean, optional, default: false): Whether to paginate results

#### Success Response (200)

**With pagination (paginate=true):**
```json
{
  "success": true,
  "message": "Variables retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Monthly Income",
      "description": "Client's monthly income",
      "uniqueCode": 1001,
      "is_required": true,
      "min_value": 0,
      "max_value": 1000000,
      "responseType": "int_float",
      "variableCategoryId": 1,
      "variableProportion": 25.5,
      "variableCategory": {
        "id": 1,
        "name": "Financial Information",
        "creditLimitWeight": 0.4,
        "interestRateWeight": 0.6
      },
      "categoryMappings": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  },
  "status": 200
}
```

**Without pagination (paginate=false, default):**
```json
{
  "success": true,
  "message": "Variables retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Monthly Income",
      "description": "Client's monthly income",
      "uniqueCode": 1001,
      "is_required": true,
      "min_value": 0,
      "max_value": 1000000,
      "responseType": "int_float",
      "variableCategoryId": 1,
      "variableProportion": 25.5,
      "variableCategory": {
        "id": 1,
        "name": "Financial Information",
        "creditLimitWeight": 0.4,
        "interestRateWeight": 0.6
      },
      "categoryMappings": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "status": 200
}
```

**With includeAssociations=false:**
```json
{
  "success": true,
  "message": "Variables retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Monthly Income",
      "description": "Client's monthly income",
      "uniqueCode": 1001,
      "is_required": true,
      "min_value": 0,
      "max_value": 1000000,
      "responseType": "int_float",
      "variableCategoryId": 1,
      "variableProportion": 25.5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "status": 200
}
```

**Note:** Institution users will not see sensitive fields like `mask` and `isUsedInFormula`.

---

### 5. Get Variable by ID
Retrieves a specific variable by its ID.

**Endpoint:** `GET /{id}`  
**Access:** Admin and Institution  
**Authentication:** Required

#### Path Parameters
- `id` (integer, required): Variable ID

#### Query Parameters
- `includeAssociations` (boolean, optional, default: true): Whether to include variable category and category mappings

#### Success Response (200)

**With includeAssociations=true (default):**
```json
{
  "success": true,
  "message": "Variable retrieved successfully",
  "data": {
    "id": 1,
    "name": "Monthly Income",
    "description": "Client's monthly income",
    "uniqueCode": 1001,
    "is_required": true,
    "min_value": 0,
    "max_value": 1000000,
    "responseType": "int_float",
    "normalisationFormula": "value / max_value",
    "variableCategoryId": 1,
    "variableProportion": 25.5,
    "variableCategory": {
      "id": 1,
      "name": "Financial Information",
      "description": "Category for financial data",
      "creditLimitWeight": 0.4,
      "interestRateWeight": 0.6,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "categoryMappings": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "status": 200
}
```

**With includeAssociations=false:**
```json
{
  "success": true,
  "message": "Variable retrieved successfully",
  "data": {
    "id": 1,
    "name": "Monthly Income",
    "description": "Client's monthly income",
    "uniqueCode": 1001,
    "is_required": true,
    "min_value": 0,
    "max_value": 1000000,
    "responseType": "int_float",
    "normalisationFormula": "value / max_value",
    "variableCategoryId": 1,
    "variableProportion": 25.5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "status": 200
}
```

#### Error Response (404)
```json
{
  "success": false,
  "message": "Variable not found",
  "status": 404
}
```

**Note:** Institution users will not see sensitive fields like `mask` and `isUsedInFormula`.

---

### 6. Get Variables by Category
Retrieves all variables in a specific category.

**Endpoint:** `GET /category/{categoryId}`  
**Access:** Admin and Institution  
**Authentication:** Required

#### Path Parameters
- `categoryId` (integer, required): Variable Category ID

#### Query Parameters
- `page` (integer, optional, default: 1): Page number
- `limit` (integer, optional, default: 10): Records per page

#### Success Response (200)
Same structure as "Get All Variables" but filtered by category.

---

### 7. Get Variables by Response Type
Retrieves variables filtered by response type.

**Endpoint:** `GET /response-type/{responseType}`  
**Access:** Admin and Institution  
**Authentication:** Required

#### Path Parameters
- `responseType` (string, required): One of 'int_float', 'boolean', 'categorical'

#### Success Response (200)
Same structure as "Get All Variables" but filtered by response type.

---

### 8. Get Non-Masked Variables
Retrieves all variables that are not masked.

**Endpoint:** `GET /non-masked`  
**Access:** Admin and Institution  
**Authentication:** Required

#### Success Response (200)
Same structure as "Get All Variables" but only non-masked variables.

---

### 9. Get Masked Variables
Retrieves all variables that are masked.

**Endpoint:** `GET /masked`  
**Access:** Admin and Institution  
**Authentication:** Required

#### Success Response (200)
Same structure as "Get All Variables" but only masked variables.

---

### 10. Search Variables
Searches variables by name or description.

**Endpoint:** `GET /search`  
**Access:** Admin and Institution  
**Authentication:** Required

#### Query Parameters
- `q` (string, required): Search query
- `page` (integer, optional, default: 1): Page number
- `limit` (integer, optional, default: 10): Records per page

#### Success Response (200)
Same structure as "Get All Variables" with search results.

---

### 11. Normalize Client Variables
Normalizes variable values for a client using the defined formulas.

**Endpoint:** `POST /normalize`  
**Access:** Admin and Institution  
**Authentication:** Required

#### Complete Request Body Structure
```json
{
  "clientId": "integer (required)",
  "variableValues": [
    {
      "variableId": "integer (required)",
      "value": "mixed (number|string|boolean based on responseType)"
    }
  ],
  "uploadBatchId": "integer (optional)"
}
```

#### Complete Request Examples
```json
{
  "clientId": 123,
  "uploadBatchId": 456,
  "variableValues": [
    {
      "variableId": 1,
      "value": 50000
    },
    {
      "variableId": 2,
      "value": true
    },
    {
      "variableId": 3,
      "value": "University Education"
    },
    {
      "variableId": 4,
      "value": 2.5
    }
  ]
}
```

#### Complete Success Response Structure
```json
{
  "success": true,
  "message": "Variables normalized successfully",
  "data": {
    "clientId": 123,
    "uploadBatchId": 456,
    "normalizedValues": [
      {
        "variableId": 1,
        "originalValue": 50000,
        "normalizedValue": 0.75,
        "variable": {
          "id": 1,
          "name": "Monthly Income",
          "responseType": "int_float",
          "min_value": 0,
          "max_value": 100000,
          "normalisationFormula": "(value - min_value) / (max_value - min_value)"
        }
      },
      {
        "variableId": 2,
        "originalValue": true,
        "normalizedValue": 1.0,
        "variable": {
          "id": 2,
          "name": "Has Bank Account",
          "responseType": "boolean"
        }
      },
      {
        "variableId": 3,
        "originalValue": "University Education",
        "normalizedValue": 1.0,
        "variable": {
          "id": 3,
          "name": "Education Level",
          "responseType": "categorical"
        },
        "categoryMapping": {
          "categoryName": "University Education",
          "numericValue": 1.0
        }
      }
    ],
    "summary": {
      "totalVariables": 3,
      "successfulNormalizations": 3,
      "failedNormalizations": 0,
      "errors": []
    },
    "processingTime": "45ms"
  },
  "status": 200
}
```

---

### 12. Calculate Client Credit Score
Calculates credit scoring result for a single client.

**Endpoint:** `POST /calculate/{clientId}`  
**Access:** Admin and Institution  
**Authentication:** Required

#### Path Parameters
- `clientId` (integer, required): Client ID

#### Request Body
```json
{
  "uploadBatchId": "integer (optional)",
  "institutionId": "integer (optional, auto-detected from auth)"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Credit scoring calculation completed successfully",
  "data": {
    "clientId": 123,
    "creditLimit": 75000,
    "interestRate": 12.5,
    "riskScore": 0.25,
    "categoryScores": [
      {
        "categoryId": 1,
        "categoryName": "Financial Information",
        "weightedScore": 0.8,
        "creditContribution": 0.32,
        "interestContribution": 0.48
      }
    ],
    "variableScores": [
      {
        "variableId": 1,
        "variableName": "Monthly Income",
        "normalizedValue": 0.75,
        "weightedScore": 0.1875,
        "proportion": 25.0
      }
    ],
    "calculationMetadata": {
      "calculatedAt": "2024-01-01T00:00:00.000Z",
      "uploadBatchId": 456,
      "institutionId": 1
    }
  },
  "status": 200
}
```

---

### 13. Calculate Batch Credit Scores
Calculates credit scoring results for multiple clients.

**Endpoint:** `POST /calculate-batch`  
**Access:** Admin and Institution  
**Authentication:** Required

#### Complete Request Body Structure
```json
{
  "clientIds": ["integer (required, array of client IDs)"],
  "uploadBatchId": "integer (optional)",
  "institutionId": "integer (optional, auto-detected from auth)"
}
```

#### Complete Request Example
```json
{
  "clientIds": [123, 124, 125, 126],
  "uploadBatchId": 456,
  "institutionId": 1
}
```

#### Complete Success Response Structure
```json
{
  "success": true,
  "message": "Batch credit scoring calculation completed",
  "data": {
    "results": [
      {
        "clientId": 123,
        "success": true,
        "creditLimit": 75000,
        "interestRate": 12.5,
        "riskScore": 0.25,
        "categoryScores": [
          {
            "categoryId": 1,
            "categoryName": "Financial Information", 
            "weightedScore": 0.8,
            "creditContribution": 0.32,
            "interestContribution": 0.48
          }
        ],
        "calculationTime": "23ms"
      },
      {
        "clientId": 124,
        "success": false,
        "error": "Insufficient variable data: Missing required variables [1, 3]",
        "missingVariables": [
          {
            "variableId": 1,
            "variableName": "Monthly Income"
          },
          {
            "variableId": 3,
            "variableName": "Education Level"
          }
        ]
      },
      {
        "clientId": 125,
        "success": true,
        "creditLimit": 45000,
        "interestRate": 18.2,
        "riskScore": 0.65,
        "categoryScores": [
          {
            "categoryId": 1,
            "categoryName": "Financial Information", 
            "weightedScore": 0.4,
            "creditContribution": 0.16,
            "interestContribution": 0.24
          }
        ],
        "calculationTime": "19ms"
      }
    ],
    "summary": {
      "totalClients": 3,
      "successfulCalculations": 2,
      "failedCalculations": 1,
      "averageCalculationTime": "21ms",
      "totalProcessingTime": "156ms"
    },
    "batchMetadata": {
      "calculatedAt": "2024-01-15T14:30:00.000Z",
      "uploadBatchId": 456,
      "institutionId": 1,
      "batchId": "batch-550e8400-e29b-41d4-a716-446655440000"
    }
  },
  "status": 200
}
```

---

### 14. Get Client Credit Score Result
Retrieves previously calculated credit scoring result for a client.

**Endpoint:** `GET /client-result/{clientId}`  
**Access:** Admin and Institution  
**Authentication:** Required

#### Path Parameters
- `clientId` (integer, required): Client ID

#### Query Parameters
- `uploadBatchId` (integer, optional): Specific batch ID to retrieve

#### Success Response (200)
Same structure as "Calculate Client Credit Score" response.

#### Error Response (404)
```json
{
  "success": false,
  "message": "No credit scoring result found for this client",
  "status": 404
}
```

---

### 15. Get Client Weighted Scores
Retrieves detailed weighted scores for a client.

**Endpoint:** `GET /client-weighted-scores/{clientId}`  
**Access:** Admin and Institution  
**Authentication:** Required

#### Path Parameters
- `clientId` (integer, required): Client ID

#### Success Response (200)
```json
{
  "success": true,
  "message": "Client weighted scores retrieved successfully",
  "data": {
    "clientId": 123,
    "categoryScores": [
      {
        "categoryId": 1,
        "categoryName": "Financial Information",
        "totalWeightedScore": 0.8,
        "creditWeight": 0.4,
        "interestWeight": 0.6,
        "variableScores": [
          {
            "variableId": 1,
            "variableName": "Monthly Income",
            "normalizedValue": 0.75,
            "proportion": 25.0,
            "weightedScore": 0.1875
          }
        ]
      }
    ],
    "overallScores": {
      "totalCreditScore": 0.75,
      "totalInterestScore": 0.65,
      "riskScore": 0.25
    }
  },
  "status": 200
}
```

---

## Admin-Only Endpoints

### 16. Get Category Proportion Summary
Retrieves proportion distribution summary for a category.

**Endpoint:** `GET /category-proportion-summary/{categoryId}`  
**Access:** Admin and Institution  
**Authentication:** Required

#### Success Response (200)
```json
{
  "success": true,
  "message": "Category proportion summary retrieved successfully",
  "data": {
    "categoryId": 1,
    "categoryName": "Financial Information",
    "totalProportion": 100,
    "variableCount": 4,
    "variables": [
      {
        "id": 1,
        "name": "Monthly Income",
        "proportion": 25.0
      }
    ],
    "proportionStatus": "complete"
  },
  "status": 200
}
```

---

### 17. Validate Normalization Formula
Validates a normalization formula before saving.

**Endpoint:** `POST /validate-normalization-formula`  
**Access:** Admin only  
**Authentication:** Required

#### Request Body
```json
{
  "formula": "string (required)",
  "responseType": "string (required)",
  "variableId": "integer (optional, for existing variables)",
  "institutionId": "integer (optional)"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Formula validation successful",
  "data": {
    "isValid": true,
    "extractedVariables": ["value", "max_value", "min_value"],
    "testResult": 0.75,
    "warnings": []
  },
  "status": 200
}
```

---

### 18. Test Variable Normalization
Tests normalization for a specific variable with sample data.

**Endpoint:** `POST /test-variable-normalization`  
**Access:** Admin only  
**Authentication:** Required

#### Request Body
```json
{
  "variableId": "integer (required)",
  "testValue": "number|string|boolean (required)",
  "institutionId": "integer (optional)"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Variable normalization test completed",
  "data": {
    "variableId": 1,
    "testValue": 50000,
    "normalizedValue": 0.75,
    "formula": "value / max_value",
    "executionTime": "2ms"
  },
  "status": 200
}
```

---

### 19. Trigger Variable Re-normalization
Triggers re-normalization of all client data for a specific variable.

**Endpoint:** `POST /trigger-re-normalization/{variableId}`  
**Access:** Admin only  
**Authentication:** Required

#### Path Parameters
- `variableId` (integer, required): Variable ID

#### Success Response (200)
```json
{
  "success": true,
  "message": "Variable re-normalization triggered successfully",
  "data": {
    "variableId": 1,
    "affectedClients": 150,
    "reNormalizationBatchId": "uuid-string",
    "status": "completed"
  },
  "status": 200
}
```

---

### 20. Redistribute Category Proportions
Redistributes proportions among variables in a category.

**Endpoint:** `PUT /category/{categoryId}/redistribute-proportions`  
**Access:** Admin only  
**Authentication:** Required

#### Path Parameters
- `categoryId` (integer, required): Category ID

#### Request Body
```json
{
  "variableProportions": [
    {
      "variableId": "integer (required)",
      "proportion": "number (required, 0-100)"
    }
  ],
  "reason": "string (optional)"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Category proportions redistributed successfully",
  "data": {
    "categoryId": 1,
    "changes": [
      {
        "variableId": 1,
        "oldProportion": 25.0,
        "newProportion": 30.0,
        "change": 5.0
      }
    ],
    "batchId": "uuid-string",
    "totalAffectedVariables": 4
  },
  "status": 200
}
```

---

### 21. Get Variable Proportion History
Retrieves proportion change history for a specific variable.

**Endpoint:** `GET /proportion-history/variable/{variableId}`  
**Access:** Admin only  
**Authentication:** Required

#### Query Parameters
- `page` (integer, optional, default: 1): Page number
- `limit` (integer, optional, default: 10): Records per page

#### Success Response (200)
```json
{
  "success": true,
  "message": "Variable proportion history retrieved successfully",
  "data": {
    "variableId": 1,
    "history": [
      {
        "id": 1,
        "oldProportion": 25.0,
        "newProportion": 30.0,
        "proportionChange": 5.0,
        "changedAt": "2024-01-01T00:00:00.000Z",
        "changedBy": "admin-user-id",
        "reason": "Manual adjustment",
        "batchId": "uuid-string"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalRecords": 25,
      "recordsPerPage": 10
    }
  },
  "status": 200
}
```

---

### 22. Get Category Proportion History
Retrieves proportion change history for all variables in a category.

**Endpoint:** `GET /proportion-history/category/{categoryId}`  
**Access:** Admin only  
**Authentication:** Required

#### Success Response (200)
Similar structure to variable proportion history but includes all variables in the category.

---

### 23. Get Proportion Change Batches
Retrieves batches of proportion changes.

**Endpoint:** `GET /proportion-history/batches`  
**Access:** Admin only  
**Authentication:** Required

#### Query Parameters
- `page` (integer, optional, default: 1): Page number
- `limit` (integer, optional, default: 10): Records per page

#### Success Response (200)
```json
{
  "success": true,
  "message": "Proportion change batches retrieved successfully",
  "data": {
    "batches": [
      {
        "batchId": "uuid-string",
        "changedAt": "2024-01-01T00:00:00.000Z",
        "changedBy": "admin-user-id",
        "reason": "Category redistribution",
        "affectedVariables": 4,
        "changes": [
          {
            "variableId": 1,
            "variableName": "Monthly Income",
            "oldProportion": 25.0,
            "newProportion": 30.0
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 50,
      "recordsPerPage": 10
    }
  },
  "status": 200
}
```

---

## Frontend Integration Examples

### JavaScript/TypeScript Interfaces

```typescript
// TypeScript interfaces for frontend integration
interface Variable {
  id: number;
  name: string;
  description: string;
  uniqueCode: number;
  is_required: boolean;
  mask?: boolean; // Admin only
  isUsedInFormula?: boolean; // Admin only
  min_value: number;
  max_value: number;
  responseType: 'int_float' | 'boolean' | 'categorical';
  normalisationFormula?: string;
  variableCategoryId: number;
  variableProportion: number;
  createdAt: string;
  updatedAt: string;
  variableCategory?: VariableCategory;
  categoryMappings?: CategoryMapping[];
}

interface CategoryMapping {
  id?: number;
  variableId?: number;
  categoryName: string;
  numericValue: number;
  createdAt?: string;
  updatedAt?: string;
}

interface RedistributeProportions {
  variableId: number;
  proportion: number;
}

interface ClientVariableValue {
  variableId: number;
  value: number | string | boolean;
  clientId?: number;
  uploadBatchId?: number;
}

interface CreditScoringResult {
  clientId: number;
  creditLimit: number;
  interestRate: number;
  riskScore: number;
  categoryScores: CategoryScore[];
  variableScores: VariableScore[];
  calculationMetadata: CalculationMetadata;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
  error?: string;
}
```

### JavaScript Usage Examples

```javascript
// Example: Creating a new categorical variable
const createCategoricalVariable = async () => {
  const variableData = {
    name: "Employment Status",
    description: "Current employment status of the client",
    uniqueCode: 2001,
    is_required: true,
    min_value: 0,
    max_value: 1,
    responseType: "categorical",
    variableCategoryId: 2,
    variableProportion: 40.0,
    categoryMappings: [
      { categoryName: "Unemployed", numericValue: 0.0 },
      { categoryName: "Part-time", numericValue: 0.4 },
      { categoryName: "Full-time", numericValue: 0.8 },
      { categoryName: "Self-employed", numericValue: 1.0 }
    ],
    redistributeProportions: [
      { variableId: 5, proportion: 60.0 }
    ]
  };

  try {
    const response = await fetch('/api/variable/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(variableData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Variable created:', result.data.variable);
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Example: Normalizing client variables
const normalizeClientData = async (clientId, variableValues) => {
  const requestData = {
    clientId: clientId,
    variableValues: variableValues,
    uploadBatchId: 123
  };

  try {
    const response = await fetch('/api/variable/normalize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(requestData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Normalization error:', error);
    throw error;
  }
};

// Example: Batch credit scoring calculation
const calculateBatchScores = async (clientIds) => {
  const requestData = {
    clientIds: clientIds,
    uploadBatchId: 456
  };

  try {
    const response = await fetch('/api/variable/calculate-batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(requestData)
    });
    
    const result = await response.json();
    
    // Process results
    result.data.results.forEach(clientResult => {
      if (clientResult.success) {
        console.log(`Client ${clientResult.clientId}: Credit Limit = ${clientResult.creditLimit}`);
      } else {
        console.error(`Client ${clientResult.clientId}: ${clientResult.error}`);
      }
    });
    
    return result;
  } catch (error) {
    console.error('Batch calculation error:', error);
    throw error;
  }
};
```

---

## Error Handling

### Common Error Responses

#### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized: No authorization header provided",
  "status": 401
}
```

#### 403 - Forbidden
```json
{
  "success": false,
  "message": "Admin access required",
  "status": 403
}
```

#### 404 - Not Found
```json
{
  "success": false,
  "message": "Variable not found",
  "status": 404
}
```

#### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message",
  "status": 500
}
```

---

## Validation Rules Summary

### Variable Creation Validation
- `name`: 1-255 characters, required
- `uniqueCode`: Must be unique across all variables
- `min_value` < `max_value`: Required
- `responseType`: Must be one of the enum values
- `variableProportion`: 0.1-100.0 for new categories, must sum to 100% with redistributions
- `normalisationFormula`: Required for int_float, forbidden for others
- `categoryMappings`: Required for categorical (min 2, max 20), forbidden for others

### Category Mappings Validation
- `categoryName`: 1-100 characters, unique within variable
- `numericValue`: 0.0-1.0, unique within variable
- Must have at least 2 mappings for categorical variables

### Proportion Redistribution Validation
- Must include ALL existing variables in category
- Sum of redistributed + new variable proportion = 100%
- Each proportion > 0

---

## Rate Limiting
All endpoints are subject to rate limiting. Current limits:
- 100 requests per minute per user
- 1000 requests per hour per user

## Versioning
Current API version: v1
Version is included in the base URL: `/api/variable`

## Support
For API support, contact: support@algee.com
