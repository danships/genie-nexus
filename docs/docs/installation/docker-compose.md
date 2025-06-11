---
title: "Docker Compose Installation"
description: "Install Genie Nexus using Docker Compose for complete setup"
sidebar_position: 3
---

# Docker Compose Installation

Docker Compose is perfect for development environments or when you need to run Genie Nexus with additional services like databases, monitoring, or other applications.

## Basic Setup

Create a `docker-compose.yml` file:

```yaml
services:
  genie-nexus:
    image: ghcr.io/danships/genie-nexus:latest
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - DB=sqlite:///data/db.sqlite
      - LOG_LEVEL=info
    volumes:
      - genie-nexus-data:/data
    restart: unless-stopped

volumes:
  genie-nexus-data:
```

Start the services:

```bash
docker-compose up -d
```

## Production Setup with MySQL

For production environments, use MySQL for better performance and reliability:

```yaml
services:
  genie-nexus:
    image: ghcr.io/danships/genie-nexus:latest
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - DB=mysql://genie_nexus:secure_password@mysql:3306/genie_nexus
    depends_on:
      mysql:
        condition: service_healthy
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root_password
      - MYSQL_DATABASE=genie_nexus
      - MYSQL_USER=genie_nexus
      - MYSQL_PASSWORD=secure_password
    volumes:
      - mysql-data:/var/lib/mysql
    ports:
      - "3306:3306"
    restart: unless-stopped

volumes:
  mysql-data:
```

**Obviously, you need to change the passwords and database name to your own.**

For more details on the environment variables, see the [configuration settings](/configuration/settings) page.

## Management Commands

### Start Services

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs genie-nexus

# Follow logs
docker-compose logs -f genie-nexus
```

### Update Services

```bash
docker-compose pull
docker-compose up -d
```

### Backup Data

```bash
# Backup MySQL
docker-compose exec mysql mysqldump -u root -p genie_nexus > backup.sql

# Backup volumes
docker run --rm -v genie-nexus_data:/data -v $(pwd):/backup alpine tar czf /backup/genie-nexus-backup.tar.gz /data
```

## Health Checks

Add health checks to ensure services are running properly:

```yaml
services:
  genie-nexus:
    image: ghcr.io/danships/genie-nexus:latest
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/_health"]
      interval: 30s
      timeout: 10s
      retries: 3
    # ... other configuration
```

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Check service status
docker-compose ps
```

### Database Connection Issues

```bash
# Test MySQL connection
docker-compose exec mysql mysql -u root -p -e "SHOW DATABASES;"
```
