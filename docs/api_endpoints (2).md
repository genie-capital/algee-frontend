# Algee API Documentation

## Overview
The Algee API provides endpoints for managing administrative functions and institution management. This documentation covers all available endpoints with detailed request/response specifications.

**Base URL:** `http://localhost:3000/api`

## Table of Contents

1. [Authentication](#authentication)
   - [Authentication Levels](#authentication-levels)

2. [Admin Management Endpoints](#admin-management-endpoints)
   - [1. Create Admin](#1-create-admin)
   - [2. Admin Login](#2-admin-login)
   - [3. Get All Admins](#3-get-all-admins)
   - [4. Update Admin](#4-update-admin)
   - [5. Deactivate Admin](#5-deactivate-admin)
   - [6. Update Admin Active Status](#6-update-admin-active-status)
   - [7. Update Institution Active Status](#7-update-institution-active-status)

3. [Institution Management Endpoints](#institution-management-endpoints)
   - [1. Create Institution](#1-create-institution)
   - [2. Institution Login](#2-institution-login)
   - [3. Get All Institutions](#3-get-all-institutions)
   - [4. Update Institution](#4-update-institution)
   - [5. Deactivate Institution](#5-deactivate-institution)

4. [Institution Parameter Management Endpoints](#institution-parameter-management-endpoints)
   - [1. Set Institution Parameters](#1-set-institution-parameters)
   - [2. Get Institution Parameters (Detailed)](#2-get-institution-parameters-detailed)
   - [3. Get Institution Parameters (Simple)](#3-get-institution-parameters-simple)
   - [4. Update Parameter Value](#4-update-parameter-value)
   - [5. Update Parameter](#5-update-parameter)
   - [6. Delete Parameter](#6-delete-parameter)

5. [Parameter Management Endpoints](#parameter-management-endpoints)
   - [1. Create Parameter](#1-create-parameter)
   - [2. Update Parameter](#2-update-parameter)
   - [3. Delete Parameter](#3-delete-parameter)
   - [4. Get All Parameters](#4-get-all-parameters)
   - [5. Get Parameter by ID](#5-get-parameter-by-id)

6. [Variable Management Endpoints](#variable-management-endpoints)
   - [1. Create Variable](#1-create-variable)
   - [2. Update Variable](#2-update-variable)
   - [3. Delete Variable](#3-delete-variable)
   - [4. Get All Variables](#4-get-all-variables)
   - [5. Get Variable by ID](#5-get-variable-by-id)
   - [6. Get Variables by Category](#6-get-variables-by-category)
   - [7. Get Variables by Response Type](#7-get-variables-by-response-type)
   - [8. Get Non-Masked Variables](#8-get-non-masked-variables)
   - [9. Get Masked Variables](#9-get-masked-variables)
   - [10. Search Variables](#10-search-variables)
   - [11. Get Category Proportion Summary](#11-get-category-proportion-summary)
   - [12. Validate Normalization Formula](#12-validate-normalization-formula)
   - [13. Test Variable Normalization](#13-test-variable-normalization)
   - [14. Normalize Client Variables](#14-normalize-client-variables)
   - [15. Get Client Weighted Scores](#15-get-client-weighted-scores)
   - [16. Trigger Variable Re-Normalization](#16-trigger-variable-re-normalization)
   - [17. Redistribute Category Proportions](#17-redistribute-category-proportions)
   - [18. Get Variable Proportion History](#18-get-variable-proportion-history)
   - [19. Get Category Proportion History](#19-get-category-proportion-history)
   - [20. Get Proportion Change Batches](#20-get-proportion-change-batches)

7. [Variable Category Management Endpoints](#variable-category-management-endpoints)
   - [1. Create Variable Category](#1-create-variable-category)
   - [2. Update Variable Category](#2-update-variable-category)
   - [3. Get All Variable Categories](#3-get-all-variable-categories)
   - [4. Get Variable Category by ID](#4-get-variable-category-by-id)
   - [5. Delete Variable Category](#5-delete-variable-category)

8. [CSV Upload Management Endpoints](#csv-upload-management-endpoints)
   - [1. Upload and Process CSV File](#1-upload-and-process-csv-file)
   - [2. Get Upload Batches](#2-get-upload-batches)
   - [3. Get Upload Batch Details](#3-get-upload-batch-details)
   - [4. Get Upload Batch Errors](#4-get-upload-batch-errors)
   - [5. Download CSV Template](#5-download-csv-template)

9. [Credit Scoring Endpoints](#credit-scoring-endpoints)
   - [1. Calculate Client Result](#1-calculate-client-result)
   - [2. Calculate Batch Results](#2-calculate-batch-results)
   - [3. Get Client Result](#3-get-client-result)

10. [Data Models](#data-models)
   - [Admin Model](#admin-model)
   - [Institution Model](#institution-model)
   - [Parameter Model](#parameter-model)
   - [InstitutionParameter Model](#institutionparameter-model)
   - [Variable Model](#variable-model)
   - [VariableCategory Model](#variablecategory-model)
   - [CategoryResponseMapping Model](#categoryresponsemapping-model)
   - [UploadBatch Model](#uploadbatch-model)
   - [UploadBatchClient Model](#uploadbatchclient-model)
   - [Client Model](#client-model)
   - [ClientVariableValue Model](#clientvariablevalue-model)
   - [ClientResult Model](#clientresult-model)

11. [Authentication Details](#authentication-details)
   - [JWT Token Structure](#jwt-token-structure)
   - [Common Authentication Errors](#common-authentication-errors)

12. [Error Handling](#error-handling)
   - [Success Response Structure](#success-response-structure)
   - [Error Response Structure](#error-response-structure)
   - [HTTP Status Codes Used](#http-status-codes-used)

13. [Rate Limiting and Security](#rate-limiting-and-security)

14. [Testing the API](#testing-the-api)
   - [Using cURL](#using-curl)
   - [Using Postman](#using-postman)

---

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Levels
- **Public**: No authentication required
- **Admin**: Requires admin authentication and active status
- **Institution**: Requires institution authentication and active status
- **Protected**: Requires valid JWT token and active user status (admin or institution)

---

## Admin Management Endpoints

### 1. Create Admin

Creates a new admin account in the system.

**Endpoint:** `POST /api/admin/create`  
**Authentication:** Public  
**Content-Type:** `application/json`

#### Request Body
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required)"
}
```

#### Request Example
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Response

**Success (201 Created)**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "admin": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "is_active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**

*400 Bad Request - Missing Fields*
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

*400 Bad Request - Admin Exists*
```json
{
  "success": false,
  "message": "Admin already exists"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to create admin",
  "error": "Error details"
}
```

---

### 2. Admin Login

Authenticates an admin and returns a JWT token.

**Endpoint:** `POST /api/admin/login`  
**Authentication:** Public  
**Content-Type:** `application/json`

#### Request Body
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Request Example
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Admin logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**

*400 Bad Request - Missing Fields*
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

*401 Unauthorized - Invalid Credentials*
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

*403 Forbidden - Inactive Account*
```json
{
  "success": false,
  "message": "Your admin account has been deactivated. Please contact support."
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to login admin",
  "error": "Error details"
}
```

---

### 3. Get All Admins

Retrieves a list of all admin accounts.

**Endpoint:** `GET /api/admin/getAllAdmins`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`

#### Request
No request body required.

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Admins retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "$2b$10$hashedPassword...",
      "is_active": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "password": "$2b$10$hashedPassword...",
      "is_active": false,
      "createdAt": "2024-01-16T09:15:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z"
    }
  ]
}
```

**Error Responses**

*401 Unauthorized - No Token*
```json
{
  "success": false,
  "message": "Unauthorized: No authorization header provided"
}
```

*401 Unauthorized - Invalid Token*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token",
  "error": "Error details"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*403 Forbidden - Inactive Account*
```json
{
  "success": false,
  "message": "Your admin account has been deactivated. Please contact support."
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to retrieve admins",
  "error": "Error details"
}
```

---

### 4. Update Admin

Updates an existing admin's information.

**Endpoint:** `PUT /api/admin/update/{id}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### URL Parameters
- `id` (integer, required): The ID of the admin to update

#### Request Body
```json
{
  "name": "string (optional)",
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Request Example
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "password": "newSecurePassword123"
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Admin updated successfully"
}
```

**Error Responses**

*400 Bad Request - Missing Fields*
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

*401 Unauthorized - Admin Not Found*
```json
{
  "success": false,
  "message": "Invalid admin"
}
```

*401 Unauthorized - Authentication Issues*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to update admin",
  "error": "Error details"
}
```

---

### 5. Deactivate Admin

Deactivates an admin account (sets is_active to false).

**Endpoint:** `DELETE /api/admin/deactivate/{id}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `id` (integer, required): The ID of the admin to deactivate

#### Request
No request body required.

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Admin deactivated successfully"
}
```

**Error Responses**

*401 Unauthorized - Admin Not Found*
```json
{
  "success": false,
  "message": "Invalid admin"
}
```

*401 Unauthorized - Authentication Issues*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to deactivate admin",
  "error": "Error details"
}
```

---

### 6. Update Admin Active Status

Updates the active status of an admin account (activate/deactivate).

**Endpoint:** `PATCH /api/admin/update-admin-status/{id}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### URL Parameters
- `id` (integer, required): The ID of the admin to update

#### Request Body
```json
{
  "is_active": "boolean (required)"
}
```

#### Request Example
```json
{
  "is_active": false
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Admin account deactivated successfully",
  "data": {
    "adminId": 2,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "oldStatus": true,
    "newStatus": false
  }
}
```

**Error Responses**

*400 Bad Request - Invalid Field*
```json
{
  "success": false,
  "message": "is_active field is required and must be a boolean value"
}
```

*400 Bad Request - Self Deactivation*
```json
{
  "success": false,
  "message": "You cannot deactivate your own account"
}
```

*404 Not Found - Admin Not Found*
```json
{
  "success": false,
  "message": "Admin not found"
}
```

*401 Unauthorized - Authentication Issues*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to update admin active status",
  "error": "Error details"
}
```

---

### 7. Update Institution Active Status

Updates the active status of an institution account (activate/deactivate).

**Endpoint:** `PATCH /api/admin/update-institution-status/{id}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### URL Parameters
- `id` (integer, required): The ID of the institution to update

#### Request Body
```json
{
  "is_active": "boolean (required)"
}
```

#### Request Example
```json
{
  "is_active": true
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Institution account activated successfully",
  "data": {
    "institutionId": 5,
    "name": "University of Example",
    "email": "admin@university.edu",
    "oldStatus": false,
    "newStatus": true
  }
}
```

**Error Responses**

*400 Bad Request - Invalid Field*
```json
{
  "success": false,
  "message": "is_active field is required and must be a boolean value"
}
```

*404 Not Found - Institution Not Found*
```json
{
  "success": false,
  "message": "Institution not found"
}
```

*401 Unauthorized - Authentication Issues*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to update institution active status",
  "error": "Error details"
}
```

---

## Institution Management Endpoints

### 1. Create Institution

Creates a new institution account in the system.

**Endpoint:** `POST /api/institution/create`  
**Authentication:** Public  
**Content-Type:** `application/json`

#### Request Body
```json
{
  "name": "string (required, unique)",
  "email": "string (required, unique)",
  "password": "string (required)"
}
```

#### Request Example
```json
{
  "name": "University of Technology",
  "email": "admin@university.edu",
  "password": "securePassword123"
}
```

#### Response

**Success (201 Created)**
```json
{
  "success": true,
  "message": "Institution created successfully",
  "data": {
    "id": 1,
    "name": "University of Technology",
    "email": "admin@university.edu",
    "password": "$2b$10$hashedPassword...",
    "is_active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**

*400 Bad Request - Missing Fields*
```json
{
  "success": false,
  "message": "Email, password and name are required"
}
```

*400 Bad Request - Institution Exists*
```json
{
  "success": false,
  "message": "Institution already exists"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to create institution",
  "error": "Error details"
}
```

---

### 2. Institution Login

Authenticates an institution and returns a JWT token.

**Endpoint:** `POST /api/institution/login`  
**Authentication:** Public  
**Content-Type:** `application/json`

#### Request Body
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Request Example
```json
{
  "email": "admin@university.edu",
  "password": "securePassword123"
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Institution logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**

*400 Bad Request - Missing Fields*
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

*401 Unauthorized - Invalid Credentials*
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

*403 Forbidden - Inactive Account*
```json
{
  "success": false,
  "message": "Your institution account has been deactivated. Please contact support."
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to login institution",
  "error": "Error details"
}
```

---

### 3. Get All Institutions

Retrieves a list of all institution accounts.

**Endpoint:** `GET /api/institution/getAllInstitutions`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`

#### Request
No request body required.

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Institutions retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "University of Technology",
      "email": "admin@university.edu",
      "password": "$2b$10$hashedPassword...",
      "is_active": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "College of Business",
      "email": "admin@college.edu",
      "password": "$2b$10$hashedPassword...",
      "is_active": false,
      "createdAt": "2024-01-16T09:15:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z"
    }
  ]
}
```

**Error Responses**

*401 Unauthorized - No Token*
```json
{
  "success": false,
  "message": "Unauthorized: No authorization header provided"
}
```

*401 Unauthorized - Invalid Token*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token",
  "error": "Error details"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to retrieve institutions",
  "error": "Error details"
}
```

---

### 4. Update Institution

Updates an existing institution's information.

**Endpoint:** `PUT /api/institution/update/{id}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### URL Parameters
- `id` (integer, required): The ID of the institution to update

#### Request Body
```json
{
  "name": "string (optional)",
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Request Example
```json
{
  "name": "Updated University Name",
  "email": "newemail@university.edu",
  "password": "newSecurePassword123"
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Institution updated successfully"
}
```

**Error Responses**

*400 Bad Request - Missing Fields*
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

*401 Unauthorized - Institution Not Found*
```json
{
  "success": false,
  "message": "Invalid institution"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to update institution",
  "error": "Error details"
}
```

---

### 5. Deactivate Institution

Deactivates an institution account (sets is_active to false).

**Endpoint:** `POST /api/institution/deactivate/{id}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `id` (integer, required): The ID of the institution to deactivate

#### Request
No request body required.

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Institution deactivated successfully"
}
```

**Error Responses**

*401 Unauthorized - Institution Not Found*
```json
{
  "success": false,
  "message": "Invalid institution"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to deactivate institution",
  "error": "Error details"
}
```

---

## Institution Parameter Management Endpoints

### 1. Set Institution Parameters

Sets multiple parameters for an institution. This endpoint supports both creating new parameters and updating existing ones (upsert operation).

**Endpoint:** `POST /api/institution/setParameters/{institutionId}`  
**Authentication:** Institution Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### URL Parameters
- `institutionId` (integer, required): The ID of the institution

#### Request Body
```json
{
  "parameters": [
    {
      "parameterId": "number (required)",
      "value": "number (required)"
    }
  ]
}
```

#### Request Example
```json
{
  "parameters": [
    {
      "parameterId": 1,
      "value": 3.5
    },
    {
      "parameterId": 2,
      "value": 50000.00
    },
    {
      "parameterId": 3,
      "value": 1000.00
    }
  ]
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Institution parameters set successfully.",
  "data": [
    {
      "id": 1,
      "institutionId": 1,
      "parameterId": 1,
      "value": 3.5,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "institutionId": 1,
      "parameterId": 2,
      "value": 50000,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error Responses**

*400 Bad Request - Missing Institution ID*
```json
{
  "success": false,
  "message": "Institution id not provided"
}
```

*400 Bad Request - Invalid Parameters Array*
```json
{
  "success": false,
  "message": "Parameters must be a non-empty array."
}
```

*400 Bad Request - Invalid Parameter Format*
```json
{
  "success": false,
  "message": "Each parameter must have a numeric parameterId and value."
}
```

*404 Not Found - Institution Not Found*
```json
{
  "success": false,
  "message": "Institution not found."
}
```

*404 Not Found - Parameter Not Found*
```json
{
  "success": false,
  "message": "Parameter with id 5 not found."
}
```

*403 Forbidden - Not Institution*
```json
{
  "success": false,
  "message": "Institution access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to set institution parameters",
  "error": "Error details"
}
```

---

### 2. Get Institution Parameters (Detailed)

Retrieves institution parameters with detailed parameter information including parameter names and descriptions.

**Endpoint:** `GET /api/institution/getParameters/{institutionId}`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `institutionId` (integer, required): The ID of the institution

#### Request
No request body required.

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Institution parameters for institution: 1 retrieved successfully",
  "data": [
    {
      "id": 1,
      "institutionId": 1,
      "parameterId": 1,
      "value": 3.5,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "parameter": {
        "id": 1,
        "name": "Income Multiple",
        "description": "Factor for multiplying clients income when computing credit limit"
      }
    },
    {
      "id": 2,
      "institutionId": 1,
      "parameterId": 2,
      "value": 50000,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "parameter": {
        "id": 2,
        "name": "Maximum Risky Loan Amount",
        "description": "Maximum amount of loan that can be granted to a client"
      }
    }
  ]
}
```

**Error Responses**

*401 Unauthorized - No Parameters Set*
```json
{
  "success": false,
  "message": "This institution does not have any parameters set"
}
```

*401 Unauthorized - Authentication Issues*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to retrieve institution parameters",
  "error": "Error details"
}
```

---

### 3. Get Institution Parameters (Simple)

Retrieves institution parameters without detailed parameter information.

**Endpoint:** `GET /api/institution/getParametersForInstitution/{institutionId}`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `institutionId` (integer, required): The ID of the institution

#### Request
No request body required.

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Institution parameters retrieved successfully",
  "data": [
    {
      "id": 1,
      "institutionId": 1,
      "parameterId": 1,
      "value": 3.5,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "institutionId": 1,
      "parameterId": 2,
      "value": 50000,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error Responses**

*401 Unauthorized - No Parameters Set*
```json
{
  "success": false,
  "message": "This estate does not have any parameters set"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to retrieve institution parameter",
  "error": "Error details"
}
```

---

### 4. Update Parameter Value

Updates the value of a specific institution parameter.

**Endpoint:** `PUT /api/institution/updateParameterValue/{institutionParameterId}`  
**Authentication:** Institution Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### URL Parameters
- `institutionParameterId` (integer, required): The ID of the institution parameter to update

#### Request Body
```json
{
  "value": "number (required)"
}
```

#### Request Example
```json
{
  "value": 4.0
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Institution parameter value updated successfully",
  "institutionParameter": {
    "id": 1,
    "institutionId": 1,
    "parameterId": 1,
    "value": 4.0,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

**Error Responses**

*400 Bad Request - Missing Value*
```json
{
  "success": false,
  "message": "Value is required"
}
```

*401 Unauthorized - Parameter Not Found*
```json
{
  "success": false,
  "message": "This institution parameter does not exist"
}
```

*403 Forbidden - Not Institution*
```json
{
  "success": false,
  "message": "Institution access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to update institution parameter value",
  "error": "Error details"
}
```

---

### 5. Update Parameter

Updates all fields of an institution parameter (institutionId, parameterId, and value).

**Endpoint:** `PUT /api/institution/updateParameter/{institutionParameterId}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### URL Parameters
- `institutionParameterId` (integer, required): The ID of the institution parameter to update

#### Request Body
```json
{
  "institutionId": "number (required)",
  "parameterId": "number (required)",
  "value": "number (required)"
}
```

#### Request Example
```json
{
  "institutionId": 1,
  "parameterId": 2,
  "value": 60000.00
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Institution parameter updated successfully",
  "institutionParameter": {
    "id": 1,
    "institutionId": 1,
    "parameterId": 2,
    "value": 60000,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

**Error Responses**

*400 Bad Request - Missing Fields*
```json
{
  "success": false,
  "message": "Institution ID, parameter ID and value are required"
}
```

*401 Unauthorized - Invalid Institution*
```json
{
  "success": false,
  "message": "Invalid institution"
}
```

*401 Unauthorized - Invalid Parameter*
```json
{
  "success": false,
  "message": "Invalid parameter"
}
```

*401 Unauthorized - Invalid Institution Parameter*
```json
{
  "success": false,
  "message": "Invalid institution parameter"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to create institution parameter",
  "error": "Error details"
}
```

---

### 6. Delete Parameter

Deletes an institution parameter.

**Endpoint:** `DELETE /api/institution/deleteParameter/{institutionParameterId}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `institutionParameterId` (integer, required): The ID of the institution parameter to delete

#### Request
No request body required.

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Institution parameter deleted successfully"
}
```

**Error Responses**

*401 Unauthorized - Parameter Not Found*
```json
{
  "success": false,
  "message": "This institution parameter does not exist"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to delete institution parameter",
  "error": "Error details"
}
```

---

## Parameter Management Endpoints

The Parameter Management endpoints allow administrators to manage system parameters that define the configuration options available to institutions. These parameters serve as templates that institutions can use to configure their specific settings.

### 1. Create Parameter

Creates a new system parameter that can be used by institutions.

**Endpoint:** `POST /api/parameter/create`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### Request Body
```json
{
  "name": "string (required, unique)",
  "description": "string (required)",
  "uniqueCode": "integer (required, unique)",
  "isRequired": "boolean (optional, default: false)",
  "isActive": "boolean (optional, default: true)"
}
```

#### Request Example
```json
{
  "name": "Default Interest Rate",
  "description": "The default interest rate applied to new loan applications",
  "uniqueCode": 1006,
  "isRequired": true,
  "isActive": true
}
```

#### Response

**Success (201 Created)**
```json
{
  "success": true,
  "message": "Parameter created successfully",
  "data": {
    "id": 6,
    "name": "Default Interest Rate",
    "uniqueCode": 1006,
    "description": "The default interest rate applied to new loan applications",
    "is_active": true,
    "is_required": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**

*400 Bad Request - Missing Required Fields*
```json
{
  "success": false,
  "message": "Parameter name, description and unique code are required"
}
```

*401 Unauthorized - Authentication Issues*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to create parameter",
  "error": "Error details"
}
```

---

### 2. Update Parameter

Updates an existing system parameter's information.

**Endpoint:** `PUT /api/parameter/update/{id}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### URL Parameters
- `id` (integer, required): The ID of the parameter to update

#### Request Body
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "isRequired": "boolean (required)",
  "isActive": "boolean (required)"
}
```

#### Request Example
```json
{
  "name": "Updated Interest Rate",
  "description": "Updated description for the interest rate parameter",
  "isRequired": false,
  "isActive": true
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Parameter updated successfully"
}
```

**Error Responses**

*400 Bad Request - Missing Required Fields*
```json
{
  "success": false,
  "message": "Parameter name, description, active state and required state are required"
}
```

*401 Unauthorized - Parameter Not Found*
```json
{
  "success": false,
  "message": "Invalid parameter"
}
```

*401 Unauthorized - Authentication Issues*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to update parameter",
  "error": "Error details"
}
```

---

### 3. Delete Parameter

Permanently deletes a system parameter from the database.

**Endpoint:** `DELETE /api/parameter/delete/{id}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `id` (integer, required): The ID of the parameter to delete

#### Request
No request body required.

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Parameter deleted successfully"
}
```

**Error Responses**

*401 Unauthorized - Parameter Not Found*
```json
{
  "success": false,
  "message": "Invalid parameter"
}
```

*401 Unauthorized - Authentication Issues*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to delete parameter",
  "error": "Error details"
}
```

---

### 4. Get All Parameters

Retrieves a list of all system parameters available in the system.

**Endpoint:** `GET /api/parameter/all`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### Request
No request body required.

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Parameters retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Income Multiple",
      "uniqueCode": 1001,
      "description": "Factor for multiplying clients income when computing credit limit",
      "is_active": true,
      "is_required": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Maximum Risky Loan Amount",
      "uniqueCode": 1002,
      "description": "Maximum amount of loan that can be granted to a client",
      "is_active": true,
      "is_required": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 3,
      "name": "Minimum Risky Loan Amount",
      "uniqueCode": 1003,
      "description": "Minimum amount of loan that can be granted to a client",
      "is_active": true,
      "is_required": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error Responses**

*401 Unauthorized - No Token*
```json
{
  "success": false,
  "message": "Unauthorized: No authorization header provided"
}
```

*401 Unauthorized - Invalid Token*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token",
  "error": "Error details"
}
```

*403 Forbidden - Inactive Account*
```json
{
  "success": false,
  "message": "Your account has been deactivated. Please contact support."
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to retrieve parameters",
  "error": "Error details"
}
```

---

### 5. Get Parameter by ID

Retrieves detailed information about a specific parameter by its ID.

**Endpoint:** `GET /api/parameter/{id}`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `id` (integer, required): The ID of the parameter to retrieve

#### Request
No request body required.

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Parameter retrieved successfully",
  "data": {
    "id": 1,
    "name": "Income Multiple",
    "uniqueCode": 1001,
    "description": "Factor for multiplying clients income when computing credit limit",
    "is_active": true,
    "is_required": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**

*401 Unauthorized - No Token*
```json
{
  "success": false,
  "message": "Unauthorized: No authorization header provided"
}
```

*401 Unauthorized - Invalid Token*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token",
  "error": "Error details"
}
```

*403 Forbidden - Inactive Account*
```json
{
  "success": false,
  "message": "Your account has been deactivated. Please contact support."
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to retrieve parameter",
  "error": "Error details"
}
```

---

## Variable Management Endpoints

The Variable Management endpoints allow administrators to manage system variables that define the data points used in credit scoring calculations. Variables are organized into categories and can have different response types (numeric, boolean, or categorical). These endpoints provide comprehensive functionality for variable configuration, normalization, and proportion management.

### 1. Create Variable

Creates a new system variable with specified configuration and category mappings.

**Endpoint:** `POST /api/variable/create`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### Request Body
```json
{
  "name": "string (required, unique)",
  "description": "string (required)",
  "uniqueCode": "integer (required, unique)",
  "is_required": "boolean (optional, default: true)",
  "mask": "boolean (optional, default: false)",
  "isUsedInFormula": "boolean (optional, default: false)",
  "min_value": "number (required)",
  "max_value": "number (required)",
  "responseType": "string (required: 'int_float', 'boolean', 'categorical')",
  "normalisationFormula": "string (optional, required for int_float)",
  "variableCategoryId": "integer (required)",
  "variableProportion": "number (required, 0-100)",
  "categoryMappings": "array (required for categorical response type)",
  "redistributeProportions": "array (optional, for existing categories)"
}
```

#### Request Example
```json
{
  "name": "Monthly Income",
  "description": "Client's monthly income in local currency",
  "uniqueCode": 2001,
  "is_required": true,
  "mask": false,
  "isUsedInFormula": true,
  "min_value": 0,
  "max_value": 1000000,
  "responseType": "int_float",
  "normalisationFormula": "value / max_value",
  "variableCategoryId": 1,
  "variableProportion": 30.0,
  "redistributeProportions": [
    {
      "variableId": 5,
      "proportion": 35.0
    },
    {
      "variableId": 6,
      "proportion": 35.0
    }
  ]
}
```

#### Categorical Variable Example
```json
{
  "name": "Employment Status",
  "description": "Client's current employment status",
  "uniqueCode": 2002,
  "is_required": true,
  "mask": false,
  "isUsedInFormula": false,
  "min_value": 0,
  "max_value": 1,
  "responseType": "categorical",
  "variableCategoryId": 2,
  "variableProportion": 25.0,
  "categoryMappings": [
    {
      "categoryName": "Employed Full-time",
      "numericValue": 1.0
    },
    {
      "categoryName": "Employed Part-time",
      "numericValue": 0.7
    },
    {
      "categoryName": "Self-employed",
      "numericValue": 0.8
    },
    {
      "categoryName": "Unemployed",
      "numericValue": 0.0
    }
  ]
}
```

#### Response

**Success (201 Created)**
```json
{
  "success": true,
  "message": "Variable created successfully",
  "data": {
    "variable": {
      "id": 15,
      "name": "Monthly Income",
      "description": "Client's monthly income in local currency",
      "uniqueCode": 2001,
      "is_required": true,
      "mask": false,
      "isUsedInFormula": true,
      "min_value": 0,
      "max_value": 1000000,
      "responseType": "int_float",
      "normalisationFormula": "value / max_value",
      "variableCategoryId": 1,
      "variableProportion": 30,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "categoryMappings": [],
    "redistributionResult": {
      "success": true,
      "message": "Proportions redistributed successfully",
      "changesApplied": 2,
      "batchId": "batch_uuid_123"
    }
  },
  "status": 201
}
```

**Error Responses**

*400 Bad Request - Missing Required Fields*
```json
{
  "success": false,
  "message": "Required fields: name, description, uniqueCode, min_value, max_value, responseType, variableCategoryId, variableProportion",
  "status": 400
}
```

*400 Bad Request - Duplicate Unique Code*
```json
{
  "success": false,
  "message": "Variable with this uniqueCode already exists",
  "status": 400
}
```

*400 Bad Request - Invalid Category Mappings*
```json
{
  "success": false,
  "message": "Category mappings are required for categorical response type",
  "status": 400
}
```

*400 Bad Request - Invalid Normalization Formula*
```json
{
  "success": false,
  "message": "Invalid formula: Undefined variable 'invalid_var' in formula",
  "status": 400
}
```

---

### 2. Update Variable

Updates an existing variable's configuration and properties.

**Endpoint:** `PUT /api/variable/update/{id}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### URL Parameters
- `id` (integer, required): The ID of the variable to update

#### Request Body
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "is_required": "boolean (required)",
  "mask": "boolean (required)",
  "isUsedInFormula": "boolean (required)",
  "min_value": "number (required)",
  "max_value": "number (required)",
  "responseType": "string (required)",
  "normalisationFormula": "string (optional)",
  "variableCategoryId": "integer (required)",
  "variableProportion": "number (required)",
  "categoryMappings": "array (optional)"
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Variable updated successfully",
  "data": {
    "variable": {
      "id": 15,
      "name": "Updated Monthly Income",
      "description": "Updated description",
      "uniqueCode": 2001,
      "is_required": true,
      "mask": false,
      "isUsedInFormula": true,
      "min_value": 0,
      "max_value": 2000000,
      "responseType": "int_float",
      "normalisationFormula": "value / max_value * 0.8",
      "variableCategoryId": 1,
      "variableProportion": 35,
      "updatedAt": "2024-01-15T11:45:00.000Z"
    }
  },
  "status": 200
}
```

---

### 3. Delete Variable

Permanently deletes a variable from the system.

**Endpoint:** `DELETE /api/variable/delete/{id}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `id` (integer, required): The ID of the variable to delete

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Variable deleted successfully",
  "status": 200
}
```

**Error Responses**

*404 Not Found*
```json
{
  "success": false,
  "message": "Variable not found",
  "status": 404
}
```

---

### 4. Get All Variables

Retrieves a paginated list of all variables with optional associations.

**Endpoint:** `GET /api/variable/all`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### Query Parameters
- `page` (integer, optional, default: 1): Page number for pagination
- `limit` (integer, optional, default: 10): Number of items per page
- `includeAssociations` (boolean, optional, default: true): Include category and mapping data

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Variables retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Monthly Income",
      "description": "Client's monthly income in local currency",
      "uniqueCode": 2001,
      "is_required": true,
      "min_value": 0,
      "max_value": 1000000,
      "responseType": "int_float",
      "normalisationFormula": "value / max_value",
      "variableCategoryId": 1,
      "variableProportion": 30,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "variableCategory": {
        "id": 1,
        "name": "Financial Information",
        "description": "Variables related to client's financial status",
        "creditLimitWeight": 0.4,
        "interestRateWeight": 0.3
      },
      "categoryMappings": []
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  },
  "status": 200
}
```

**Note:** Institution users will not see sensitive fields like `mask` and `isUsedInFormula`.

---

### 5. Get Variable by ID

Retrieves detailed information about a specific variable.

**Endpoint:** `GET /api/variable/{id}`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `id` (integer, required): The ID of the variable to retrieve

#### Query Parameters
- `includeAssociations` (boolean, optional, default: true): Include category and mapping data

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Variable retrieved successfully",
  "data": {
    "id": 1,
    "name": "Monthly Income",
    "description": "Client's monthly income in local currency",
    "uniqueCode": 2001,
    "is_required": true,
    "min_value": 0,
    "max_value": 1000000,
    "responseType": "int_float",
    "normalisationFormula": "value / max_value",
    "variableCategoryId": 1,
    "variableProportion": 30,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "variableCategory": {
      "id": 1,
      "name": "Financial Information",
      "description": "Variables related to client's financial status",
      "creditLimitWeight": 0.4,
      "interestRateWeight": 0.3
    },
    "categoryMappings": []
  },
  "status": 200
}
```

---

### 6. Get Variables by Category

Retrieves all variables belonging to a specific category.

**Endpoint:** `GET /api/variable/category/{categoryId}`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `categoryId` (integer, required): The ID of the variable category

#### Query Parameters
- `includeAssociations` (boolean, optional, default: true): Include category and mapping data

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Variables retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Monthly Income",
      "variableCategoryId": 1,
      "variableProportion": 30,
      "variableCategory": {
        "id": 1,
        "name": "Financial Information"
      }
    }
  ],
  "count": 3,
  "status": 200
}
```

---

### 7. Get Variables by Response Type

Retrieves all variables with a specific response type.

**Endpoint:** `GET /api/variable/response-type/{responseType}`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `responseType` (string, required): The response type ('int_float', 'boolean', 'categorical')

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Variables retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Monthly Income",
      "responseType": "int_float",
      "normalisationFormula": "value / max_value"
    }
  ],
  "count": 5,
  "status": 200
}
```

**Error Responses**

*400 Bad Request - Invalid Response Type*
```json
{
  "success": false,
  "message": "Invalid response type. Valid types: int_float, boolean, categorical",
  "status": 400
}
```

---

### 8. Get Non-Masked Variables

Retrieves all variables that are not masked (visible to institutions).

**Endpoint:** `GET /api/variable/non-masked`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### Query Parameters
- `includeAssociations` (boolean, optional, default: true): Include category and mapping data

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Non-masked variables retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Monthly Income",
      "mask": false,
      "responseType": "int_float"
    }
  ],
  "count": 8,
  "status": 200
}
```

---

### 9. Get Masked Variables

Retrieves all variables that are masked (hidden from institutions).

**Endpoint:** `GET /api/variable/masked`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Masked variables retrieved successfully",
  "data": [
    {
      "id": 5,
      "name": "Internal Risk Score",
      "responseType": "int_float"
    }
  ],
  "count": 2,
  "status": 200
}
```

---

### 10. Search Variables

Searches variables by name or description with optional filtering.

**Endpoint:** `GET /api/variable/search`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### Query Parameters
- `query` (string, required): Search term for name or description
- `categoryId` (integer, optional): Filter by category ID
- `responseType` (string, optional): Filter by response type
- `includeAssociations` (boolean, optional, default: true): Include category and mapping data

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Variables search completed successfully",
  "data": [
    {
      "id": 1,
      "name": "Monthly Income",
      "description": "Client's monthly income in local currency",
      "responseType": "int_float"
    }
  ],
  "count": 1,
  "searchQuery": "income",
  "status": 200
}
```

---

### 11. Get Category Proportion Summary

Retrieves a summary of variable proportions within a category.

**Endpoint:** `GET /api/variable/category-proportion-summary/{categoryId}`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `categoryId` (integer, required): The ID of the variable category

#### Response

**Success (200 OK)**
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
        "proportion": 30
      },
      {
        "id": 2,
        "name": "Credit History",
        "proportion": 25
      }
    ]
  },
  "status": 200
}
```

---

### 12. Validate Normalization Formula

Validates a normalization formula for syntax and context correctness.

**Endpoint:** `POST /api/variable/validate-normalization-formula`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### Request Body
```json
{
  "formula": "string (required)",
  "responseType": "string (required)",
  "variableId": "integer (optional, for existing variables)",
  "institutionId": "integer (optional)"
}
```

#### Request Example
```json
{
  "formula": "value / max_value * category_credit_weight",
  "responseType": "int_float",
  "variableId": 1,
  "institutionId": 1
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Formula validation completed successfully",
  "data": {
    "isValid": true,
    "extractedVariables": ["value", "max_value", "category_credit_weight"],
    "testResult": 0.75,
    "contextValidation": true
  },
  "status": 200
}
```

**Error Responses**

*400 Bad Request - Invalid Formula*
```json
{
  "success": false,
  "message": "Invalid formula: Undefined variable 'invalid_var' in formula",
  "status": 400
}
```

---

### 13. Test Variable Normalization

Tests normalization of a variable with sample data.

**Endpoint:** `POST /api/variable/test-variable-normalization`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### Request Body
```json
{
  "variableId": "integer (required)",
  "testValue": "number (required)",
  "institutionId": "integer (optional)"
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Variable normalization test completed successfully",
  "data": {
    "originalValue": 50000,
    "normalizedValue": 0.5,
    "formula": "value / max_value",
    "context": {
      "value": 50000,
      "max_value": 100000,
      "min_value": 0
    }
  },
  "status": 200
}
```

---

### 14. Normalize Client Variables

Normalizes variable values for clients using configured formulas.

**Endpoint:** `POST /api/variable/normalize`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### Request Body
```json
{
  "clientIds": "array of integers (required)",
  "variableIds": "array of integers (optional, all if not specified)",
  "institutionId": "integer (optional, inferred from auth)"
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Client variables normalized successfully",
  "data": {
    "processedClients": 5,
    "processedVariables": 10,
    "normalizationResults": [
      {
        "clientId": 1,
        "variableId": 1,
        "originalValue": 50000,
        "normalizedValue": 0.5
      }
    ]
  },
  "status": 200
}
```

---

### 15. Get Client Weighted Scores

Retrieves weighted scores for a specific client across all variables.

**Endpoint:** `GET /api/variable/client-weighted-scores/{clientId}`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `clientId` (integer, required): The ID of the client

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Client weighted scores retrieved successfully",
  "data": {
    "clientId": 1,
    "totalWeightedScore": 0.75,
    "categoryScores": [
      {
        "categoryId": 1,
        "categoryName": "Financial Information",
        "weightedScore": 0.8,
        "variables": [
          {
            "variableId": 1,
            "variableName": "Monthly Income",
            "normalizedValue": 0.5,
            "proportion": 30,
            "weightedValue": 0.15
          }
        ]
      }
    ]
  },
  "status": 200
}
```

---

### 16. Trigger Variable Re-Normalization

Triggers re-normalization of all client data for a specific variable.

**Endpoint:** `POST /api/variable/trigger-re-normalization/{variableId}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `variableId` (integer, required): The ID of the variable to re-normalize

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Variable re-normalization triggered successfully",
  "data": {
    "variableId": 1,
    "affectedClients": 150,
    "reNormalizationBatchId": "batch_uuid_456"
  },
  "status": 200
}
```

---

### 17. Redistribute Category Proportions

Redistributes proportions among variables within a category.

**Endpoint:** `PUT /api/variable/category/{categoryId}/redistribute-proportions`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### URL Parameters
- `categoryId` (integer, required): The ID of the variable category

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

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Category proportions redistributed successfully",
  "data": {
    "categoryId": 1,
    "changesApplied": 3,
    "batchId": "batch_uuid_789",
    "totalProportion": 100,
    "updatedVariables": [
      {
        "variableId": 1,
        "oldProportion": 30,
        "newProportion": 35
      }
    ]
  },
  "status": 200
}
```

---

### 18. Get Variable Proportion History

Retrieves the proportion change history for a specific variable.

**Endpoint:** `GET /api/variable/proportion-history/variable/{variableId}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `variableId` (integer, required): The ID of the variable

#### Query Parameters
- `page` (integer, optional, default: 1): Page number for pagination
- `limit` (integer, optional, default: 10): Number of items per page

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Variable proportion history retrieved successfully",
  "data": [
    {
      "id": 1,
      "variableId": 1,
      "oldProportion": 30,
      "newProportion": 35,
      "changedBy": "admin_user_1",
      "reason": "Rebalancing after new variable addition",
      "batchId": "batch_uuid_789",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "status": 200
}
```

---

### 19. Get Category Proportion History

Retrieves the proportion change history for all variables in a category.

**Endpoint:** `GET /api/variable/proportion-history/category/{categoryId}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `categoryId` (integer, required): The ID of the variable category

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Category proportion history retrieved successfully",
  "data": {
    "categoryId": 1,
    "categoryName": "Financial Information",
    "history": [
      {
        "batchId": "batch_uuid_789",
        "changedBy": "admin_user_1",
        "reason": "Rebalancing after new variable addition",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "changes": [
          {
            "variableId": 1,
            "variableName": "Monthly Income",
            "oldProportion": 30,
            "newProportion": 35
          }
        ]
      }
    ]
  },
  "status": 200
}
```

---

### 20. Get Proportion Change Batches

Retrieves all proportion change batches with filtering options.

**Endpoint:** `GET /api/variable/proportion-history/batches`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`

#### Query Parameters
- `page` (integer, optional, default: 1): Page number for pagination
- `limit` (integer, optional, default: 10): Number of items per page
- `categoryId` (integer, optional): Filter by category ID
- `changedBy` (string, optional): Filter by user who made changes

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Proportion change batches retrieved successfully",
  "data": [
    {
      "batchId": "batch_uuid_789",
      "changedBy": "admin_user_1",
      "reason": "Rebalancing after new variable addition",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "changesCount": 3,
      "affectedCategories": [1, 2]
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  },
  "status": 200
}
```

---

## Variable Category Management Endpoints

The Variable Category Management endpoints allow administrators to manage variable categories that group related variables together for credit scoring purposes. Variable categories define the organizational structure for variables and specify weights for credit limit and interest rate calculations. These endpoints are primarily used for system configuration and are restricted to admin users.

### 1. Create Variable Category

Creates a new variable category that can be used to group related variables.

**Endpoint:** `POST /api/variableCategory/create`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### Request Body
```json
{
  "name": "string (required, unique)",
  "description": "string (required)",
  "creditLimitWeight": "number (required)",
  "interestRateWeight": "number (required)"
}
```

#### Request Example
```json
{
  "name": "Financial Information",
  "description": "Variables related to client's financial status and income",
  "creditLimitWeight": 0.4,
  "interestRateWeight": 0.3
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Variable category created successfully",
  "data": {
    "id": 1,
    "name": "Financial Information",
    "description": "Variables related to client's financial status and income",
    "creditLimitWeight": 0.4,
    "interestRateWeight": 0.3,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**

*400 Bad Request - Missing Required Fields*
```json
{
  "success": false,
  "message": "Variable category name, description, credit limit weight and interest rate weight are required"
}
```

*401 Unauthorized - Authentication Issues*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to create variable category",
  "error": "Error details"
}
```

---

### 2. Update Variable Category

Updates an existing variable category's information and weights.

**Endpoint:** `PUT /api/variableCategory/update/{id}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### URL Parameters
- `id` (integer, required): The ID of the variable category to update

#### Request Body
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "creditLimitWeight": "number (optional)",
  "interestRateWeight": "number (optional)"
}
```

#### Request Example
```json
{
  "name": "Updated Financial Information",
  "description": "Updated description for financial variables",
  "creditLimitWeight": 0.45,
  "interestRateWeight": 0.35
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Variable category updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Financial Information",
    "description": "Updated description for financial variables",
    "creditLimitWeight": 0.45,
    "interestRateWeight": 0.35,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

**Error Responses**

*400 Bad Request - No Fields Provided*
```json
{
  "success": false,
  "message": "At least one of the following fields is required: name, description, credit limit weight, interest rate weight"
}
```

*401 Unauthorized - Category Not Found*
```json
{
  "success": false,
  "message": "Invalid variable category"
}
```

*401 Unauthorized - Authentication Issues*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to update variable category",
  "error": "Error details"
}
```

---

### 3. Get All Variable Categories

Retrieves a list of all variable categories in the system.

**Endpoint:** `GET /api/variableCategory/all`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### Request
No request body required.

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Variable categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Financial Information",
      "description": "Variables related to client's financial status and income",
      "creditLimitWeight": 0.4,
      "interestRateWeight": 0.3,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Personal Information",
      "description": "Variables related to client's personal details and demographics",
      "creditLimitWeight": 0.2,
      "interestRateWeight": 0.25,
      "createdAt": "2024-01-16T09:15:00.000Z",
      "updatedAt": "2024-01-16T09:15:00.000Z"
    },
    {
      "id": 3,
      "name": "Credit History",
      "description": "Variables related to client's credit and payment history",
      "creditLimitWeight": 0.4,
      "interestRateWeight": 0.45,
      "createdAt": "2024-01-17T14:20:00.000Z",
      "updatedAt": "2024-01-17T14:20:00.000Z"
    }
  ],
  "count": 3
}
```

**Error Responses**

*401 Unauthorized - No Token*
```json
{
  "success": false,
  "message": "Unauthorized: No authorization header provided"
}
```

*401 Unauthorized - Invalid Token*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token",
  "error": "Error details"
}
```

*403 Forbidden - Inactive Account*
```json
{
  "success": false,
  "message": "Your account has been deactivated. Please contact support."
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to retrieve variable categories",
  "error": "Error details"
}
```

---

### 4. Get Variable Category by ID

Retrieves detailed information about a specific variable category.

**Endpoint:** `GET /api/variableCategory/{id}`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `id` (integer, required): The ID of the variable category to retrieve

#### Request
No request body required.

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Variable category retrieved successfully",
  "data": {
    "id": 1,
    "name": "Financial Information",
    "description": "Variables related to client's financial status and income",
    "creditLimitWeight": 0.4,
    "interestRateWeight": 0.3,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**

*401 Unauthorized - Category Not Found*
```json
{
  "success": false,
  "message": "Variable category with id 1 not found"
}
```

*401 Unauthorized - No Token*
```json
{
  "success": false,
  "message": "Unauthorized: No authorization header provided"
}
```

*401 Unauthorized - Invalid Token*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token",
  "error": "Error details"
}
```

*403 Forbidden - Inactive Account*
```json
{
  "success": false,
  "message": "Your account has been deactivated. Please contact support."
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to retrieve variable category",
  "error": "Error details"
}
```

---

### 5. Delete Variable Category

Permanently deletes a variable category from the system. Note that this operation will fail if there are variables associated with this category.

**Endpoint:** `DELETE /api/variableCategory/delete/{id}`  
**Authentication:** Admin Required  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `id` (integer, required): The ID of the variable category to delete

#### Request
No request body required.

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Variable category deleted successfully"
}
```

**Error Responses**

*404 Not Found - Category Not Found*
```json
{
  "success": false,
  "message": "Variable category with id 1 not found"
}
```

*401 Unauthorized - Authentication Issues*
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token"
}
```

*403 Forbidden - Not Admin*
```json
{
  "success": false,
  "message": "Admin access required"
}
```

*500 Internal Server Error - Foreign Key Constraint*
```json
{
  "success": false,
  "message": "Failed to delete variable category",
  "error": "Cannot delete category with associated variables"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Failed to delete variable category",
  "error": "Error details"
}
```

---

## Credit Scoring Endpoints

The Credit Scoring endpoints provide functionality for calculating credit scores and risk assessments for clients based on their variable data and the configured scoring algorithms.

### 1. Calculate Client Result

Calculates the credit scoring result for a single client.

**Endpoint:** `POST /api/variable/calculate/{clientId}`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### URL Parameters
- `clientId` (integer, required): The ID of the client

#### Request Body
```json
{
  "uploadBatchId": "integer (optional)",
  "institutionId": "integer (optional, inferred from auth)"
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Credit scoring result calculated successfully",
  "data": {
    "clientId": 1,
    "creditScore": 0.75,
    "riskLevel": "Medium",
    "recommendedCreditLimit": 50000,
    "recommendedInterestRate": 12.5,
    "categoryBreakdown": [
      {
        "categoryId": 1,
        "categoryName": "Financial Information",
        "score": 0.8,
        "weight": 0.4,
        "contribution": 0.32
      }
    ],
    "calculationDate": "2024-01-15T10:30:00.000Z",
    "uploadBatchId": 123
  },
  "status": 200
}
```

**Error Responses**

*400 Bad Request - Missing Client ID*
```json
{
  "success": false,
  "message": "Valid client ID is required",
  "status": 400
}
```

*404 Not Found - Client Not Found*
```json
{
  "success": false,
  "message": "Client not found or has no variable data",
  "status": 404
}
```

---

### 2. Calculate Batch Results

Calculates credit scoring results for multiple clients in a single request.

**Endpoint:** `POST /api/variable/calculate-batch`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `application/json`

#### Request Body
```json
{
  "clientIds": "array of integers (required)",
  "uploadBatchId": "integer (optional)",
  "institutionId": "integer (optional, inferred from auth)"
}
```

#### Request Example
```json
{
  "clientIds": [1, 2, 3, 4, 5],
  "uploadBatchId": 123
}
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Batch credit scoring results calculated successfully",
  "data": {
    "processedClients": 5,
    "successfulCalculations": 4,
    "failedCalculations": 1,
    "results": [
      {
        "clientId": 1,
        "success": true,
        "creditScore": 0.75,
        "riskLevel": "Medium",
        "recommendedCreditLimit": 50000,
        "recommendedInterestRate": 12.5
      },
      {
        "clientId": 2,
        "success": false,
        "error": "Insufficient variable data"
      }
    ],
    "batchId": "batch_calc_uuid_456",
    "calculationDate": "2024-01-15T10:30:00.000Z"
  },
  "status": 200
}
```

**Error Responses**

*400 Bad Request - Invalid Client IDs*
```json
{
  "success": false,
  "message": "Array of client IDs is required",
  "status": 400
}
```

---

### 3. Get Client Result

Retrieves previously calculated credit scoring results for a client.

**Endpoint:** `GET /api/variable/client-result/{clientId}`  
**Authentication:** Protected (Admin or Institution)  
**Headers:** `Authorization: Bearer <token>`

#### URL Parameters
- `clientId` (integer, required): The ID of the client

#### Query Parameters
- `uploadBatchId` (integer, optional): Filter by specific upload batch

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Client result retrieved successfully",
  "data": {
    "clientId": 1,
    "creditScore": 0.75,
    "riskLevel": "Medium",
    "recommendedCreditLimit": 50000,
    "recommendedInterestRate": 12.5,
    "categoryBreakdown": [
      {
        "categoryId": 1,
        "categoryName": "Financial Information",
        "score": 0.8,
        "weight": 0.4,
        "contribution": 0.32
      }
    ],
    "calculationDate": "2024-01-15T10:30:00.000Z",
    "uploadBatchId": 123,
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  },
  "status": 200
}
```

**Error Responses**

*404 Not Found - No Results*
```json
{
  "success": false,
  "message": "No credit scoring results found for this client",
  "status": 404
}
```

---

## Data Models

### Admin Model
```json
{
  "id": "integer (auto-increment, primary key)",
  "name": "string (required, unique)",
  "email": "string (required, unique)",
  "password": "string (required, hashed)",
  "is_active": "boolean (required, default: true)",
  "createdAt": "datetime (auto-generated)",
  "updatedAt": "datetime (auto-updated)"
}
```

### Institution Model
```json
{
  "id": "integer (auto-increment, primary key)",
  "name": "string (required, unique)",
  "email": "string (required, unique)",
  "password": "string (required, hashed)",
  "is_active": "boolean (required, default: true)",
  "createdAt": "datetime (auto-generated)",
  "updatedAt": "datetime (auto-updated)"
}
```

### Parameter Model
```json
{
  "id": "integer (auto-increment, primary key)",
  "name": "string (required, unique)",
  "uniqueCode": "integer (required)",
  "description": "text (required)",
  "is_active": "boolean (required, default: true)",
  "is_required": "boolean (required)",
  "createdAt": "datetime (auto-generated)",
  "updatedAt": "datetime (auto-updated)"
}
```

### InstitutionParameter Model
```json
{
  "id": "integer (auto-increment, primary key)",
  "institutionId": "integer (required, foreign key to Institution)",
  "parameterId": "integer (required, foreign key to Parameter)",
  "value": "float (required)",
  "createdAt": "datetime (auto-generated)",
  "updatedAt": "datetime (auto-updated)"
}
```

### Variable Model
```json
{
  "id": "integer (auto-increment, primary key)",
  "name": "string (required, unique)",
  "description": "text (required)",
  "uniqueCode": "integer (required, unique)",
  "is_required": "boolean (required, default: true)",
  "mask": "boolean (required, default: false)",
  "isUsedInFormula": "boolean (required, default: false)",
  "min_value": "float (required)",
  "max_value": "float (required)",
  "responseType": "enum ('int_float', 'boolean', 'categorical')",
  "normalisationFormula": "text (optional, for int_float types)",
  "variableCategoryId": "integer (required, foreign key to VariableCategory)",
  "variableProportion": "float (required, 0-100)",
  "createdAt": "datetime (auto-generated)",
  "updatedAt": "datetime (auto-updated)"
}
```

### VariableCategory Model
```json
{
  "id": "integer (auto-increment, primary key)",
  "name": "string (required, unique)",
  "description": "text (required)",
  "creditLimitWeight": "float (required)",
  "interestRateWeight": "float (required)",
  "createdAt": "datetime (auto-generated)",
  "updatedAt": "datetime (auto-updated)"
}
```

### CategoryResponseMapping Model
```json
{
  "id": "integer (auto-increment, primary key)",
  "variableId": "integer (required, foreign key to Variable)",
  "categoryName": "string (required)",
  "numericValue": "float (required, 0-1)",
  "createdAt": "datetime (auto-generated)",
  "updatedAt": "datetime (auto-updated)"
}
```

#### Variable Response Types
- **int_float**: Numeric values that require normalization formulas
- **boolean**: True/false values (automatically normalized to 1/0)
- **categorical**: Text categories mapped to numeric values (0-1 range)

#### Variable Properties
- **mask**: If true, variable is hidden from institution users
- **isUsedInFormula**: If true, variable can be referenced in other variables' formulas
- **variableProportion**: Percentage weight within its category (must sum to 100% per category)

---

## Authentication Details

### JWT Token Structure
The JWT token contains the following payload:
```json
{
  "id": "integer (user ID)",
  "is_admin": "boolean",
  "name": "string (user name)",
  "email": "string (user email)",
  "is_active": "boolean (user active status)",
  "role": "string ('admin' or 'institution')",
  "iat": "integer (issued at timestamp)",
  "exp": "integer (expiration timestamp)"
}
```

### Common Authentication Errors

**Missing Authorization Header**
```json
{
  "success": false,
  "message": "Unauthorized: No authorization header provided"
}
```

**Invalid Token Format**
```json
{
  "success": false,
  "message": "Authorization failed: No token provided"
}
```

**Expired Token**
```json
{
  "success": false,
  "message": "Authorization failed: Token expired",
  "error": "jwt expired"
}
```

**Invalid Token**
```json
{
  "success": false,
  "message": "Authorization failed: Invalid token",
  "error": "invalid signature"
}
```

**Inactive User Account**
```json
{
  "success": false,
  "message": "Your admin account has been deactivated. Please contact support."
}
```

**Inactive Institution Account**
```json
{
  "success": false,
  "message": "Your institution account has been deactivated. Please contact support."
}
```

---

## Error Handling

All API responses follow a consistent structure:

### Success Response Structure
```json
{
  "success": true,
  "message": "Descriptive success message",
  "data": {} // Optional data object
}
```

### Error Response Structure
```json
{
  "success": false,
  "message": "Descriptive error message",
  "error": "Technical error details" // Optional
}
```

### HTTP Status Codes Used
- `200 OK`: Successful GET, PUT, PATCH, DELETE operations
- `201 Created`: Successful POST operations (resource creation)
- `400 Bad Request`: Invalid request data or missing required fields
- `401 Unauthorized`: Authentication required or invalid credentials
- `403 Forbidden`: Insufficient permissions or inactive account
- `404 Not Found`: Requested resource not found
- `500 Internal Server Error`: Server-side errors

---

## Rate Limiting and Security

- All endpoints implement transaction-based database operations for data consistency
- Passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens have configurable expiration times
- Admin accounts cannot deactivate themselves for security
- Institution parameters have unique constraints (institutionId + parameterId)
- All database queries use parameterized statements to prevent SQL injection
- Parameter values are validated as numeric types
- Foreign key constraints ensure data integrity

### Variable Management Security

- **Role-Based Data Filtering**: Institution users cannot see sensitive variable fields (`mask`, `isUsedInFormula`)
- **Formula Validation**: Normalization formulas are validated for syntax and context before execution
- **Proportion Constraints**: Variable proportions within categories are validated to ensure they sum to 100%
- **Unique Code Enforcement**: Variable unique codes are enforced at database level to prevent conflicts
- **Category Mapping Validation**: Categorical variables require valid numeric mappings (0-1 range)
- **Transaction Safety**: All variable operations use database transactions for atomicity

### Credit Scoring Security

- **Institution Isolation**: Users can only calculate scores for their own institution's clients
- **Data Validation**: Client IDs and batch IDs are validated before processing
- **Formula Execution Safety**: Normalization formulas are executed in controlled contexts
- **Audit Trail**: All proportion changes and score calculations are logged with timestamps and user attribution
- **Batch Processing Limits**: Batch operations have reasonable size limits to prevent system overload

### Additional Security Measures

- **Input Sanitization**: All user inputs are sanitized and validated
- **SQL Injection Prevention**: Parameterized queries used throughout
- **Authorization Checks**: Every endpoint verifies user permissions before execution
- **Error Information Limiting**: Error messages don't expose sensitive system information
- **Rate Limiting**: API endpoints have built-in rate limiting to prevent abuse

---

## Testing the API

### Using cURL

**Create Institution:**
```bash
curl -X POST http://localhost:3000/api/institution/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Test University","email":"test@university.edu","password":"password123"}'
```

**Login Institution:**
```bash
curl -X POST http://localhost:3000/api/institution/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@university.edu","password":"password123"}'
```

**Set Institution Parameters:**
```bash
curl -X POST http://localhost:3000/api/institution/setParameters/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"parameters":[{"parameterId":1,"value":3.5},{"parameterId":2,"value":50000}]}'
```

**Get Institution Parameters:**
```bash
curl -X GET http://localhost:3000/api/institution/getParameters/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Update Parameter Value:**
```bash
curl -X PUT http://localhost:3000/api/institution/updateParameterValue/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"value":4.0}'
```

**Create Parameter (Admin only):**
```bash
curl -X POST http://localhost:3000/api/parameter/create \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Default Interest Rate","description":"The default interest rate applied to new loan applications","uniqueCode":1006,"isRequired":true,"isActive":true}'
```

**Get All Parameters:**
```bash
curl -X GET http://localhost:3000/api/parameter/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get Parameter by ID:**
```bash
curl -X GET http://localhost:3000/api/parameter/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Update Parameter (Admin only):**
```bash
curl -X PUT http://localhost:3000/api/parameter/update/1 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Interest Rate","description":"Updated description for the interest rate parameter","isRequired":false,"isActive":true}'
```

**Delete Parameter (Admin only):**
```bash
curl -X DELETE http://localhost:3000/api/parameter/delete/1 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

**Create Variable (Admin only):**
```bash
curl -X POST http://localhost:3000/api/variable/create \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monthly Income",
    "description": "Client monthly income in local currency",
    "uniqueCode": 2001,
    "is_required": true,
    "mask": false,
    "isUsedInFormula": true,
    "min_value": 0,
    "max_value": 1000000,
    "responseType": "int_float",
    "normalisationFormula": "value / max_value",
    "variableCategoryId": 1,
    "variableProportion": 30.0
  }'
```

**Create Categorical Variable (Admin only):**
```bash
curl -X POST http://localhost:3000/api/variable/create \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Employment Status",
    "description": "Client employment status",
    "uniqueCode": 2002,
    "is_required": true,
    "mask": false,
    "isUsedInFormula": false,
    "min_value": 0,
    "max_value": 1,
    "responseType": "categorical",
    "variableCategoryId": 2,
    "variableProportion": 25.0,
    "categoryMappings": [
      {"categoryName": "Employed Full-time", "numericValue": 1.0},
      {"categoryName": "Employed Part-time", "numericValue": 0.7},
      {"categoryName": "Self-employed", "numericValue": 0.8},
      {"categoryName": "Unemployed", "numericValue": 0.0}
    ]
  }'
```

**Update Variable (Admin only):**
```bash
curl -X PUT http://localhost:3000/api/variable/update/1 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Monthly Income",
    "description": "Updated description",
    "is_required": true,
    "mask": false,
    "isUsedInFormula": true,
    "min_value": 0,
    "max_value": 2000000,
    "responseType": "int_float",
    "normalisationFormula": "value / max_value * 0.8",
    "variableCategoryId": 1,
    "variableProportion": 35.0
  }'
```

**Get All Variables:**
```bash
curl -X GET "http://localhost:3000/api/variable/all?page=1&limit=10&includeAssociations=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get Variable by ID:**
```bash
curl -X GET http://localhost:3000/api/variable/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get Variables by Category:**
```bash
curl -X GET http://localhost:3000/api/variable/category/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get Variables by Response Type:**
```bash
curl -X GET http://localhost:3000/api/variable/response-type/int_float \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Search Variables:**
```bash
curl -X GET "http://localhost:3000/api/variable/search?query=income&categoryId=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Validate Normalization Formula (Admin only):**
```bash
curl -X POST http://localhost:3000/api/variable/validate-normalization-formula \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "formula": "value / max_value * category_credit_weight",
    "responseType": "int_float",
    "variableId": 1,
    "institutionId": 1
  }'
```

**Test Variable Normalization (Admin only):**
```bash
curl -X POST http://localhost:3000/api/variable/test-variable-normalization \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variableId": 1,
    "testValue": 50000,
    "institutionId": 1
  }'
```

**Normalize Client Variables:**
```bash
curl -X POST http://localhost:3000/api/variable/normalize \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientIds": [1, 2, 3],
    "variableIds": [1, 2, 3],
    "institutionId": 1
  }'
```

**Get Client Weighted Scores:**
```bash
curl -X GET http://localhost:3000/api/variable/client-weighted-scores/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Redistribute Category Proportions (Admin only):**
```bash
curl -X PUT http://localhost:3000/api/variable/category/1/redistribute-proportions \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variableProportions": [
      {"variableId": 1, "proportion": 35.0},
      {"variableId": 2, "proportion": 30.0},
      {"variableId": 3, "proportion": 35.0}
    ],
    "reason": "Rebalancing after system update"
  }'
```

**Get Variable Proportion History (Admin only):**
```bash
curl -X GET "http://localhost:3000/api/variable/proportion-history/variable/1?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

**Calculate Client Credit Score:**
```bash
curl -X POST http://localhost:3000/api/variable/calculate/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "uploadBatchId": 123,
    "institutionId": 1
  }'
```

**Calculate Batch Credit Scores:**
```bash
curl -X POST http://localhost:3000/api/variable/calculate-batch \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientIds": [1, 2, 3, 4, 5],
    "uploadBatchId": 123,
    "institutionId": 1
  }'
```

**Get Client Credit Score Result:**
```bash
curl -X GET "http://localhost:3000/api/variable/client-result/1?uploadBatchId=123" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Delete Variable (Admin only):**
```bash
curl -X DELETE http://localhost:3000/api/variable/delete/1 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

**Create Variable Category (Admin only):**
```bash
curl -X POST http://localhost:3000/api/variableCategory/create \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Financial Information",
    "description": "Variables related to client financial status and income",
    "creditLimitWeight": 0.4,
    "interestRateWeight": 0.3
  }'
```

**Update Variable Category (Admin only):**
```bash
curl -X PUT http://localhost:3000/api/variableCategory/update/1 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Financial Information",
    "description": "Updated description for financial variables",
    "creditLimitWeight": 0.45,
    "interestRateWeight": 0.35
  }'
```

**Get All Variable Categories:**
```bash
curl -X GET http://localhost:3000/api/variableCategory/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get Variable Category by ID:**
```bash
curl -X GET http://localhost:3000/api/variableCategory/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Delete Variable Category (Admin only):**
```bash
curl -X DELETE http://localhost:3000/api/variableCategory/delete/1 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Using Postman

1. Set the base URL to `http://localhost:3000/api`
2. For authenticated endpoints, add Authorization header with value `Bearer <your-token>`
3. Set Content-Type to `application/json` for POST/PUT/PATCH requests
4. Use the request body examples provided above
5. For institution endpoints, ensure you're using an institution token (not admin token) where specified
6. For parameter management endpoints, ensure you're using an admin token as these require admin privileges

#### Variable Management Testing with Postman

**Variable Creation Collection:**
1. Create a new collection called "Variable Management"
2. Add requests for each variable endpoint with proper authentication
3. Use environment variables for `{{baseUrl}}` and `{{adminToken}}`/`{{institutionToken}}`
4. Test different response types (int_float, boolean, categorical)

**Sample Environment Variables:**
```json
{
  "baseUrl": "http://localhost:3000/api",
  "adminToken": "your_admin_jwt_token_here",
  "institutionToken": "your_institution_jwt_token_here",
  "testVariableId": "1",
  "testCategoryId": "1",
  "testClientId": "1"
}
```

**Testing Workflow:**
1. **Admin Setup**: Use admin token for variable creation, updates, and deletions
2. **Institution Access**: Switch to institution token to test filtered data access
3. **Formula Validation**: Test normalization formulas with various complexity levels
4. **Proportion Management**: Test category proportion redistribution scenarios
5. **Credit Scoring**: Test individual and batch credit score calculations

**Key Test Scenarios:**
- Create variables with different response types
- Test proportion validation (ensure category totals = 100%)
- Validate normalization formulas with syntax and context errors
- Test role-based data filtering (admin vs institution views)
- Verify credit scoring calculations with sample client data
- Test batch operations for performance and error handling

**Error Testing:**
- Invalid variable proportions (exceeding 100% in category)
- Malformed normalization formulas
- Missing required fields in variable creation
- Unauthorized access attempts (institution trying admin operations)
- Invalid client IDs in credit scoring requests

#### Variable Category Management Testing with Postman

**Variable Category Collection:**
1. Create a new collection called "Variable Category Management"
2. Add requests for each variable category endpoint with proper authentication
3. Use environment variables for `{{baseUrl}}` and `{{adminToken}}`/`{{institutionToken}}`
4. Test category creation before variable creation (categories are prerequisites for variables)

**Testing Workflow:**
1. **Category Setup**: Create categories first as they are required for variables
2. **Weight Configuration**: Test different weight combinations for credit limit and interest rate
3. **Category Updates**: Test partial and full updates of category information
4. **Dependency Testing**: Verify that categories with associated variables cannot be deleted
5. **Access Control**: Verify admin-only restrictions for create, update, and delete operations

**Key Test Scenarios:**
- Create categories with different weight distributions
- Test weight validation (ensure weights are numeric and reasonable)
- Verify category name uniqueness constraints
- Test category retrieval by both admin and institution users
- Attempt to delete categories with and without associated variables
- Test category updates with partial field updates

**Error Testing:**
- Missing required fields in category creation
- Duplicate category names
- Invalid weight values (non-numeric, negative values)
- Unauthorized access attempts (institution trying admin operations)
- Deletion of categories with associated variables
- Invalid category IDs in requests

**Sample Test Data:**
```json
{
  "testCategories": [
    {
      "name": "Financial Information",
      "description": "Client financial status and income data",
      "creditLimitWeight": 0.4,
      "interestRateWeight": 0.3
    },
    {
      "name": "Personal Information", 
      "description": "Client demographics and personal details",
      "creditLimitWeight": 0.2,
      "interestRateWeight": 0.25
    },
    {
      "name": "Credit History",
      "description": "Client credit and payment history",
      "creditLimitWeight": 0.4,
      "interestRateWeight": 0.45
    }
  ]
}
```

---

*Last updated: January 2024*
*API Version: 1.0.0*

---

## CSV Upload Management Endpoints

The CSV Upload endpoints allow institutions and administrators to upload client data in CSV format, process it automatically, and manage upload batches. The system automatically normalizes variable values and calculates credit scores upon successful upload.

### Important Notes

**Authentication Requirements:**
- All CSV upload endpoints require authentication using JWT tokens
- Both administrators and institutions can access these endpoints
- Institutions can only view and manage their own upload batches
- Administrators can view and manage all upload batches

**Automatic Processing:**
- Upon successful CSV upload, the system automatically:
  1. Validates file format and structure
  2. Creates or updates client records
  3. Stores variable values for each client
  4. Performs automatic normalization of all variable values
  5. Calculates credit scores for all processed clients
  6. Generates detailed processing statistics and error reports

**File Processing:**
- Maximum file size: 10MB
- Supported formats: CSV files only
- Files are temporarily stored during processing and cleaned up afterward
- Processing is transactional - if any critical error occurs, all changes are rolled back

**Error Handling:**
- The system provides detailed error reporting for failed records
- Processing continues for valid records even if some records fail
- Batch status reflects overall processing result:
  - `processing`: Upload is currently being processed
  - `completed`: All records processed successfully
  - `completed_with_errors`: Some records failed but others succeeded
  - `failed`: Critical error prevented processing

### CSV File Format Requirements

**Required Columns:**
All CSV files must include these mandatory columns:
- `client_id` - Unique identifier for each client (string)
- `client_name` - Full name of the client (string)
- `phone_number` - Client's phone number (string, format: +237XXXXXXXXX)
- `email` - Client's email address (string, valid email format)

**Variable Columns:**
Additional columns should match the variable names defined in your system. Each variable has specific requirements:

- **Numeric Variables (`int_float`)**: Must be numbers within the defined min/max range
- **Boolean Variables**: Accept `true/false`, `1/0`, `yes/no` (case insensitive)
- **Categorical Variables**: Must match one of the predefined category names exactly

**Example CSV Structure:**
```csv
client_id,client_name,phone_number,email,monthly_income,age,employment_status,has_collateral
CLIENT001,John Doe,+237677123456,john@example.com,500000,35,Employed,true
CLIENT002,Jane Smith,+237677654321,jane@example.com,750000,28,Self-employed,false
CLIENT003,Bob Johnson,+237677789012,bob@example.com,300000,45,Employed,true
```

**Best Practices:**
- Use UTF-8 encoding for the CSV file
- Ensure no empty rows between data
- Use consistent formatting for phone numbers and emails
- Download the template file for the correct format and variable definitions
- Test with a small batch first to validate your data format

### 1. Upload and Process CSV File

Uploads a CSV file containing client data and processes it automatically. The system validates the file format, processes each row, creates or updates client records, stores variable values, performs automatic normalization, and calculates credit scores.

**Endpoint:** `POST /api/csv/upload`  
**Authentication:** Protected (Admin or Institution)  
**Content-Type:** `multipart/form-data`

#### File Requirements
- **File Type:** CSV files only (`.csv` extension)
- **File Size:** Maximum 10MB
- **MIME Types:** `text/csv` or `application/vnd.ms-excel`

#### Required CSV Headers
The CSV file must contain the following required columns:
- `client_id` - Unique identifier for the client
- `client_name` - Full name of the client
- `phone_number` - Client's phone number
- `email` - Client's email address
- Additional columns for each variable defined in the system

#### Request Parameters (Form Data)
```
csvFile: file (required) - The CSV file to upload
batchName: string (required) - Name for the upload batch
batchDescription: string (optional) - Description for the upload batch
institutionId: integer (optional) - Institution ID (auto-detected from auth token)
```

#### Request Example (cURL)
```bash
curl -X POST http://localhost:3000/api/csv/upload \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "csvFile=@/path/to/your/file.csv" \
  -F "batchName=Monthly Client Data Upload" \
  -F "batchDescription=Client data for January 2024"
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "CSV processed successfully",
  "data": {
    "uploadBatchId": 123,
    "fileInfo": {
      "originalName": "clients_data.csv",
      "size": 2048576,
      "mimetype": "text/csv"
    },
    "validation": {
      "warnings": [
        "Column 'optional_field' not recognized but will be ignored"
      ]
    },
    "processing": {
      "totalRecords": 150,
      "successfulRecords": 148,
      "failedRecords": 2,
      "statistics": {
        "newClients": 45,
        "updatedClients": 103,
        "variablesProcessed": 1480
      }
    },
    "errors": [
      {
        "row": 15,
        "client_id": "CLIENT_015",
        "error": "Invalid email format",
        "data": {
          "client_id": "CLIENT_015",
          "email": "invalid-email"
        }
      }
    ],
    "normalization": {
      "success": true,
      "totalVariablesNormalized": 1480,
      "clientsProcessed": 148,
      "errors": []
    },
    "creditScoring": {
      "success": true,
      "clientsProcessed": 148,
      "resultsGenerated": 148,
      "errors": []
    }
  }
}
```

**Error Responses**

*400 Bad Request - Invalid File*
```json
{
  "success": false,
  "message": "Invalid file",
  "errors": [
    "File type not supported. Only CSV files are allowed.",
    "File size exceeds 10MB limit."
  ]
}
```

*400 Bad Request - CSV Validation Failed*
```json
{
  "success": false,
  "message": "CSV validation failed",
  "errors": [
    "Missing required column: client_id",
    "Missing required column: client_name"
  ],
  "warnings": [
    "Column 'extra_field' will be ignored"
  ]
}
```

*400 Bad Request - Missing Institution ID*
```json
{
  "success": false,
  "message": "Institution ID is required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Error processing CSV file",
  "error": "Database connection failed"
}
```

---

### 2. Get Upload Batches

Retrieves a paginated list of upload batches. Institutions can only see their own batches, while administrators can see all batches.

**Endpoint:** `GET /api/csv/batches`  
**Authentication:** Protected (Admin or Institution)  
**Content-Type:** `application/json`

#### Query Parameters
```
page: number (optional, default: 1) - Page number for pagination
limit: number (optional, default: 10) - Number of items per page
status: string (optional) - Filter by batch status
  Possible values: 'processing', 'completed', 'failed', 'completed_with_errors'
```

#### Request Example
```bash
curl -X GET "http://localhost:3000/api/csv/batches?page=1&limit=20&status=completed" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "data": {
    "uploads": [
      {
        "id": 123,
        "filename": "clients_data.csv",
        "status": "completed",
        "total_records": 150,
        "processed_records": 148,
        "failed_records": 2,
        "createdAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": 122,
        "filename": "weekly_update.csv",
        "status": "completed_with_errors",
        "total_records": 75,
        "processed_records": 70,
        "failed_records": 5,
        "createdAt": "2024-01-10T14:20:00.000Z"
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

**Error Responses**

*401 Unauthorized*
```json
{
  "success": false,
  "message": "Authentication required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Error fetching upload batches",
  "error": "Database query failed"
}
```

---

### 3. Get Upload Batch Details

Retrieves detailed information about a specific upload batch, including processed clients and their status.

**Endpoint:** `GET /api/csv/batch/{id}`  
**Authentication:** Protected (Admin or Institution)  
**Content-Type:** `application/json`

#### Path Parameters
```
id: integer (required) - Upload batch ID
```

#### Request Example
```bash
curl -X GET http://localhost:3000/api/csv/batch/123 \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "filename": "clients_data.csv",
    "status": "completed_with_errors",
    "total_records": 150,
    "processed_records": 148,
    "failed_records": 2,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "clients": [
      {
        "id": 1001,
        "reference_number": "CLIENT_001",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+237677123456",
        "status": "completed",
        "processed_at": "2024-01-15T10:32:00.000Z"
      },
      {
        "id": 1002,
        "reference_number": "CLIENT_002",
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "phoneNumber": "+237677654321",
        "status": "failed",
        "processed_at": "2024-01-15T10:33:00.000Z"
      }
    ],
    "errors": [
      {
        "row": 15,
        "client_id": "CLIENT_015",
        "error": "Invalid email format",
        "data": {
          "client_id": "CLIENT_015",
          "email": "invalid-email"
        }
      }
    ]
  }
}
```

**Error Responses**

*404 Not Found*
```json
{
  "success": false,
  "message": "Upload batch not found"
}
```

*403 Forbidden (Institution accessing another institution's batch)*
```json
{
  "success": false,
  "message": "Access denied to this upload batch"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Error fetching upload details",
  "error": "Database query failed"
}
```

---

### 4. Get Upload Batch Errors

Retrieves detailed error information for a specific upload batch, useful for debugging failed records.

**Endpoint:** `GET /api/csv/batch/{id}/errors`  
**Authentication:** Protected (Admin or Institution)  
**Content-Type:** `application/json`

#### Path Parameters
```
id: integer (required) - Upload batch ID
```

#### Request Example
```bash
curl -X GET http://localhost:3000/api/csv/batch/123/errors \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "data": {
    "uploadBatchId": 123,
    "totalErrors": 5,
    "errors": [
      {
        "row": 15,
        "client_id": "CLIENT_015",
        "error": "Invalid email format",
        "data": {
          "client_id": "CLIENT_015",
          "client_name": "Invalid Client",
          "email": "invalid-email",
          "phone_number": "+237677123456"
        }
      },
      {
        "row": 23,
        "client_id": "CLIENT_023",
        "error": "Missing required variable: monthly_income",
        "data": {
          "client_id": "CLIENT_023",
          "client_name": "Another Client",
          "email": "client@example.com",
          "phone_number": "+237677654321"
        }
      },
      {
        "row": 45,
        "client_id": "CLIENT_045",
        "error": "Variable value out of range: age must be between 18 and 100",
        "data": {
          "client_id": "CLIENT_045",
          "client_name": "Young Client",
          "age": 15
        }
      }
    ]
  }
}
```

**Error Responses**

*404 Not Found*
```json
{
  "success": false,
  "message": "Upload batch not found"
}
```

*403 Forbidden*
```json
{
  "success": false,
  "message": "Access denied to this upload batch"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Error fetching batch errors",
  "error": "Database query failed"
}
```

---

### 5. Download CSV Template

Downloads a CSV template file with proper headers and sample data to help users format their CSV files correctly.

**Endpoint:** `GET /api/csv/template`  
**Authentication:** Protected (Admin or Institution)  
**Content-Type:** `text/csv`

#### Request Example
```bash
curl -X GET http://localhost:3000/api/csv/template \
  -H "Authorization: Bearer <your-jwt-token>" \
  -o client_data_template.csv
```

#### Response

**Success (200 OK)**
The response will be a CSV file with the following structure:

```csv
client_id,client_name,phone_number,email,monthly_income,age,employment_status,credit_history
Unique client identifier,Client display name,Phone number,Email address,"Monthly income (Number between 50000 and 2000000)","Age (Number between 18 and 100)","Employment status (One of: Employed, Self-employed, Unemployed)","Credit history (One of: Excellent, Good, Fair, Poor)"
CLIENT001,Sample Client Name,+237677777777,sample@client.com,500000,35,Employed,Good
```

The template includes:
1. **Header row**: Column names matching system variables
2. **Documentation row**: Descriptions and validation rules for each field
3. **Sample row**: Example data showing proper formatting

**Error Responses**

*401 Unauthorized*
```json
{
  "success": false,
  "message": "Authentication required"
}
```

*500 Internal Server Error*
```json
{
  "success": false,
  "message": "Error generating template",
  "error": "Failed to load variables"
}
```

---

## Data Models

### UploadBatch Model

Represents a CSV upload batch with processing status and statistics.

```json
{
  "id": "integer (primary key, auto-increment)",
  "institutionId": "integer (foreign key to Institution)",
  "filename": "string (original filename)",
  "file_path": "string (server file path)",
  "name": "string (batch name)",
  "description": "text (batch description)",
  "status": "enum ('processing', 'completed', 'failed', 'completed_with_errors')",
  "uploaded_by": "integer (user ID who uploaded)",
  "total_records": "integer (total rows in CSV)",
  "processed_records": "integer (successfully processed rows)",
  "failed_records": "integer (failed rows)",
  "error_details": "text (JSON string of errors)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Relationships:**
- `belongsTo` Institution (institutionId)
- `hasMany` UploadBatchClient (uploadBatchId)
- `belongsToMany` Client (through UploadBatchClient)
- `hasMany` ClientVariableValue (uploadBatchId)

### UploadBatchClient Model

Junction table linking upload batches to processed clients.

```json
{
  "id": "integer (primary key, auto-increment)",
  "uploadBatchId": "integer (foreign key to UploadBatch)",
  "clientId": "integer (foreign key to Client)",
  "status": "enum ('pending', 'processing', 'completed', 'failed')",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Relationships:**
- `belongsTo` UploadBatch (uploadBatchId)
- `belongsTo` Client (clientId)

### Client Model

Represents individual clients in the system.

```json
{
  "id": "integer (primary key, auto-increment)",
  "reference_number": "string (unique client identifier)",
  "name": "string (client full name)",
  "phoneNumber": "string (client phone)",
  "email": "string (client email)",
  "institutionId": "integer (foreign key to Institution)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Relationships:**
- `belongsTo` Institution (institutionId)
- `hasMany` ClientVariableValue (clientId)
- `hasMany` ClientResult (clientId)
- `hasMany` UploadBatchClient (clientId)
- `belongsToMany` UploadBatch (through UploadBatchClient)

### ClientVariableValue Model

Stores variable values for each client with normalization data.

```json
{
  "id": "integer (primary key, auto-increment)",
  "clientId": "integer (foreign key to Client)",
  "variableId": "integer (foreign key to Variable)",
  "valueIntFloat": "float (numeric values)",
  "valueCategorical": "integer (foreign key to CategoryResponseMapping)",
  "valueBoolean": "boolean (true/false values)",
  "normalised_value": "float (0-1, normalized value)",
  "normalised_credit_limit_weight": "float (0-1, credit limit weight)",
  "normalised_interest_rate_weight": "float (0-1, interest rate weight)",
  "uploadBatchId": "integer (foreign key to UploadBatch)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Relationships:**
- `belongsTo` Client (clientId)
- `belongsTo` Variable (variableId)
- `belongsTo` UploadBatch (uploadBatchId)
- `belongsTo` CategoryResponseMapping (valueCategorical)

### ClientResult Model

Stores calculated credit scoring results for clients.

```json
{
  "id": "integer (primary key, auto-increment)",
  "clientId": "integer (foreign key to Client)",
  "credit_limit": "float (calculated credit limit)",
  "interest_rate": "float (calculated interest rate)",
  "sum_normalised_credit_limit_weights": "float (sum of credit limit weights)",
  "sum_normalised_interest_rate_weights": "float (sum of interest rate weights)",
  "uploadBatchId": "integer (foreign key to UploadBatch)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Relationships:**
- `belongsTo` Client (clientId)
- `belongsTo` UploadBatch (uploadBatchId)
