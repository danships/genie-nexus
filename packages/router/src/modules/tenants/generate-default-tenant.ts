import type { Tenant } from '@genie-nexus/database';
import { DEFAULT_TENANT_ID } from './constants.js';

export function generateDefaultTenant(): Tenant {
  return {
    id: DEFAULT_TENANT_ID,
    name: 'Default',
  };
}
