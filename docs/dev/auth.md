# Authentication Implementation

## Overview

The project implements authentication using NextAuth.js with a credentials-based authentication system. The implementation supports both authenticated and unauthenticated modes, configurable through environment variables.

## Authentication Methods

The system supports two authentication methods:

- `credentials`: Email/password based authentication
- `none`: No authentication required

## Key Components

### 1. Authentication Configuration

- Located in `lib/auth/next-auth.ts`
- Uses NextAuth.js for session management
- Configures custom pages for sign-in and sign-up
- Implements CSRF protection
- Uses secure cookie-based session storage

### 2. User Management

- User data is stored in the database using the NextAuthUser repository
- Password hashing is handled through the `saltAndHashPassword` utility
- Default tenant ID is set for new users

### 3. Authentication Flow

#### Sign Up

- Located in `app/sign-up/`
- Implements form validation for:
  - Name
  - Email
  - Password
  - Password confirmation
- Checks for existing users before registration
- Server-side action handles user creation

#### Sign In

- Located in `app/sign-in/`
- Implements email/password authentication
- Handles error states for invalid credentials
- Provides link to sign-up for new users

#### Sign Out

- Located in `app/sign-out/`
- Implements secure session termination
- Redirects to home page after sign-out

### 4. Protected Routes

- Uses `UserRequired` component to protect routes
- Automatically redirects to sign-in for unauthenticated users
- Supports both client and server-side protection

### 5. API Integration

- Server API calls include authentication cookies
- Handles 401 unauthorized responses
- Supports both authenticated and unauthenticated API calls

## Security Features

- CSRF protection for form submissions
- Secure password hashing
- Session-based authentication
- Protected API endpoints
- Secure cookie handling

## UI Components

- Error notifications for authentication failures
- Loading states during authentication
- Responsive design for authentication forms
- User avatar and settings in navigation

## Environment Configuration

Authentication can be configured through environment variables:

- `AUTH_METHOD`: Set to 'credentials' or 'none'
- `DB`: Database connection string for user storage

## Package Structure

### @auth Package

The project includes a dedicated `@auth` package that provides core authentication functionality:

- Password hashing utilities
- Authentication constants
- Shared authentication types
- Common authentication utilities

### Router Authentication

The router package (`@router`) implements API endpoint protection using NextAuth:

- Located in `packages/router/src/modules/auth/`
- Initializes default users based on configuration
- Creates a default user in development mode
- Handles authentication type configuration ('none' or 'credentials')

## Usage

To protect a route or component:

```tsx
<UserRequired>
  <ProtectedComponent />
</UserRequired>
```

To access authentication in server components:

```typescript
const { auth, signIn } = await getNextAuth();
const session = await auth();
```

To access authentication in client components:

```typescript
import { useSession } from 'next-auth/react';
const { data: session } = useSession();
```
