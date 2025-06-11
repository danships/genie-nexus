---
title: "Quickstart Guide"
description: "Get up and running with Genie Nexus in minutes"
---

# Quickstart Guide

This guide will get you up and running with Genie Nexus in just a few minutes. We'll cover the essential setup steps to start routing requests to AI providers.

## Prerequisites

- Docker installed on your system
- Basic understanding of APIs and HTTP requests

## Step 1: Start Genie Nexus

Run Genie Nexus using Docker:

```bash
docker run -p 3000:3000 \
  ghcr.io/danships/genie-nexus:latest
```

This starts Genie Nexus with:

- Web management interface enabled
- Default SQLite database (./db.sqlite)

_We recommend using a fixed version label for the docker image instead of `latest`. But for quick testing, `latest` is fine._

## Step 2: Access the Management Interface

Open your browser and go to:

```
http://localhost:3000
```

You should see the onboarding flow and be guided through the setup process.

## Step 3: Create an API Key

1. Click **"Create API Key"** on the dashboard
2. Choose the key type (LLM API, Weave API, or Management)
3. Set permissions and scope
4. Copy the generated key

Genie Nexus manages its own API Keys for requests, so you don't need to provide users
with API Keys or credentials from your LLM or API provider.

## Step 4: Add Your First Provider

### OpenAI Provider

1. Click **"Connect Provider"** on the dashboard
2. Select **"OpenAI"** as the provider type
3. Enter your OpenAI API key
4. Click **"Save"**

### Google AI Provider

1. Click **"Connect Provider"** on the dashboard
2. Select **"Google AI"** as the provider type
3. Enter your Google AI API key
4. Click **"Save"**

## Step 5: Create Your First Deployment

### LLM Deployment

1. Click **"New Deployment"** on the dashboard
2. Select **"LLM"** as the deployment type
3. Choose a name and slug (e.g., "gpt", "chat")
4. Select your provider
5. Choose available models
6. Click **"Create"**

### HTTP Deployment

1. Click **"New Deployment"** on the dashboard
2. Select **"HTTP"** as the deployment type
3. Choose a name and slug (e.g., "api", "proxy")
4. Enter the target URL
5. Configure headers if needed
6. Click **"Create"**

## Step 6: Test Your Setup

Each deployment will display a HTTP endpoint that you can use to test your deployment/configuration.

## Common Use Cases

### 1. OpenAI Proxy

Route requests to OpenAI with custom configuration.

### 2. API Gateway

Proxy requests to your backend API.

### 3. Multi-Provider Fallback

Set up multiple providers for redundancy:

1. Add multiple OpenAI providers (different API keys)
2. Configure fallback in deployment settings
3. Genie Nexus will automatically switch if one fails

## Next Steps

### Explore Advanced Features

- **Request/Response Transformation**: Modify requests and responses
- **Rate Limiting**: Control request rates per API key
- **Analytics**: Monitor usage and performance

## What's Next?

Now that you have Genie Nexus running, explore these topics:

1. **[Configuration Settings](/configuration/settings)** - Detailed configuration options
2. **[LLM Routing](/usage/llm-routing)** - Advanced LLM routing features
3. **[HTTP Proxying](/usage/http-proxying)** - HTTP request routing and transformation
4. **[API Keys](/usage/api-keys)** - Authentication and authorization
5. **[Production Deployment](/installation/production)** - Deploy to production

Congratulations! You now have a working Genie Nexus instance ready to route your AI and HTTP requests.
