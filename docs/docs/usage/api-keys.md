---
title: "API Keys"
description: "Generate and manage API keys for authentication and authorization"
sidebar_position: 4
---

# API Keys

API keys are the primary authentication mechanism in Genie Nexus. This guide covers creating, managing, and securing API keys for different types of access and permissions.

## Overview

API keys in Genie Nexus enable you to:

- **Authenticate Requests**: Verify the identity of API clients
- **Control Access**: Restrict access to specific deployments and resources
- **Track Usage**: Monitor API usage and performance per key
- **Manage Permissions**: Set granular permissions for different operations
- **Enforce Rate Limits**: Control request rates per API key
- **Audit Activity**: Track all requests made with each key

::: note

The first 2 features are currently available, the other features are still a work in progress.

:::

## API Key Types

### Management Keys

- **Purpose**: Administrative access to Genie Nexus
- **Permissions**: Full access to all resources
- **Use Cases**: Configuration, monitoring, user management

### LLM API Keys

- **Purpose**: Access to LLM deployments
- **Permissions**: Chat completions, model access
- **Use Cases**: AI applications, chat services
- **Scope**: Specific LLM deployments and models

### Weave API Keys

- **Purpose**: Access to HTTP deployments
- **Permissions**: HTTP request routing, API proxying
- **Use Cases**: API gateways, microservices
- **Scope**: Specific HTTP deployments and endpoints

## Creating API Keys

These can be generated via the web interface.
