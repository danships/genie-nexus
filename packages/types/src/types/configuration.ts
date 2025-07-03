import type { DataWrapper } from './api.js';
import type { TenantApi } from './tenants.js';

export type ConfigurationResponse = DataWrapper<{
  tenant: TenantApi;
  defaultTenant: boolean;
  authentication: 'none' | 'credentials';
}>;

export type StoredConfiguration = {
  tenantId?: string;
  key: string;
  values: Record<string, string | boolean | number>;
};

/**
 * Configuration values specifically for the server.
 */
export type ServerConfiguration = {
  telemetryEnabled: boolean;
  registrationEnabled: boolean;
  identifier: string;
};

export type ServerConfigurationResponse = Omit<
  ServerConfiguration,
  'identifier'
>;
