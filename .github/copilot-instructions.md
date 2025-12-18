# API Test Framework - Project Instructions

## Project Overview
Playwright API test framework with TypeScript for comprehensive REST API testing.

## Technology Stack
- **Framework**: Playwright (API testing)
- **Language**: TypeScript
- **Test Runner**: Playwright Test
- **Reporters**: HTML, JSON

## Project Structure
- `/tests` - API test files
- `/tests/helpers` - Helper functions and utilities
- `/tests/config` - Configuration files
- `playwright.config.ts` - Playwright configuration

## Development Guidelines
- Write tests using async/await pattern
- Use Playwright's APIRequestContext for HTTP calls
- Organize tests by API endpoint or feature
- Include authentication examples
- Validate response status, headers, and body

## Test Execution
- Run all tests: `npx playwright test`
- Run specific test: `npx playwright test <filename>`
- Run with UI: `npx playwright test --ui`
- Generate report: `npx playwright show-report`

## Coding Standards
- Use TypeScript strict mode
- Follow async/await best practices
- Add meaningful test descriptions
- Include assertions for status codes and data
