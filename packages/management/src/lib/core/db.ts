import {
  getDB as getGenieNexusDB,
  getNextAuthUserRepository as getGenieNexusNextAuthUserRepository,
  initialize,
} from '@genie-nexus/database';
import { environment } from '@lib/environment';

let initialized = false;
let initializing: Promise<unknown> | null = null;

export async function getDb() {
  if (initializing) {
    await initializing;
  }

  if (initialized) {
    return getGenieNexusDB();
  }

  initializing = initialize({
    connectionString: environment.DB,
    executeMigrations: false,
  });
  await initializing;
  initialized = true;
  initializing = null;
  return getDb();
}

export async function getNextAuthUserRepository() {
  await getDb();
  return getGenieNexusNextAuthUserRepository();
}
