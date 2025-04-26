import type { Tenant } from '../../core/db/types';
import { DEFAULT_TENANT_ID } from './constants';

export function generateDefaultTenant(): Tenant {
  return {
    id: DEFAULT_TENANT_ID,
    name: 'Default',
  };
}
