# Contract Validation Testing Guide

## Overview

When testing APIs where **you don't control the data creation** (POST/PUT operations are managed by other systems), you need to validate the **contract/schema** rather than exact values. This approach ensures your GET endpoints return data in the expected structure and format.

## Why Contract Validation?

### The Problem
- ✅ You expose GET endpoints
- ❌ You don't control POST/PUT operations (another team/system creates data)
- ❌ You can't predict exact values in responses
- ✅ You need reliable, non-flaky tests

### The Solution: Test the Contract
Instead of asserting exact values like:
```gherkin
❌ Then the response field "email" should be "john@example.com"
```

Assert the structure, types, and constraints:
```gherkin
✅ Then the response field "email" should be of type "string"
✅ And the response field "email" should match email format
✅ And the response field "email" should not be null
```

## Contract Validation Scenarios

### 1. Required Fields Validation

Ensures all mandatory fields exist in the response:

```gherkin
Scenario: Validate post response contract
  When I send a GET request to "/posts/1"
  Then the response status code should be 200
  And the response should have required fields:
    | id     |
    | title  |
    | body   |
    | userId |
```

### 2. Data Type Validation

Validates field data types match the contract:

```gherkin
Scenario: Validate response data types
  When I send a GET request to "/posts/1"
  Then the response status code should be 200
  And the response field "id" should be of type "number"
  And the response field "title" should be of type "string"
  And the response field "userId" should be of type "number"
```

### 3. Nested Object Structure

Validates complex nested structures:

```gherkin
Scenario: Validate nested objects
  When I send a GET request to "/users/1"
  Then the response status code should be 200
  And the response nested field "address.street" should exist
  And the response nested field "address.city" should exist
  And the response nested field "address.geo.lat" should exist
```

### 4. Collection/Array Validation

Ensures array responses have correct structure:

```gherkin
Scenario: Validate collection structure
  When I send a GET request to "/posts"
  Then the response status code should be 200
  And the response should be an array
  And the response array should not be empty
  And each array item should have required fields:
    | id     |
    | title  |
    | userId |
```

### 5. Format Validation

Validates specific formats (email, URL, UUID, etc.):

```gherkin
Scenario: Validate email format
  When I send a GET request to "/users/1"
  Then the response status code should be 200
  And the response field "email" should match email format
  And the response field "website" should be a non-empty string
```

### 6. Numeric Constraints

Validates numeric ranges and constraints:

```gherkin
Scenario: Validate positive numbers
  When I send a GET request to "/posts/1"
  Then the response status code should be 200
  And the response field "id" should be a positive number
  And the response field "userId" should be a positive number
```

### 7. Null/Undefined Checks

Ensures required fields are never null:

```gherkin
Scenario: Validate non-nullable fields
  When I send a GET request to "/posts/1"
  Then the response status code should be 200
  And the response field "id" should not be null
  And the response field "title" should not be null
```

### 8. String Constraints

Validates string length and content:

```gherkin
Scenario: Validate string constraints
  When I send a GET request to "/posts/1"
  Then the response status code should be 200
  And the response field "title" should be a non-empty string
  And the response field "title" should have length greater than 0
```

### 9. Cross-Resource Consistency

Validates relationships between resources:

```gherkin
Scenario: Validate data consistency
  When I send a GET request to "/posts/1"
  Then the response status code should be 200
  And I store the response field "userId" as "storedUserId"
  When I send a GET request to "/users/{storedUserId}"
  Then the response status code should be 200
  And the response field "id" should equal stored value "storedUserId"
```

### 10. Collection Item Validation

Validates each item in an array:

```gherkin
Scenario: Validate all items in collection
  When I send a GET request to "/posts?_limit=5"
  Then the response status code should be 200
  And each array item should have field "userId" of type "number"
  And each array item field "userId" should be a positive number
```

## Available Step Definitions

### Required Fields
```gherkin
Then the response should have required fields:
  | field1 |
  | field2 |
```

### Data Types
```gherkin
Then the response field "fieldName" should be of type "string"
Then the response field "fieldName" should be of type "number"
```

### Nested Fields
```gherkin
Then the response nested field "parent.child.grandchild" should exist
```

### Arrays
```gherkin
Then the response should be an array
Then the response array should not be empty
Then the response array should contain at least 1 item
Then the response array should have at most 100 items
```

### Format Validation
```gherkin
Then the response field "email" should match email format
Then the response field "name" should be a non-empty string
```

### Numeric Validation
```gherkin
Then the response field "id" should be a positive number
Then the response field "age" should have length greater than 0
```

### Null Checks
```gherkin
Then the response field "id" should not be null
```

### Collection Items
```gherkin
Then each array item should have required fields:
  | field1 |
  | field2 |

Then each array item should have field "id" of type "number"
Then each array item field "price" should be a positive number
```

### Variable Storage & Comparison
```gherkin
Then I store the response field "userId" as "storedUserId"
When I send a GET request to "/users/{storedUserId}"
Then the response field "id" should equal stored value "storedUserId"
```

## Best Practices

### 1. Test Structure, Not Values
```gherkin
✅ GOOD: Field exists, correct type, valid format
❌ BAD: Field equals specific hardcoded value
```

### 2. Use Tags for Organization
```gherkin
@contract @smoke    - Critical contract tests
@schema @format     - Format validation tests
@validation         - General validation
@critical           - Must-pass scenarios
```

### 3. Validate Relationships
Test that foreign keys and relationships are consistent:
```gherkin
# Post references a valid user
And I store the response field "userId" as "userId"
When I send a GET request to "/users/{userId}"
Then the response status code should be 200
```

### 4. Test Edge Cases
```gherkin
@edgeCases
Scenario: Handle edge cases
  # Empty arrays, null optional fields, boundary values
```

### 5. Validate Collections Thoroughly
```gherkin
# Don't just check array exists
And the response should be an array
And the response array should not be empty
And each array item should have required fields:
  | id |
  | name |
```

## Running Contract Validation Tests

### Run all contract tests
```bash
npx cucumber-js features/contract-validation.feature
```

### Run by tag
```bash
npx cucumber-js --tags @contract
npx cucumber-js --tags @schema
npx cucumber-js --tags "@contract and @smoke"
```

### Run specific scenario
```bash
npx cucumber-js features/contract-validation.feature:7
```

## Example Test Results

```
13 scenarios (13 passed)
80 steps (80 passed)

✓ Validate post response contract
✓ Validate user response contract  
✓ Validate nested object structure
✓ Validate collection response structure
✓ Validate email format
✓ Validate positive numeric values
✓ Validate data within expected ranges
✓ Validate required vs optional fields
✓ Validate string field constraints
✓ Validate data consistency across resources
✓ Validate paginated response structure
✓ Validate all posts have valid user references
✓ Handle empty or missing optional fields
```

## When to Use Contract Validation

✅ **Use contract validation when:**
- You don't control data creation (POST/PUT by other systems)
- Data values change frequently or unpredictably
- You need to verify API contract compliance
- Testing third-party API integrations
- Validating data from external sources
- Ensuring backward compatibility

❌ **Don't use contract validation when:**
- You control all data (use exact value assertions)
- Testing specific business logic with known values
- Validating calculations or transformations
- Testing your own POST/PUT endpoints with test data

## Integration with CI/CD

Contract validation tests are perfect for:
- **Smoke tests** - Run after every deployment
- **Integration tests** - Verify external API contracts
- **Regression tests** - Catch breaking changes
- **Monitoring** - Continuous contract validation in production

## Summary

Contract validation ensures your GET endpoints return correctly structured data, even when you don't control the data creation process. Focus on:

1. ✅ **Structure** - Required fields exist
2. ✅ **Types** - Fields have correct data types
3. ✅ **Formats** - Strings match expected patterns (email, URL, etc.)
4. ✅ **Constraints** - Numbers are positive, strings non-empty, etc.
5. ✅ **Relationships** - Foreign keys reference valid resources
6. ✅ **Collections** - Arrays have correct structure and items

This approach creates **stable, reliable tests** that don't break when data values change, while still ensuring your API contract is properly implemented.
