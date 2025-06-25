import type { z } from 'zod';
import type {
  nextAuthUserSchema,
  tenantSchema,
  tenantSchemaApi,
} from '../schemas/tenants.js';
import type { WithId } from './api.js';

// API Types (without id and tenantId)
export type TenantApi = WithId<z.infer<typeof tenantSchemaApi>>;

// DB Types (with id and tenantId)
export type Tenant = z.infer<typeof tenantSchema>;
export type NextAuthUser = z.infer<typeof nextAuthUserSchema>;
