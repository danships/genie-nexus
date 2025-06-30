import { COOKIE_NAME } from '@genie-nexus/auth';
import { TypeSymbols } from '@genie-nexus/container';
import type { LocalBaseEntity } from '@genie-nexus/database';
import type { Logger } from '@genie-nexus/logger';
import type { ConfigurationResponse } from '@genie-nexus/types';
import { getAuthMethod } from '@lib/auth/get-auth-method';
import { getNextAuth } from '@lib/auth/next-auth';
import { getContainer } from '@lib/core/get-container';
import { environment } from '@lib/environment';
import { cookies } from 'next/headers';
import 'server-only';

const API_URL_PREFIX = `${environment.HOST_PREFIX}/api/v1`;

const serverLogger = (await getContainer()).resolve<Logger>(TypeSymbols.LOGGER);

export async function getResponseFromApi<T>(path: string): Promise<T> {
  const response = await fetch(
    `${API_URL_PREFIX}${path}`,
    await getCookieHeaders()
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch from API: ${response.statusText}`);
  }
  const parsedResponse = await response.json();
  if ('data' in parsedResponse) {
    return parsedResponse.data as T;
  }
  return parsedResponse as T;
}

async function getCookieHeaders() {
  if ((await getAuthMethod()) === 'none') {
    return {};
  }

  const requestCookies = await cookies();
  const nextAuthCookie = requestCookies.get(COOKIE_NAME);

  if (!nextAuthCookie) {
    return {};
  }

  return {
    headers: {
      Cookie: `${COOKIE_NAME}=${nextAuthCookie.value}`,
    },
  };
}

export async function getEntity<T extends LocalBaseEntity>(
  collection: string,
  id: string
) {
  const response = await fetch(
    `${API_URL_PREFIX}/collections/${collection}/${id}`,
    await getCookieHeaders()
  );
  if (!response.ok) {
    serverLogger.error(`Failed to fetch entities: ${response.statusText}`, {
      response: await response.text(),
    });
    throw new Error(`Failed to fetch entity: ${response.statusText}`);
  }
  const data = (await response.json()) as { data: T };

  return data.data;
}

export async function createEntity<T, R>(collection: string, flow: T) {
  const cookieHeaders = await getCookieHeaders();

  const response = await fetch(`${API_URL_PREFIX}/collections/${collection}`, {
    method: 'POST',
    headers: {
      ...cookieHeaders.headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flow),
  });
  if (!response.ok) {
    serverLogger.error(`Failed to create entity: ${response.statusText}`, {
      response: await response.text(),
    });
    throw new Error(`Failed to create entity: ${response.statusText}`);
  }

  const data = (await response.json()) as { data: R };
  return data.data;
}

export async function getEntityByQuery<T extends LocalBaseEntity>(
  collection: string,
  query: string
) {
  const response = await fetch(
    `${API_URL_PREFIX}/collections/${collection}?${query}`,
    await getCookieHeaders()
  );
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    serverLogger.error(`Failed to fetch entity: ${response.statusText}`, {
      response: await response.text(),
    });
    throw new Error(`Failed to fetch entity: ${response.statusText}`);
  }
  const data = (await response.json()) as { data: T[] };
  if (data.data.length === 0) {
    return null;
  }
  return data.data[0] ?? null;
}

export async function getEntities<T extends LocalBaseEntity>(
  collection: string,
  query: string
) {
  const response = await fetch(
    `${API_URL_PREFIX}/collections/${collection}?${query}`,
    await getCookieHeaders()
  );
  if (!response.ok) {
    serverLogger.error(`Failed to fetch entities: ${response.statusText}`, {
      response: await response.text(),
    });

    throw new Error(`Failed to fetch entities: ${response.statusText}`);
  }
  const data = (await response.json()) as { data: T[] };

  return data.data;
}

export async function getConfiguration(): Promise<
  ConfigurationResponse['data']
> {
  const configurationResponse = await fetch(
    `${API_URL_PREFIX}/configuration`,
    await getCookieHeaders()
  );
  if (!configurationResponse.ok) {
    if (configurationResponse.status === 401) {
      serverLogger.info('Unauthorized to fetch server configuration.');
      const { signIn } = await getNextAuth();
      await signIn();
    }
    serverLogger.warning('Could not retrieve server configuration.');
    throw new Error('Failed to fetch server configuration.');
  }

  const data = (await configurationResponse.json()) as ConfigurationResponse;
  return data.data;
}
