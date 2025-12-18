# Gherkin/BDD API Testing Guide

## Overview

This project now supports **Behavior-Driven Development (BDD)** using Gherkin syntax with Cucumber-js. You can write test scenarios in plain English using `.feature` files.

## Project Structure

```
API Test/
├── features/
│   ├── api-tests.feature          # Main API test scenarios
│   ├── authentication.feature     # Authentication scenarios
│   └── step_definitions/
│       └── api-steps.ts           # Step implementations
├── cucumber.js                     # Cucumber configuration
└── tests/                         # Original Playwright tests (still available)
```

## Running Gherkin Tests

### Run all Cucumber tests
```bash
npm run test:cucumber
```

### Run specific feature file
```bash
npm run test:cucumber:api
```

### Run all feature files
```bash
npm run test:cucumber:all
```

### Run specific scenarios by tag
```bash
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "not @skip"
```

## Feature File Syntax

### Basic Structure

```gherkin
Feature: Feature Name
  
  Background:
    Given some common setup step
  
  Scenario: Scenario Name
    Given a precondition
    When an action is performed  
    Then an expected result occurs
    And another expected result
```

### Data Tables

```gherkin
Scenario: Create a post
  Given I have the following post data:
    | title  | My Post Title    |
    | body   | Post content     |
    | userId | 1                |
  When I send a POST request to "/posts" with the data
  Then the response status code should be 201
```

### Scenario Outlines (Examples)

```gherkin
Scenario Outline: Validate multiple status codes
  When I send a GET request to "<endpoint>"
  Then the response status code should be <status>
  
  Examples:
    | endpoint      | status |
    | /posts/1      | 200    |
    | /posts/99999  | 404    |
```

### Tags

```gherkin
@smoke @critical
Scenario: Critical test
  When I test something important
  Then it should work

@skip
Scenario: Test to skip
  When I test something not ready
  Then skip this for now
```

## Available Step Definitions

### Setup Steps
```gherkin
Given the API base URL is "https://api.example.com"
Given the API supports multiple authentication methods
```

### Authentication Steps
```gherkin
Given I have a bearer token "my-jwt-token"
Given I have an API key "my-api-key"
Given I have basic auth credentials "username" and "password"
```

### Data Preparation
```gherkin
Given I have the following post data:
  | field | value |
  | ...   | ...   |

Given I have the following update data:
  | field | value |
  | ...   | ...   |
```

### Request Steps
```gherkin
When I send a GET request to "/endpoint"
When I send a GET request to "/endpoint" with bearer authentication
When I send a GET request to "/endpoint" with API key in header
When I send a GET request to "/endpoint" with basic authentication
When I send a POST request to "/endpoint" with the data
When I send a POST request to "/endpoint" with the data and bearer authentication
When I send a PUT request to "/endpoint" with the data
When I send a DELETE request to "/endpoint"
```

### Assertion Steps
```gherkin
Then the response status code should be 200
Then the response should be a JSON array
Then the response array should contain at least 1 item
Then the response array should have at most 5 items
Then each item should have property "id"
Then the response should have property "title"
Then the response should have property "id" with value 1
Then the response should have property "title" with value "My Title"
Then the response property "address" should have property "street"
Then the response property "id" should be a number
Then the response property "title" should be a string
```

## Example Feature Files

### Example 1: Simple GET Request

```gherkin
Feature: User API

  Scenario: Get user by ID
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response should have property "name"
    And the response should have property "email"
```

### Example 2: POST with Data

```gherkin
Feature: Posts API

  Scenario: Create new post
    Given I have the following post data:
      | title  | My New Post        |
      | body   | Post content here  |
      | userId | 5                  |
    When I send a POST request to "/posts" with the data
    Then the response status code should be 201
    And the response should have property "id"
```

### Example 3: Authentication

```gherkin
Feature: Protected API

  Scenario: Access with Bearer token
    Given I have a bearer token "eyJhbGciOiJIUzI1..."
    When I send a GET request to "/protected/resource" with bearer authentication
    Then the response status code should be 200
```

### Example 4: Scenario Outline

```gherkin
Feature: Status Code Validation

  Scenario Outline: Validate different endpoints
    When I send a GET request to "<endpoint>"
    Then the response status code should be <expectedStatus>
    
  Examples:
    | endpoint      | expectedStatus |
    | /posts/1      | 200            |
    | /posts/99999  | 404            |
    | /users/1      | 200            |
```

## Reports

Cucumber generates reports in multiple formats:

- **HTML Report**: `cucumber-report.html` - Visual report with pass/fail status
- **JSON Report**: `cucumber-report.json` - Machine-readable report for CI/CD
- **Console Output**: Detailed step-by-step execution in terminal

View HTML report:
```bash
start cucumber-report.html
```

## Configuration

Edit `cucumber.js` to customize:

```javascript
module.exports = {
  default: {
    require: ['features/step_definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',                    // Progress in terminal
      'html:cucumber-report.html',       // HTML report
      'json:cucumber-report.json',       // JSON report
      '@cucumber/pretty-formatter'       // Pretty console output
    ],
    publishQuiet: true,
  }
};
```

## Adding Custom Steps

Create new step definitions in `features/step_definitions/`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I have custom data {string}', function (data: string) {
  this.customData = data;
});

When('I perform custom action', async function () {
  // Your custom action
});

Then('the custom result should be {string}', function (expected: string) {
  expect(this.result).toBe(expected);
});
```

## Best Practices

1. **Write in Business Language**: Gherkin should be readable by non-technical stakeholders
2. **One Scenario, One Behavior**: Each scenario tests one specific behavior
3. **Use Background for Common Setup**: Avoid repetition across scenarios
4. **Keep Scenarios Independent**: Each scenario should run independently
5. **Use Tags for Organization**: Group related scenarios with tags
6. **Meaningful Scenario Names**: Names should describe the behavior being tested
7. **Avoid Technical Details**: Keep implementation details in step definitions

## Comparison: Gherkin vs Playwright

### Gherkin (BDD)
✅ Business-readable scenarios  
✅ Non-technical collaboration  
✅ Living documentation  
✅ Reusable step definitions  
❌ Additional abstraction layer  

### Playwright (Direct)
✅ More control and flexibility  
✅ Easier debugging  
✅ Faster for developers  
✅ Direct TypeScript code  
❌ Less accessible to non-technical users  

**Both approaches are available** - use Gherkin for stakeholder collaboration and Playwright tests for complex technical scenarios.

## Troubleshooting

### Steps not found
Make sure step definitions are in `features/step_definitions/` and match the Gherkin syntax exactly.

### TypeScript errors
Ensure `ts-node` is installed: `npm install -D ts-node`

### Data table parsing issues
Use `.rows()` method to access data table rows:
```typescript
Given('I have data:', function (dataTable) {
  const rows = dataTable.rows();
  // Process rows
});
```

## Next Steps

1. Add more scenarios to existing feature files
2. Create new feature files for different API modules
3. Implement Scenario Outlines for data-driven tests
4. Add tags for test categorization (@smoke, @regression, etc.)
5. Integrate with CI/CD pipeline
6. Generate and publish reports
