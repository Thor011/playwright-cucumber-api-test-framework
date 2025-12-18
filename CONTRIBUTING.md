# Contributing to Playwright API Test Framework

Thank you for considering contributing to this project! 

## How to Contribute

### Reporting Issues
- Check if the issue already exists
- Provide clear description and steps to reproduce
- Include test output, logs, and environment details

### Adding New Test Scenarios
1. **Playwright Tests**: Add to `/tests` directory with `.spec.ts` extension
2. **Gherkin/BDD Tests**: Add to `/features` directory with `.feature` extension
3. Follow existing patterns and naming conventions
4. Add appropriate tags (@smoke, @auth, @validation, etc.)
5. Update documentation if adding new patterns

### Code Style
- Use TypeScript with strict mode
- Follow existing code structure
- Add comments for complex logic
- Use meaningful variable and function names

### Testing Your Changes
```bash
# Run Playwright tests
npm test

# Run Cucumber tests
npm run test:cucumber

# Run specific feature
npx cucumber-js features/your-feature.feature
```

### Pull Request Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run all tests to ensure they pass
5. Commit with clear messages
6. Push to your fork
7. Create a Pull Request with description of changes

### Documentation
- Update README.md if adding new features
- Add examples to relevant guide files
- Keep documentation clear and concise

## Questions?
Open an issue for discussion or clarification.
