# OpenAI-Compatible API Proxy

This Express server acts as a proxy for OpenAI-compatible endpoints, with the ability to route requests to different providers based on configuration. It includes SQLite logging for request metadata, token usage, and pricing.

## Features

- OpenAI-compatible API endpoints
- Support for multiple providers (OpenAI, Google)
- Automatic fallback when rate limits are reached
- Configuration-based model mapping
- Support for both streaming and non-streaming responses
- SQLite database for request logging and analytics
- Statistics API for monitoring usage and costs
