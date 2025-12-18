# Advanced API Testing Patterns Guide

This guide covers enterprise-level API testing patterns implemented in this framework, going beyond basic CRUD operations to validate production-grade API requirements.

## Overview

The advanced testing patterns cover six critical areas:

1. **HTTP Protocol Validation** - Protocol compliance and header handling
2. **Identity Validation** - ID format, uniqueness, and referential integrity
3. **Sorting & Pagination** - Deterministic ordering and page boundaries
4. **Idempotency** - Stability and side-effect validation
5. **Performance** - Response times and payload constraints
6. **Data Quality** - Sanitization and format validation

## 1. HTTP Protocol Validation (`http-protocol.feature`)

### Purpose
Validates that the API adheres to HTTP standards and returns correct status codes, headers, and error responses.

### Key Scenarios

#### Status Code Validation
```gherkin
Scenario: Validate successful response status codes
  When I send a GET request to "/posts/1"
  Then the response status code should be 200
  When I send a POST request to "/posts" with the data:
    | title  | Test Post |
    | body   | Content   |
    | userId | 1         |
  Then the response status code should be 201
```

**Why**: Ensures proper HTTP semantics (200 for GET, 201 for POST creation, 404 for not found).

#### Header Validation
```gherkin
Scenario: Validate Content-Type header
  When I send a GET request to "/posts/1"
  Then the response header "content-type" should contain "application/json"
  And the response should have header "cache-control"
```

**Why**: Verifies that API returns appropriate headers for client processing and caching.

#### Error Contract Validation
```gherkin
Scenario: Validate error response structure
  When I send a GET request to "/posts/999999"
  Then the response status code should be 404
  And the response should be valid JSON
```

**Why**: Ensures errors are returned in a consistent, parseable format.

### When to Use
- API gateway configuration testing
- Ensuring HTTP compliance across services
- Validating error handling consistency
- Cache behavior verification

---

## 2. Identity Validation (`identity-validation.feature`)

### Purpose
Validates ID format, uniqueness, immutability, and referential integrity across resources.

### Key Scenarios

#### ID Format Validation
```gherkin
Scenario: Validate ID is numeric and positive
  When I send a GET request to "/posts/1"
  And the response field "id" should be of type "number"
  And the response field "id" should be a positive number
```

**Why**: Ensures consistent ID format (prevents negative IDs, nulls, or string IDs when numbers expected).

#### Uniqueness Validation
```gherkin
Scenario: Validate ID uniqueness in collection
  When I send a GET request to "/posts?_limit=20"
  And each array item field "id" should be unique
```

**Why**: Prevents duplicate IDs which can cause data corruption or cache inconsistencies.

#### Immutability Validation
```gherkin
Scenario: Validate ID immutability on update
  When I send a GET request to "/posts/1"
  And I store the response field "id" as "originalId"
  When I send a PUT request to "/posts/1" with the data:
    | id     | 1             |
    | title  | Updated Title |
  Then the response field "id" should equal stored value "originalId"
```

**Why**: Ensures IDs remain stable across updates (critical for caching, indexing).

#### Foreign Key Validation
```gherkin
Scenario: Validate foreign key references exist
  When I send a GET request to "/posts/1"
  And I store the response field "userId" as "referencedUserId"
  When I send a GET request to "/users/{referencedUserId}"
  Then the response status code should be 200
```

**Why**: Validates referential integrity - ensures foreign key relationships are valid.

### When to Use
- Database migration testing
- Cache consistency validation
- Referential integrity checks
- Data import/export validation

---

## 3. Sorting & Pagination (`sorting-pagination.feature`)

### Purpose
Ensures deterministic ordering and proper pagination behavior across requests.

### Key Scenarios

#### Default Sort Order
```gherkin
Scenario: Validate default sorting order
  When I send a GET request to "/posts?_limit=10"
  And the response array should be sorted by "id" in "ascending" order
```

**Why**: Ensures predictable default ordering (critical for UIs, caching, pagination).

#### Stable Ordering Across Pages
```gherkin
Scenario: Validate stable ordering across pages
  When I send a GET request to "/posts?_page=1&_limit=5"
  And I store the last array item field "id" as "lastIdPage1"
  When I send a GET request to "/posts?_page=2&_limit=5"
  Then the first array item field "id" should be greater than stored value "lastIdPage1"
```

**Why**: Prevents duplicate/missing items when paginating (ensures stable sort).

#### Empty Page Handling
```gherkin
Scenario: Validate empty page returns empty array
  When I send a GET request to "/posts?_page=1000&_limit=10"
  Then the response array should be empty
```

**Why**: Ensures graceful handling of out-of-range page requests.

#### No Duplicates/Skips
```gherkin
Scenario: Validate pagination does not skip or duplicate items
  When I send a GET request to "/posts?_page=1&_limit=5"
  And I store all array item field "id" values as "page1Ids"
  When I send a GET request to "/posts?_page=2&_limit=5"
  Then the array should not contain any stored "page1Ids" values
```

**Why**: Critical for data consistency - ensures every item appears exactly once.

### When to Use
- Infinite scroll implementations
- Data export features
- Report generation
- List view consistency

---

## 4. Idempotency (`idempotency.feature`)

### Purpose
Validates that GET requests are idempotent (safe, cacheable, no side effects).

### Key Scenarios

#### GET Idempotency
```gherkin
Scenario: Validate GET is idempotent
  When I send a GET request to "/posts/1"
  And I store the entire response as "firstResponse"
  When I send a GET request to "/posts/1"
  Then the response should match stored "firstResponse"
```

**Why**: GET must return identical data on repeated calls (required for caching, retries).

#### No Side Effects
```gherkin
Scenario: Validate GET has no side effects
  When I send a GET request to "/posts/1"
  And I store the response field "title" as "originalTitle"
  When I send a GET request to "/posts/1"
  Then the response field "title" should equal stored value "originalTitle"
```

**Why**: Reading data must not modify it (critical for read replicas, caching).

#### Multiple Rapid Requests
```gherkin
Scenario: Validate stable response across multiple rapid requests
  When I send 5 GET requests to "/posts/1"
  Then all responses should have status code 200
  And all responses should have consistent data structure
```

**Why**: Validates stability under concurrent access patterns.

#### Collection Stability
```gherkin
Scenario: Validate collection endpoint stability
  When I send a GET request to "/posts?_limit=10"
  And I store the response array length as "firstCount"
  When I send a GET request to "/posts?_limit=10"
  Then the response array length should equal stored value "firstCount"
```

**Why**: Collection size should be stable (detects race conditions, cache issues).

### When to Use
- API contract testing
- Cache validation
- Load balancer configuration testing
- Retry logic verification

---

## 5. Performance (`performance.feature`)

### Purpose
Establishes performance baselines and validates response times and payload sizes.

### Key Scenarios

#### Response Time Validation
```gherkin
Scenario: Validate response time is acceptable
  When I send a GET request to "/posts/1"
  Then the response time should be less than 2000 ms
```

**Why**: SLAs often include response time requirements (e.g., p95 < 500ms).

#### Payload Size Limits
```gherkin
Scenario: Validate reasonable payload size for single resource
  When I send a GET request to "/posts/1"
  Then the response payload size should be less than 10 KB
```

**Why**: Prevents over-fetching, reduces bandwidth costs, improves mobile performance.

#### Performance Baseline
```gherkin
Scenario: Establish performance baseline
  When I send a GET request to "/posts/1"
  And I measure the response time as "baseline"
  When I send a GET request to "/posts/1"
  Then the response time should be within 200% of "baseline"
```

**Why**: Detects performance regressions (alerts if response time doubles).

### When to Use
- Pre-deployment smoke tests
- Performance regression detection
- Monitoring critical path latencies
- Bandwidth optimization validation

---

## 6. Data Quality (`data-quality.feature`)

### Purpose
Validates data sanitization, format consistency, and cleanliness.

### Key Scenarios

#### Trimming Validation
```gherkin
Scenario: Validate string fields are properly trimmed
  When I send a GET request to "/users/1"
  Then the response field "name" should not have leading whitespace
  And the response field "name" should not have trailing whitespace
```

**Why**: Leading/trailing whitespace causes UI issues, comparison failures.

#### Empty String Validation
```gherkin
Scenario: Validate no empty strings in required fields
  When I send a GET request to "/posts/1"
  Then the response field "title" should be a non-empty string
  And the response field "body" should be a non-empty string
```

**Why**: Required fields should have values (empty strings != null).

#### Format Validation
```gherkin
Scenario: Validate email format is valid
  When I send a GET request to "/users/1"
  Then the response field "email" should match email format
  And the response field "email" should not contain spaces
```

**Why**: Ensures data can be used for its intended purpose (emails, URLs).

#### Control Character Detection
```gherkin
Scenario: Validate no control characters in text fields
  When I send a GET request to "/posts/1"
  Then the response field "title" should not contain control characters
  And the response field "body" should not contain control characters
```

**Why**: Control characters can break JSON parsing, UI rendering, logging.

#### Collection Data Quality
```gherkin
Scenario: Validate data consistency across all posts
  When I send a GET request to "/posts?_limit=10"
  And each array item field "title" should be a non-empty string
  And each array item field "id" should be a positive number
```

**Why**: Validates quality across entire dataset, not just single records.

### When to Use
- Data import validation
- User-generated content validation
- Third-party API integration testing
- Data warehouse ETL validation

---

## Running Advanced Tests

### Run All Advanced Tests
```bash
npx cucumber-js features/http-protocol.feature features/identity-validation.feature features/sorting-pagination.feature features/idempotency.feature features/performance.feature features/data-quality.feature
```

### Run by Category
```bash
# HTTP Protocol tests
npx cucumber-js features/http-protocol.feature

# Identity tests
npx cucumber-js features/identity-validation.feature

# Sorting and Pagination tests
npx cucumber-js features/sorting-pagination.feature

# Idempotency tests
npx cucumber-js features/idempotency.feature

# Performance tests
npx cucumber-js features/performance.feature

# Data Quality tests
npx cucumber-js features/data-quality.feature
```

### Run by Tag
```bash
# Run all smoke tests
npx cucumber-js --tags @smoke

# Run protocol validation
npx cucumber-js --tags @protocol

# Run performance tests
npx cucumber-js --tags @performance

# Run identity tests
npx cucumber-js --tags @identity
```

---

## Step Definitions Reference

### HTTP Protocol Steps
- `response header {string} should contain {string}` - Validates header value
- `response should have header {string}` - Checks header presence
- `send a POST request to {string} with the data:` - POST with data table

### Identity Steps
- `each array item field {string} should be unique` - Validates uniqueness
- `each array item should have valid foreign key {string} in resource {string}` - FK validation

### Sorting & Pagination Steps
- `response array should be sorted by {string} in {string} order` - Sort validation
- `store the last array item field {string} as {string}` - Store last item
- `first array item field {string} should be greater than stored value {string}` - Ordering check
- `response array should be empty` - Empty array check
- `store all array item field {string} values as {string}` - Store array values
- `array should not contain any stored {string} values` - No duplicates check

### Idempotency Steps
- `store the entire response as {string}` - Store full response
- `response should match stored {string}` - Compare responses
- `send {int} GET requests to {string}` - Send multiple requests
- `all responses should have status code {int}` - Validate all responses
- `all responses should have consistent data structure` - Structure consistency
- `store the response array length as {string}` - Store length
- `response array length should equal stored value {string}` - Compare lengths

### Performance Steps
- `response time should be less than {int} ms` - Response time threshold
- `response payload size should be less than {int} KB` - Payload size limit
- `measure the response time as {string}` - Record baseline
- `response time should be within {int}% of {string}` - Regression detection

### Data Quality Steps
- `response field {string} should not have leading whitespace` - Trimming check
- `response field {string} should not have trailing whitespace` - Trimming check
- `response field {string} should not be an empty string` - Empty check
- `response field {string} should not contain spaces` - Space validation
- `response field {string} should not contain control characters` - Control char check
- `each array item field {string} should be a non-empty string` - Collection validation

---

## Best Practices

### 1. Test Isolation
- Each scenario should be independent
- Use stored variables for cross-request validation
- Clean up state between scenarios (handled by Before/After hooks)

### 2. Realistic Test Data
- Use query parameters to limit collection sizes (`_limit=10`)
- Test edge cases (empty pages, large IDs, special characters)
- Validate both single resources and collections

### 3. Assertions
- Check both positive cases (what should be there) and negative cases (what shouldn't)
- Validate data types, formats, and constraints
- Test boundary conditions

### 4. Performance
- Set realistic thresholds based on your SLAs
- Measure baseline performance before regression testing
- Consider network latency in thresholds

### 5. Maintainability
- Use descriptive scenario names
- Group related scenarios with tags
- Document why tests exist (not just what they test)

---

## Integration with CI/CD

Add these patterns to your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run Advanced API Tests
  run: |
    npx cucumber-js features/http-protocol.feature
    npx cucumber-js features/identity-validation.feature
    npx cucumber-js features/sorting-pagination.feature
    npx cucumber-js features/idempotency.feature
    npx cucumber-js features/performance.feature
    npx cucumber-js features/data-quality.feature
```

Or run all non-skipped tests:
```bash
npx cucumber-js features/ --parallel 2
```

---

## Summary

These advanced patterns go beyond basic CRUD testing to validate:

✅ **Protocol Compliance** - HTTP standards, headers, status codes  
✅ **Data Integrity** - IDs, foreign keys, referential integrity  
✅ **Deterministic Behavior** - Sorting, pagination, ordering  
✅ **Safety** - Idempotency, no side effects  
✅ **Performance** - Response times, payload sizes, baselines  
✅ **Data Quality** - Sanitization, formats, consistency  

By implementing these patterns, you ensure your API is production-ready, reliable, and meets enterprise-grade quality standards.
