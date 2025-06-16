# Normalization Formulas Guide

## Overview

This guide covers all the formula types, syntax, and available functions for creating normalization formulas in the credit scoring system. Normalization formulas are used to convert raw client variable values into normalized scores between 0 and 1.

## Table of Contents

1. [Basic Syntax](#basic-syntax)
2. [Available Variables](#available-variables)
3. [Supported Functions](#supported-functions)
4. [Formula Types & Examples](#formula-types--examples)
5. [Common Patterns](#common-patterns)
6. [Validation & Testing](#validation--testing)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Basic Syntax

### Formula Structure
```
=FUNCTION(arguments)
```

- **Always start with `=`** (equals sign)
- **Case-insensitive** function names (IF, if, If all work)
- **Use parentheses** for function arguments
- **Separate arguments** with commas
- **Use quotes** for string literals: `"text"`
- **No quotes** for numbers: `123.45`

### Examples
```excel
=value/max_value
=IF(value > max_value, 1, value/max_value)
=ROUND(value * 0.8, 2)
=MAX(0, MIN(1, (value - min_value)/(max_value - min_value)))
```

## Available Variables

### Basic Variable Context
These variables are always available for the current variable being normalized:

| Variable | Type | Description | Example Value |
|----------|------|-------------|---------------|
| `value` | Number | Raw input value from client | `50000` |
| `min_value` | Number | Variable's defined minimum | `1` |
| `max_value` | Number | Variable's defined maximum | `100000` |
| `variable_proportion` | Number | Variable's proportion in category | `30` |
| `category_credit_weight` | Number | Category's credit limit weight | `0.4` |
| `category_interest_weight` | Number | Category's interest rate weight | `0.6` |

### Institution Parameters
Access institution parameters using the `PARAM_XXX` format where XXX is the zero-padded unique code:

| Variable | Unique Code | Description |
|----------|-------------|-------------|
| `PARAM_001` | 1001 | Income Multiple |
| `PARAM_002` | 1002 | Maximum Loan Amount |
| `PARAM_003` | 1003 | Minimum Loan Amount |
| `PARAM_004` | 1004 | Maximum Interest Rate |
| `PARAM_005` | 1005 | Minimum Interest Rate |

### Other Client Variables
Reference other client variables using the `VAR_XXX` format where XXX is the zero-padded unique code:

| Variable | Unique Code | Description |
|----------|-------------|-------------|
| `VAR_2001` | 2001 | Client Income |
| `VAR_XXX` | Any | Other client variables by unique code |

## Supported Functions

### Logical Functions

#### IF
**Syntax:** `IF(condition, value_if_true, value_if_false)`
**Description:** Returns one value if condition is true, another if false
```excel
=IF(value > max_value, 1, value/max_value)
=IF(value <= 0, 0, value/max_value)
```

#### IFS
**Syntax:** `IFS(condition1, value1, condition2, value2, ..., default_value)`
**Description:** Checks multiple conditions and returns corresponding value
```excel
=IFS(value >= 90, 1, value >= 70, 0.8, value >= 50, 0.6, 0.3)
=IFS(value > max_value, 1, value < min_value, 0, value/max_value)
```

#### AND
**Syntax:** `AND(condition1, condition2, ...)`
**Description:** Returns true if all conditions are true
```excel
=IF(AND(value > min_value, value < max_value), value/max_value, 0)
```

#### OR
**Syntax:** `OR(condition1, condition2, ...)`
**Description:** Returns true if any condition is true
```excel
=IF(OR(value > 100, VAR_2001 > 50000), 1, 0.5)
```

#### NOT
**Syntax:** `NOT(condition)`
**Description:** Returns the opposite of the condition
```excel
=IF(NOT(value > max_value), value/max_value, 1)
```

### Mathematical Functions

#### Basic Math
```excel
=value + 10          # Addition
=value - min_value   # Subtraction
=value * 2           # Multiplication
=value / max_value   # Division
=value ^ 2           # Exponentiation
```

#### ROUND
**Syntax:** `ROUND(number, digits)`
**Description:** Rounds a number to specified decimal places
```excel
=ROUND(value/max_value, 3)
=ROUND(value * 0.85, 2)
```

#### MAX
**Syntax:** `MAX(number1, number2, ...)`
**Description:** Returns the largest number
```excel
=MAX(0, value/max_value)
=MAX(value, min_value)
```

#### MIN
**Syntax:** `MIN(number1, number2, ...)`
**Description:** Returns the smallest number
```excel
=MIN(1, value/max_value)
=MIN(value, max_value)
```

#### ABS
**Syntax:** `ABS(number)`
**Description:** Returns absolute value
```excel
=ABS(value - 50)
```

#### SQRT
**Syntax:** `SQRT(number)`
**Description:** Returns square root
```excel
=SQRT(value)/SQRT(max_value)
```

#### POWER
**Syntax:** `POWER(number, power)`
**Description:** Raises number to a power
```excel
=POWER(value/max_value, 2)
```

### Aggregation Functions

#### SUM
**Syntax:** `SUM(number1, number2, ...)`
**Description:** Adds all numbers together
```excel
=SUM(value, VAR_2001, 100)/SUM(max_value, 100000, 100)
```

#### AVERAGE
**Syntax:** `AVERAGE(number1, number2, ...)`
**Description:** Calculates the average of numbers
```excel
=AVERAGE(value, VAR_2001)/AVERAGE(max_value, 100000)
```

### Constants
```excel
=PI()           # 3.14159...
=E()            # 2.71828...
```

## Formula Types & Examples

### 1. Linear Normalization
**Use Case:** Proportional scaling within range
```excel
=value/max_value
=(value - min_value)/(max_value - min_value)
```

### 2. Ceiling Normalization
**Use Case:** Cap high values at maximum score
```excel
=IF(value > max_value, 1, value/max_value)
=MIN(1, value/max_value)
```

### 3. Floor Normalization
**Use Case:** Set minimum threshold
```excel
=IF(value < min_value, 0, value/max_value)
=MAX(0, (value - min_value)/max_value)
```

### 4. Bounded Normalization
**Use Case:** Ensure values stay within 0-1 range
```excel
=MAX(0, MIN(1, value/max_value))
=MAX(0, MIN(1, (value - min_value)/(max_value - min_value)))
```

### 5. Tiered Scoring
**Use Case:** Different scores for different ranges
```excel
=IFS(value >= 90, 1, value >= 70, 0.8, value >= 50, 0.6, value >= 30, 0.4, 0.2)
```

### 6. Inverse Scoring
**Use Case:** Lower values get higher scores (e.g., risk factors)
```excel
=(max_value - value)/max_value
=1 - (value/max_value)
```

### 7. Logarithmic Scaling
**Use Case:** Compress large value ranges
```excel
=LOG(value)/LOG(max_value)
=LN(value + 1)/LN(max_value + 1)
```

### 8. Square Root Scaling
**Use Case:** Reduce impact of extreme values
```excel
=SQRT(value)/SQRT(max_value)
```

### 9. Cross-Variable Formulas
**Use Case:** Normalize based on other client variables
```excel
=IF(VAR_2001 > 50000, value/max_value, value/(max_value * 2))
=value/(max_value * (1 + VAR_2001/100000))
```

### 10. Institution Parameter Integration
**Use Case:** Use institution-specific parameters
```excel
=MIN(1, value/(max_value * PARAM_001))
=IF(value > PARAM_002, 1, value/PARAM_002)
```

## Common Patterns

### Safe Division (Avoid Division by Zero)
```excel
=IF(max_value = 0, 0, value/max_value)
=IF(max_value = min_value, 1, (value - min_value)/(max_value - min_value))
```

### Percentage Conversion
```excel
=value/100                    # Convert percentage to decimal
=ROUND(value/max_value * 100, 0)/100  # Convert to percentage then back
```

### Age-Based Scoring
```excel
=IFS(value >= 65, 0.3, value >= 45, 0.7, value >= 25, 1, value >= 18, 0.8, 0.2)
```

### Income-Based Scoring
```excel
=MIN(1, value/100000)         # Cap at 100k income
=SQRT(value/max_value)        # Diminishing returns for high income
```

### Risk Factor Scoring (Inverse)
```excel
=MAX(0, 1 - value/max_value)  # Higher risk = lower score
```

### Weighted Combinations
```excel
=(value * 0.7 + VAR_2001 * 0.3)/max_value
```

## Validation & Testing

### ✅ Improved Formula Validation

**Good News!** You can now assign formulas directly during variable creation! The validation system has been enhanced to provide proper context validation even for new variables.

### Creating Variables with Formulas

You can now include the `normalisationFormula` field when creating a variable:

```json
{
  "name": "Verified Monthly Income",
  "description": "Client's Verified monthly income",
  "uniqueCode": 2001,
  "is_required": true,
  "mask": false,
  "isUsedInFormula": false,
  "min_value": 1,
  "max_value": 4,
  "responseType": "int_float",
  "normalisationFormula": "=IF(value > max_value, 1, value/max_value)",
  "variableCategoryId": 2,
  "variableProportion": 30,
  "institutionId": 1
}
```

### Validation Process

The system now performs **full context validation** during variable creation:

1. **For New Variables**: Builds temporary context with institution parameters and existing client variables
2. **For Existing Variables**: Uses the complete validation service with database context
3. **Fallback Protection**: If context validation fails, falls back to syntax validation with a warning

### Using the Standalone Validation Endpoint

For testing formulas before creating variables:

```http
POST /api/variables/validate-normalization-formula
Content-Type: application/json

{
  "formula": "=IF(value > max_value, 1, value/max_value)",
  "variableId": 1,
  "institutionId": 1
}
```

### Response Format

When creating variables with formulas, you'll receive enhanced response data:

```json
{
  "success": true,
  "message": "Variable created successfully",
  "data": {
    "variable": { /* variable data */ },
    "formulaValidation": {
      "extractedVariables": ["value", "max_value"],
      "testResult": 0.5
    }
  }
}
```

### Common Validation Scenarios

#### ✅ Success Cases
- `=IF(value > max_value, 1, value/max_value)` ✓
- `=MIN(1, value/100000)` ✓  
- `=SQRT(value/max_value)` ✓
- `=IFS(value >= 90, 1, value >= 70, 0.8, 0.3)` ✓

#### ⚠️ Warning Cases
- Formula syntax is valid but context validation couldn't run
- Missing institution parameters (will use defaults)
- No existing client variables for cross-references

#### ❌ Error Cases
- `value is not defined` - **This should no longer occur!**
- `Syntax error` - Check parentheses and commas
- `Function not found` - Use supported functions only
- `Formula must return a numeric value` - Ensure formula returns a number

### Best Practices for Variable Creation

1. **Include Institution Context**: Always provide `institutionId` in the request
2. **Test Complex Formulas**: Use the validation endpoint for complex formulas first
3. **Check Response Data**: Review `formulaValidation` data in the response
4. **Handle Warnings**: Pay attention to any validation warnings
5. **Verify Results**: Test the variable with real data after creation

### Troubleshooting

#### If You Still Get "value is not defined"
This should no longer happen, but if it does:
1. Ensure you're using the latest version of the system
2. Check that `institutionId` is provided in the request
3. Verify the variable category exists
4. Try the standalone validation endpoint first

#### If Context Validation Fails
The system will fall back to syntax validation and show a warning. This means:
- Your formula syntax is correct
- Full validation will work after the variable is created
- You can proceed with variable creation safely

## Best Practices

### 1. Always Ensure 0-1 Range
```excel
# Good
=MAX(0, MIN(1, value/max_value))

# Bad (can exceed 1)
=value/max_value
```

### 2. Handle Edge Cases
```excel
# Handle zero/negative values
=IF(value <= 0, 0, MIN(1, value/max_value))

# Handle division by zero
=IF(max_value = 0, 0, value/max_value)
```

### 3. Use Meaningful Variable Names
```excel
# Good - clear what VAR_2001 represents
=IF(VAR_2001 > 50000, value/max_value, value/(max_value * 2))

# Document what each variable represents
```

### 4. Keep Formulas Readable
```excel
# Good - clear logic
=IF(value > max_value, 1, value/max_value)

# Avoid overly complex nested formulas
```

### 5. Test with Real Data
- Test with minimum values
- Test with maximum values
- Test with typical values
- Test with edge cases (zero, negative)

## Troubleshooting

### Common Issues

#### "value is not defined"
**Cause:** Using simple validation during variable creation
**Solution:** Create variable without formula, then update with formula

#### "Function not found"
**Cause:** Using unsupported function
**Solution:** Check supported functions list above

#### "Syntax error"
**Cause:** Missing parentheses, quotes, or commas
**Solution:** Check formula syntax carefully

#### Results outside 0-1 range
**Cause:** Formula doesn't bound results
**Solution:** Use MAX(0, MIN(1, your_formula))

#### Division by zero
**Cause:** Dividing by variable that could be zero
**Solution:** Add IF check: `IF(denominator = 0, 0, numerator/denominator)`

### Debugging Tips

1. **Start simple** - Begin with basic formula, then add complexity
2. **Test incrementally** - Add one function at a time
3. **Use validation endpoint** - Always validate before deploying
4. **Check variable availability** - Ensure referenced variables exist
5. **Verify data types** - Ensure numeric operations on numbers

### Getting Help

1. **Use validation endpoint** for detailed error messages
2. **Check this documentation** for syntax examples
3. **Test with simple formulas** first
4. **Verify variable unique codes** are correct

## Examples by Use Case

### Credit Scoring Variables

#### Income Normalization
```excel
# Basic income normalization with ceiling
=MIN(1, value/100000)

# Income with diminishing returns
=SQRT(value/max_value)

# Income tiers
=IFS(value >= 100000, 1, value >= 50000, 0.8, value >= 25000, 0.6, 0.3)
```

#### Age Normalization
```excel
# Optimal age range (25-45)
=IFS(value >= 25 AND value <= 45, 1, value >= 18 AND value < 25, 0.8, value > 45 AND value <= 65, 0.6, 0.3)
```

#### Employment History
```excel
# Years of employment (more is better)
=MIN(1, value/10)  # Cap at 10 years

# Employment stability
=IF(value >= 2, 1, value/2)  # Minimum 2 years for full score
```

#### Debt-to-Income Ratio
```excel
# Lower ratio is better (inverse scoring)
=MAX(0, 1 - value/0.5)  # 50% DTI = 0 score

# Tiered DTI scoring
=IFS(value <= 0.2, 1, value <= 0.3, 0.8, value <= 0.4, 0.6, 0.2)
```

This guide provides comprehensive coverage of the formula system. Always test your formulas using the validation endpoint before deploying to production. 