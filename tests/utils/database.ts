import { getTestConfig } from './config.js';
import type { DatabaseType } from './types.js';

export function getDatabaseType(): DatabaseType {
  return getTestConfig().databaseType;
}

export function isMysqlDatabase(): boolean {
  return getDatabaseType() === 'mysql';
}

export function isSqliteDatabase(): boolean {
  return getDatabaseType() === 'sqlite';
}
