import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';
import { createPool } from 'mysql2/promise';

let auth: ReturnType<typeof betterAuth>;

export type Configuration = {
  authenticationMethod: 'credentials';
  defaultTenantId: string;
  debug?: boolean;
  connectionString: string;
};

function getDatabaseForConnectionString(connectionString: string) {
  if (connectionString.startsWith('sqlite://')) {
    const file = connectionString.slice(9);
    return new Database(file);
  }
  if (connectionString.startsWith('mysql://')) {
    return createPool(connectionString);
  }
  throw new Error('Unsupported connection string');
}

function createAuth({ connectionString }: Configuration) {
  return betterAuth({
    // database: superSaveAdapter({ superSave, debugLogs: debug ?? false }),
    database: getDatabaseForConnectionString(connectionString),
    emailAndPassword: {
      enabled: true,
    },
  });
}

export function isInitialized() {
  return auth !== undefined;
}

export function getAuth(configuration?: Configuration) {
  if (auth) {
    return auth;
  }

  if (!configuration) {
    throw new Error(
      'No configuration provided while auth was not initialized.',
    );
  }
  auth = createAuth(configuration);

  return auth;
}
