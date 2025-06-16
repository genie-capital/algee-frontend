# Credit Scoring System Overview

This system serves as a credit scoring platform that enables financial institutions to calculate appropriate credit limits (monetary) and interest rates that their clients can handle comfortably.

## Data Processing
Institutions provide client data through batch uploads where each row represents a specific client record and columns represent the different required variables. A client can appear in multiple upload batches, allowing the system to maintain historical records of different results for each client that can be referenced later.

## Institution Parameters
Institutions configure parameters that include:
- Minimum and maximum credit limits
- Minimum and maximum interest rates they are willing to offer
- Income multiple (factor for multiplying clients' income when computing credit limit)
- Additional parameters to be configured as needed

These institution parameters are stored in a separate database table and are identified with uniqueCode which never changes for each parameter.

## Variable System Architecture

### Categories and Weights
The system utilizes numerous variables (Signals) to perform calculations. Variables are organized into categories, where each category maintains two distinct weights:
- **Credit limit weight**: Used for credit limit calculations and operations
- **Interest rate weight**: Used for interest rate calculations and operations

Each variable belongs to exactly one category, while a category can contain multiple variables.
Each variable has a uniqueCode which is constant enabling them to be easily referenced

### Masked Variables
Some variables are marked with a mask boolean flag, indicating they are data placeholders that will not be considered during computations. These masked variables serve as decoys to prevent reverse-engineering of the system, as they are completely ignored during actual calculations.

### Variable Proportions
Every variable within a category has a proportion percentage that determines how much of their parent category's weight (both interest rate and credit limit weights) they represent. The proportion percentages of all variables within a category must sum to 100%.

### Variable Configuration
Each variable has defined minimum and maximum values and can accept different response types:

**Integer/Float Responses**: Numeric values that require normalisation formulas

**Boolean Responses**: True/False values (where true=1, false=0)

**Categorical Responses**: Categories mapped to specific numeric values. For example:
- Variable: Legal structure of employer
- Categories: Public Company, Private Company, SME, Startup, Informal, Unemployed
- Mapping formula: `=IFS(L7="Public Company", 1, L7="Private Company", 0.75, L7="SME", 0.5, L7="Startup", 0.25, L7="Unemployed", 0)`

## Administrative Flexibility
The system allows administrators to:
- Add new variables and specify their response types
- For categorical variables: define different categories and their corresponding numeric mappings
- Build custom normalisation formulas with access to:
  - Client's institution parameters
  - Variable-related values (max, min, actual value)
  - Sum of all proportional credit limit and interest rate weights for the specific client

## Weight Calculations

### Normalised Weights
The system calculates normalised weights for each variable:

**Normalised Credit Limit Weight**:
```
(normalised value of variable × variable's credit limit weight) / sum of credit limit weights of all variables for that client
```

**Normalised Interest Rate Weight**:
```
(normalised value of variable × variable's interest rate weight) / sum of interest rate weights of all variables for that client
```

### Tracking Totals
The system maintains running totals of:
- Sum of normalised credit limit weights for all client variables
- Sum of normalised interest rate weights for all client variables

## Normalisation Objective
All normalisation formulas are designed to ensure response values fall within the range of 0 to 1.

## Final Calculations
The normalised values and weights are fed into fixed, hard-coded formulas to compute the client's final interest rate and credit limit.

**Client's Credit Limit Formula**:
```
(institution's minimum lendable amount) × (sum of normalised credit limit weights of client variables) × Client's Income × (institution's income multiple parameter)
```

*Note: Client's Income corresponds to the variable with uniqueCode:1 (@20250516185411-create-variable.js)*

**Client's Interest Rate Formula**:
```
(((institution's max interest rate) - (institution's min interest rate)) × (sum of normalised interest rate weights of all client variables)) / 100
```

*Note: Institution's income multiple parameter reference: @20250516185352-create-parameter.js*