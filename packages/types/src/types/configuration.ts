import type { DataWrapper } from './api.js';
import type { TenantApi } from './tenants.js';

export type ConfigurationResponse = DataWrapper<{
  tenant: TenantApi;
  defaultTenant: boolean;
  authentication: 'none' | 'credentials';
}>;
