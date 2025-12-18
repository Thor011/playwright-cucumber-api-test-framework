# Playwright API Test Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Playwright](https://img.shields.io/badge/Playwright-1.57.0-green.svg)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Cucumber](https://img.shields.io/badge/Cucumber-12.4.0-brightgreen.svg)](https://cucumber.io/)

A comprehensive TypeScript-based API test framework using **Playwright** and **Cucumber (Gherkin/BDD)** for testing REST APIs with enterprise-grade validation patterns.

## ✨ Features

- ✅ **TypeScript** for type safety and better IDE support
- ✅ **Playwright** for powerful API testing capabilities
- ✅ **Cucumber/Gherkin** for BDD-style test scenarios
- ✅ **Contract Validation** for testing APIs with external data
- ✅ **Advanced Testing Patterns** (HTTP protocol, identity, sorting, idempotency, performance, data quality)
- ✅ **76 Scenarios** covering comprehensive API validation (409 test steps)
- ✅ **Parallel execution** for faster test runs
- ✅ **Multiple reporters** (HTML, JSON, List)
- ✅ **Helper utilities** for common API operations
- ✅ **Authentication examples** (Bearer tokens, API keys, OAuth)
- ✅ **Data validation** patterns
- ✅ **Request examples** (GET, POST, PUT, DELETE)

## Project Structure

```
api-tests/
├── features/                        # Gherkin feature files (BDD)
│   ├── api-tests.feature           # Main API scenarios (9 scenarios)
│   ├── authentication.feature      # Auth scenarios (4 scenarios, @skip)
│   ├── validation.feature          # Data validation scenarios (6 scenarios)
│   ├── contract-validation.feature # Contract/schema validation (13 scenarios)
│   ├── http-protocol.feature       # HTTP protocol validation (10 scenarios)
│   ├── identity-validation.feature # ID and referential integrity (6 scenarios)
│   ├── sorting-pagination.feature  # Sorting and pagination (8 scenarios)
│   ├── idempotency.feature         # Idempotency testing (5 scenarios)
│   ├── performance.feature         # Performance and reliability (7 scenarios)
│   ├── data-quality.feature        # Data quality validation (8 scenarios)
│   └── step_definitions/
│       └── api-steps.ts            # Step implementations (~100+ steps)
├── tests/                          # Playwright test files (direct)
│   ├── config/
│   │   └── test-config.ts          # Configuration and test data
│   ├── helpers/
│   │   └── api-helper.ts           # Reusable API helper functions
│   ├── get-requests.spec.ts        # GET request examples
│   ├── post-requests.spec.ts       # POST request examples
│   ├── put-requests.spec.ts        # PUT request examples
│   ├── delete-requests.spec.ts     # DELETE request examples
│   ├── data-validation.spec.ts     # Data validation examples
│   └── authentication.spec.ts      # Authentication patterns
├── cucumber.js                     # Cucumber configuration
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── README.md                       # This file
├── GHERKIN-GUIDE.md               # Gherkin/BDD usage guide
├── CONTRACT-VALIDATION-GUIDE.md   # Contract validation guide
├── ADVANCED-TESTING-GUIDE.md      # Advanced testing patterns guide
└── package.json                    # Project dependencies
```

## Quick Start

### Prerequisites
- Node.js 20.x or higher (required for Cucumber)
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers (optional for API testing):**
   ```bash
   npx playwright install
   ```

## Running Tests

### Playwright Tests (TypeScript)

#### Run all tests
```bash
npm test
```

#### Run specific test file
```bash
npx playwright test get-requests.spec.ts
```

#### Run tests with UI mode (interactive)
```bash
npm run test:ui
```

#### Run tests in headed mode
```bash
npm run test:headed
```

#### Debug tests
```bash
npm run test:debug
```

#### View test report
```bash
npm run test:report
```

### Cucumber/Gherkin Tests (BDD)

#### Run all Cucumber scenarios (76 scenarios, 409 steps)
```bash
npm run test:cucumber
```

#### Run specific feature file
```bash
# Basic API tests
npm run test:cucumber:api

# Advanced testing patterns
npx cucumber-js features/http-protocol.feature
npx cucumber-js features/identity-validation.feature
npx cucumber-js features/sorting-pagination.feature
npx cucumber-js features/idempotency.feature
npx cucumber-js features/performance.feature
npx cucumber-js features/data-quality.feature

# Contract validation
npx cucumber-js features/contract-validation.feature
```

#### Run by tag
```bash
# Run smoke tests only
npx cucumber-js --tags @smoke

# Run protocol validation tests
npx cucumber-js --tags @protocol

# Run performance tests
npx cucumber-js --tags @performance

# Run identity validation tests
npx cucumber-js --tags @identity
```

#### Run with tags
```bash
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "not @skip"
```

#### View Cucumber HTML report
```bash
start cucumber-report.html
```

## Documentation Guides

This framework includes comprehensive documentation:

📖 **[GHERKIN-GUIDE.md](./GHERKIN-GUIDE.md)** - Complete guide to using Gherkin/BDD with examples  
📖 **[CONTRACT-VALIDATION-GUIDE.md](./CONTRACT-VALIDATION-GUIDE.md)** - Contract and schema validation patterns  
📖 **[ADVANCED-TESTING-GUIDE.md](./ADVANCED-TESTING-GUIDE.md)** - Enterprise-level testing patterns:
  - HTTP Protocol Validation (status codes, headers, error handling)
  - Identity Validation (ID format, uniqueness, foreign keys)
  - Sorting & Pagination (ordering, boundaries, consistency)
  - Idempotency (GET safety, no side effects)
  - Performance (response time, payload size, baselines)
  - Data Quality (sanitization, formats, control characters)

## Test Coverage Summary

| Category | Scenarios | Steps | Status |
|----------|-----------|-------|--------|
| Basic API Tests | 9 | 40 | ✅ Passing |
| Authentication | 4 | 24 | ✅ Passing |
| Validation | 6 | 26 | ✅ Passing |
| Contract Validation | 13 | 80 | ✅ Passing |
| HTTP Protocol | 10 | 36 | ✅ Passing |
| Identity Validation | 6 | 37 | ✅ Passing |
| Sorting & Pagination | 8 | 44 | ✅ Passing |
| Idempotency | 5 | 32 | ✅ Passing |
| Performance | 7 | 30 | ✅ Passing |
| Data Quality | 8 | 44 | ✅ Passing |
| **TOTAL** | **76** | **409** | **✅ 76 Passing** |

## Configuration

### Base URL
Update the base URL in `playwright.config.ts`:

```typescript
use: {
  baseURL: 'https://your-api-url.com',
}
```

### Authentication
Update authentication tokens in `tests/config/test-config.ts`:

```typescript
auth: {
  bearerToken: 'your-actual-token',
  apiKey: 'your-actual-api-key',
}
```

## Test Examples

### GET Request
```typescript
test('should get all posts', async ({ request }) => {
  const response = await request.get('/posts');
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(Array.isArray(data)).toBeTruthy();
});
```

### POST Request with Authentication
```typescript
test('should create post with auth', async ({ request }) => {
  const response = await request.post('/posts', {
    data: { title: 'Test', body: 'Content', userId: 1 },
    headers: { 'Authorization': `Bearer ${token}` }
  });
  expect(response.status()).toBe(201);
});
```

### Data Validation
```typescript
test('should validate response schema', async ({ request }) => {
  const response = await request.get('/posts/1');
  const post = await response.json();
  
  expect(post).toHaveProperty('id');
  expect(post).toHaveProperty('title');
  expect(typeof post.title).toBe('string');
});
```

## Using the API Helper

The `ApiHelper` class provides convenient methods for API requests:

```typescript
import { ApiHelper } from './helpers/api-helper';

test('example using helper', async ({ request }) => {
  const helper = new ApiHelper(request);
  
  // GET with authentication
  const response = await helper.get('/posts/1', { 
    token: 'your-token' 
  });
  
  // POST with authentication
  const createResponse = await helper.post('/posts', data, { 
    token: 'your-token' 
  });
});
```

## Parallel Execution

Tests run in parallel by default. Configure in `playwright.config.ts`:

```typescript
workers: process.env.CI ? 1 : undefined,  // Parallel locally, sequential in CI
fullyParallel: true,
```

## Reporters

The framework generates multiple reports:

- **HTML Report**: Visual test results in `playwright-report/`
- **JSON Report**: Machine-readable results in `test-results/results.json`
- **List Report**: Console output during test execution

## Best Practices

1. **Organize tests by feature/endpoint**
2. **Use descriptive test names**
3. **Validate status codes AND response data**
4. **Use test.beforeEach for common setup**
5. **Leverage the ApiHelper for reusable operations**
6. **Keep sensitive data in environment variables**
7. **Add proper error handling and assertions**

## Environment Variables

Create a `.env` file for sensitive data:

```bash
API_BASE_URL=https://api.example.com
API_TOKEN=your-token-here
API_KEY=your-api-key-here
```

Then load it in your config:

```typescript
import * as dotenv from 'dotenv';
dotenv.config();
```

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Tests failing to connect
- Verify `baseURL` in `playwright.config.ts`
- Check network connectivity
- Validate authentication credentials

### TypeScript errors
- Run `npm install` to ensure dependencies are installed
- Check `tsconfig.json` configuration

### Report not generating
- Ensure test run completes
- Check `playwright-report/` directory
- Run `npm run test:report` to view

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on:
- Reporting issues
- Adding new test scenarios
- Code style guidelines
- Pull request process

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Resources

- [Playwright API Testing Docs](https://playwright.dev/docs/api-testing)
- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com/) (used in examples)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

## License

ISC
