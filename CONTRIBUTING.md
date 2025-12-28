# Contributing to Color Sorting Game

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone git@github.com:YOUR_USERNAME/colour-sorting-game.git
   cd colour-sorting-game
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your changes.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

### Building for Production

```bash
npm run build
```

## Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Write meaningful commit messages following Qvantel Conventional Commits format
- Add tests for new features
- Update documentation as needed

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

issue: <Jira ID or GitHub issue number>
```

**Allowed types:**
- `feat` - A new feature
- `fix` - A bug fix
- `perf` - A performance improvement
- `refactor` - Code refactoring
- `style` - Code style changes (formatting, etc.)
- `docs` - Documentation changes
- `test` - Adding or updating tests
- `build` - Build system changes
- `config` - Configuration changes

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update documentation to reflect any changes
3. Add tests for new features or bug fixes
4. Ensure all tests pass: `npm test`
5. Ensure the build succeeds: `npm run build`
6. Ensure linting passes: `npm run lint`
7. Create a pull request with a clear description

## Testing Guidelines

- Write unit tests for all new functions
- Maintain or improve code coverage
- Test both success and error cases
- Use descriptive test names

## Questions?

Feel free to open an issue for any questions or clarifications needed.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
