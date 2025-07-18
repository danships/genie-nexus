import type { AuthToken } from './types.js';

// Global token storage for sharing between UI and API tests
let globalAuthToken: AuthToken | null = null;

export function setGlobalAuthToken(token: AuthToken): void {
  globalAuthToken = token;
}

export function getGlobalAuthToken(): AuthToken | null {
  return globalAuthToken;
}

export function clearGlobalAuthToken(): void {
  globalAuthToken = null;
}

export function extractTokenFromCookies(cookies: string[]): AuthToken | null {
  const sessionCookie = cookies.find((cookie) =>
    cookie.includes('genie-nexus.st')
  );

  if (!sessionCookie) {
    return null;
  }

  const tokenMatch = sessionCookie.match(/genie-nexus\.st=([^;]+)/);
  if (tokenMatch && tokenMatch[1]) {
    return tokenMatch[1];
  }

  return null;
}
