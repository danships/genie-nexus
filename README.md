# Genie Nexus - Unified API Gateway for AI & HTTP Services

Genie Nexus is a powerful API gateway that unifies access to AI language models and HTTP services. Built for technical teams who need reliability, control, and comprehensive analytics without vendor lock-in.

## Key Capabilities

- **Unified AI Access**: Single API endpoint for OpenAI, Google, and other AI providers
- **Smart Load Balancing**: Automatic failover and rate limit handling across providers
- **Enterprise Security**: Advanced API key management
- **Real-time Analytics**: Comprehensive usage tracking, cost monitoring, and performance insights
- **OpenAI Compatibility**: Drop-in replacement for OpenAI API with enhanced reliability
- **Self-Hosted Control**: Deploy anywhere with full data ownership and customization

## Quick Start

Deploy with Docker in seconds:

```bash
docker run -p 3000:3000 ghcr.io/danships/genie-nexus:latest
```

_We advise to use a fixed version label instead of `latest`, check out [releases](https://github.com/danships/genie-nexus/releases) for details._

Access your unified API gateway at `http://localhost:3000`

## Bring Your Own API Keys

Genie Nexus requires you to provide your own API keys for AI providers (OpenAI, Google, etc.). We don't provide or manage API keys for you - this gives you full control over costs, usage, and data privacy. Simply configure your keys in the environment variables and Genie Nexus will handle the rest.

## Upcoming Hosted Version

We're working on a hosted version of Genie Nexus! Subscribe at [https://www.gnxs.io](https://www.gnxs.io) to stay updated on the launch and get early access.

## Why Genie Nexus?

**For AI Teams**: Stop managing multiple API keys and rate limits. Get unified access to all AI providers with automatic failover.

**For Enterprise**: Maintain full control over your AI infrastructure with self-hosted deployment.

**For Developers**: Build with confidence using our OpenAI-compatible API that works with existing code and libraries.

**For Everyone**: Simplify your AI journey with one reliable gateway that just works, no matter your technical background.

## Features

- **Multi-Provider Support**: OpenAI, Google, and more with easy configuration
- **Intelligent Routing**: Automatic load balancing and failover when providers hit limits
- **HTTP API Gateway**: Route and proxy general HTTP requests with advanced filtering and transformation
- **Usage Analytics**: Track costs, performance, and usage patterns across all providers and API's
- **API Key Management**: Centralized, secure key management with granular permissions
- **Streaming Support**: Full support for both streaming and non-streaming AI responses
- **Custom Models**: Map your own models to any provider with flexible configuration
- **Request/Response Transformation**: Modify headers, body, and routing logic for any HTTP endpoint

## Resources

- 📚 [Documentation](https://www.gnxs.io/docs)

## License

This project is licensed under the BSL-1.1 License - see the [LICENSE.md](LICENSE.md) file for details.
