---
title: "HTTP Proxying"
description: "Route and transform HTTP requests with advanced proxying capabilities"
sidebar_position: 2
---

# HTTP Proxying

Genie Nexus provides powerful HTTP proxying capabilities that allow you to route, transform, and manage HTTP requests between your applications and external services. This guide covers all aspects of HTTP proxying, from basic setup to advanced request/response transformation.

## Overview

HTTP proxying in Genie Nexus enables you to:

- **Request Routing**: Route requests to different backend services
- **Header Management**: Add, modify, or remove request/response headers
- **Request/Response Transformation**: Modify request bodies and response data
- **Load Balancing**: Distribute requests across multiple backends
- **Authentication**: Handle authentication for backend services
- **Rate Limiting**: Control request rates and prevent abuse
- **Caching**: Cache responses to improve performance
- **Security**: Add security headers and validate requests

## Supported Provider Types

### HTTP Proxy Provider

- **Use Case**: Route requests to external APIs, based on configured rules
- **Features**: Full HTTP method support, header manipulation
- **Authentication**: Bearer tokens, API keys, custom headers

### Static Response Provider

- **Use Case**: Mock APIs, testing, static responses
- **Features**: Configurable static responses
- **Content Types**: JSON, XML, HTML, plain text

This configuration provides a production-ready HTTP proxy including request and response transformation.
