import type { LocalBaseEntity } from '@genie-nexus/database';
import { serverLogger } from '@lib/core/server-logger';
import 'server-only';

const COLLECTION_API_URL = process.env['NEXT_PUBLIC_API_BASE_URL'];

export async function getEntity<T extends LocalBaseEntity>(
  collection: string,
  id: string,
) {
  // TODO add the auth details / cookie here
  const response = await fetch(
    `${COLLECTION_API_URL}/collections/${collection}/${id}`,
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
