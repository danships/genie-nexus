---
title: "Analytics & Monitoring"
description: "Monitor usage, performance, and costs across your Genie Nexus deployment"
sidebar_position: 3
---

# Analytics & Monitoring

:::warning

This feature is still a work in progress and not yet available in the latest version of Genie Nexus.

:::

Genie Nexus provides comprehensive analytics and monitoring capabilities to help you track usage, performance, and costs across your deployments. This guide covers all aspects of monitoring and analytics.

## Overview

Analytics and monitoring in Genie Nexus enable you to:

- **Track Usage**: Monitor API calls, token usage, and request patterns
- **Monitor Performance**: Track response times, success rates, and error rates
- **Control Costs**: Monitor spending and set budget alerts
- **Debug Issues**: Analyze logs and trace request flows
- **Optimize Resources**: Identify bottlenecks and optimization opportunities
- **Ensure Reliability**: Monitor uptime and availability

## Key Metrics

### Request Metrics

- **Total Requests**: Total number of requests processed
- **Requests per Minute**: Current request rate
- **Success Rate**: Percentage of successful requests
- **Error Rate**: Percentage of failed requests
- **Response Time**: Average, median, and P95 response times

### LLM-Specific Metrics

- **Token Usage**: Total tokens consumed (prompt + completion)
- **Cost per Request**: Estimated cost per API call
- **Model Distribution**: Usage across different models
- **Streaming vs Non-streaming**: Ratio of streaming requests

### HTTP-Specific Metrics

- **Throughput**: Requests per second
- **Bandwidth**: Data transferred
- **Cache Hit Rate**: Percentage of cached responses
- **Load Balancer Distribution**: Request distribution across backends
