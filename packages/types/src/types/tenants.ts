import type { z } from 'zod';
import type {
  tenantSchema,
  nextAuthUserSchema,
  tenantSchemaApi,
} from '../schemas/tenants.js';

type WithId<T> = T & { id: string };
type DataWrapper<T> = { data: T };

// API Types (without id and tenantId)
export type TenantApi = WithId<z.infer<typeof tenantSchemaApi>>;

// DB Types (with id and tenantId)
export type Tenant = z.infer<typeof tenantSchema>;
export type NextAuthUser = z.infer<typeof nextAuthUserSchema>;

// Configuration response type
export type ConfigurationResponse = DataWrapper<{
  tenant: TenantApi;
  defaultTenant: boolean;
  authentication: 'none' | 'credentials';
}>;
