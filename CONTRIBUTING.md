# Contributing Guidelines

Thank you for considering contributing to our project!

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/project-name.git`
3. Install dependencies: `deno cache deps.ts`
4. Create a branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Run tests: `deno test`
7. Commit your changes: `git commit -m 'Add some feature'`
8. Push to the branch: `git push origin feature/your-feature-name`
9. Open a Pull Request

## Code Style

- Use TypeScript strict mode
- Follow Deno standard formatting: `deno fmt`
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Write tests for new functionality

## Commit Message Convention

- feat: A new feature
- fix: A bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc.)
- refactor: Code refactoring
- test: Adding or updating tests
- chore: Maintenance tasks

Example: `feat: add user authentication endpoint`
