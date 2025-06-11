---
title: "Settings"
description: "Configure Genie Nexus settings and environment variables"
---

# Configuration Settings

Genie Nexus can be configured through environment variables and the management interface. This guide covers all available configuration options.

## Environment Variables

### Core Settings

| Variable    | Default | Description                                      |
| ----------- | ------- | ------------------------------------------------ |
| `PORT`      | `3000`  | Port for the router server                       |
| `LOG_LEVEL` | `info`  | Logging level (`debug`, `info`, `warn`, `error`) |
| `DEBUG`     | `false` | Enable debug mode                                |

### Database Configuration

| Variable | Default              | Description                |
| -------- | -------------------- | -------------------------- |
| `DB`     | `sqlite://db.sqlite` | Database connection string |

#### Database Connection Strings

**SQLite:**

```bash
DB=sqlite:///path/to/database.sqlite
```

**MySQL:**

```bash
DB=mysql://username:password@host:port/database
```

### Authentication Settings

| Variable      | Default       | Description           |
| ------------- | ------------- | --------------------- |
| `AUTH_METHOD` | `credentials` | Authentication method |

#### Authentication Methods

- `none`: No authentication required, your Genie Nexus instance will be accessible to the public
- `credentials`: Require a username and password to access the management interface

## Runtime Configuration

### Management Interface

Access the management interface to configure:

1. **Providers**: Add and configure AI providers
2. **Deployments**: Create and manage routing deployments
3. **API Keys**: Generate and manage authentication keys
4. **Settings**: Update server configuration
