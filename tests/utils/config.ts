import type { TestConfig } from './types.js';

export function getTestConfig(): TestConfig {
  const authMethod =
    (process.env['AUTH_METHOD'] as 'credentials' | 'none') || 'credentials';
  const databaseType = process.env['DB']?.startsWith('mysql')
    ? 'mysql'
    : 'sqlite';
  const baseUrl = process.env['TEST_BASE_URL'] || 'http://localhost:3000';

  return {
    authMethod,
    databaseType,
    baseUrl,
  };
}

export function shouldRunAuthTests(): boolean {
  return getTestConfig().authMethod === 'credentials';
}

export function shouldRunNoAuthTests(): boolean {
  return getTestConfig().authMethod === 'none';
}

export function shouldRunMysqlTests(): boolean {
  return getTestConfig().databaseType === 'mysql';
}

export function shouldRunSqliteTests(): boolean {
  return getTestConfig().databaseType === 'sqlite';
}
