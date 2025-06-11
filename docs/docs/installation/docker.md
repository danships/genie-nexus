---
title: "Docker Installation"
description: "Install Genie Nexus using Docker"
sidebar_position: 2
---

# Docker Installation

Docker is the recommended way to install Genie Nexus as it provides a consistent environment and handles all dependencies automatically.

## Quick Start

Run Genie Nexus with a single Docker command:

```bash
docker run -p 3000:3000 ghcr.io/danships/genie-nexus:latest
```

This will start Genie Nexus on port 3000 with default settings.

## Configuration

### Environment Variables

You can configure Genie Nexus using environment variables:

```bash
docker run -p 3000:3000 \
  -e PORT=3000 \
  -e DB="sqlite:///data/db.sqlite" \
  -v genie-nexus-data:/data \
  ghcr.io/danships/genie-nexus:latest
```

For more details on the environment variables, see the [configuration settings](/configuration/settings) page.

### Persistent Data

To persist your data between container restarts, mount a volume:

```bash
docker run -p 3000:3000 \
  -v genie-nexus-data:/data \
  ghcr.io/danships/genie-nexus:latest
```

## Using MySQL

For production deployments, use MySQL instead of SQLite:

```bash
docker run -p 3000:3000 \
  -e DB="mysql://username:password@host:port/database" \
  ghcr.io/danships/genie-nexus:latest
```

## Health Check

Verify your installation is working:

```bash
curl http://localhost:3000/_health
```

You should see `OK` as the response.

## Next Steps

1. **Access the management interface** at `http://localhost:3000`
2. **Configure your first provider** in the Providers section
3. **Create API keys** for authentication
4. **Set up your first deployment** to start routing requests

## Troubleshooting

### Container Won't Start

Check the logs:

```bash
docker logs <container-id>
```

### Port Already in Use

Change the port mapping:

```bash
docker run -p 3001:3000 ghcr.io/danships/genie-nexus:latest
```

### Database Connection Issues

Ensure your database is accessible and the connection string is correct.
