# Genie Nexus - API Gateway & OpenAI-Compatible Proxy

Genie Nexus is a robust, enterprise-grade API gateway and proxy solution that provides unified interfaces for both general HTTP requests and AI language model providers. It offers advanced features for API key management, request routing, and comprehensive analytics.

## Project Overview

This project is built as a monorepo using pnpm workspaces, consisting of several specialized packages:

- **router**: Core API routing and request handling for both HTTP and OpenAI-compatible endpoints
- **auth**: Authentication and API key management
- **management**: Administrative interface and controls
- **database**: Data persistence and schema definitions
- **types**: Shared TypeScript type definitions
- **expression-parser**: Custom expression parsing utilities

## Key Features

- General HTTP request routing and proxying
- OpenAI-compatible API endpoints
- Support for multiple providers (OpenAI, Google)
- Automatic fallback when rate limits are reached
- Configuration-based model mapping
- Support for both streaming and non-streaming responses
- SQLite or Mysql database for request logging and analytics
- Statistics API for monitoring usage and costs
- Enterprise-grade API key management with scoped access
- Multi-tenant support with isolated environments

## Technical Stack

- TypeScript for type-safe development
- Express.js for API routing
- SQLite or Mysql for data persistence
- pnpm for package management
- biome for code quality
- Husky for git hooks
- Conventional commits for version control

## Development

The project uses modern development practices:

- Strict TypeScript configuration
- Automated code formatting and linting
- Pre-commit hooks for code quality
- Conventional commit messages
- Comprehensive testing setup

## License

This project is licensed under the BSL-1.1 License - see the LICENSE.md file for details.
