---
title: "LLM Routing"
description: "Route requests to different LLM providers with intelligent fallback and optimization"
sidebar_position: 1
---

# LLM Routing

Genie Nexus provides powerful LLM routing capabilities that allow you to seamlessly work with multiple AI providers through a unified OpenAI-compatible API. This guide covers all aspects of LLM routing, from basic setup to advanced features.

## Overview

LLM routing in Genie Nexus enables you to:

- **Unified API**: Use OpenAI-compatible endpoints for all providers
- **Provider Abstraction**: Switch between providers without code changes
- **Intelligent Fallback**: Automatically failover when providers are unavailable
- **Request Optimization**: Batch requests and optimize token usage
- **Cost Management**: Track and control spending across providers
- **Response Streaming**: Support both streaming and non-streaming responses

## Supported Providers

- Anthropic
- CloudRift
- Google Studio AI
- Google Vertex AI
- Groq
- Inference Net
- Kluster AI
- Mistral
- OpenAI
- Together AI
- xAI

:::note

Any other OpenAI-compatible provider is supported, just configure it as a provider and use it in a deployment.

:::

### Static Responses

A static response can be configured to test your deployments or for development purposes.
Your request will not leave the Genie Nexus platform and no costs will be incurred.
