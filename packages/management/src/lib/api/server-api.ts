import { COOKIE_NAME } from '@genie-nexus/auth';
import type { LocalBaseEntity } from '@genie-nexus/database';
import type { ConfigurationResponse } from '@genie-nexus/types';
import { getAuthMethod } from '@lib/auth/get-auth-method';
import { getNextAuth } from '@lib/auth/next-auth';
import { serverLogger } from '@lib/core/server-logger';
import { cookies } from 'next/headers';
import 'server-only';

const COLLECTION_API_URL = process.env['NEXT_PUBLIC_API_BASE_URL'];

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
  id: string,
) {
  const response = await fetch(
    `${COLLECTION_API_URL}/collections/${collection}/${id}`,
    await getCookieHeaders(),
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

export async function getEntities<T extends LocalBaseEntity>(
  collection: string,
  query: string,
) {
  const response = await fetch(
    `${COLLECTION_API_URL}/collections/${collection}?${query}`,
    await getCookieHeaders(),
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
    `${COLLECTION_API_URL}/configuration`,
    await getCookieHeaders(),
  );
  if (!configurationResponse.ok) {
    if (configurationResponse.status === 401) {
      serverLogger.info('Unauthorized to fetch server configuration.');
      const { signIn } = await getNextAuth();
      await signIn();
    }
    serverLogger.warn('Could not retrieve server configuration.');
    throw new Error('Failed to fetch server configuration.');
  }

  const data = (await configurationResponse.json()) as ConfigurationResponse;
  return data.data;
}
