export type AuthMethod = 'credentials' | 'none';
export type DatabaseType = 'sqlite' | 'mysql';

export interface TestConfig {
  authMethod: AuthMethod;
  databaseType: DatabaseType;
  baseUrl: string;
}

export type AuthToken = string;
