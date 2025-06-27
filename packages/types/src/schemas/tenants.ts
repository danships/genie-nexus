import { z } from 'zod';
import { baseEntitySchema, entityWithTenantIdSchema } from './shared.js';

// API Tenant schema (without id)
export const tenantSchemaApi = z.object({
  name: z.string(),
  createdAt: z.string().datetime(),
});

// DB Tenant and User schemas (with id and tenantId)
export const tenantSchema = baseEntitySchema.extend({
  name: z.string(),
  createdAt: z.string().datetime(),
});

export const nextAuthUserSchema = entityWithTenantIdSchema.extend({
  email: z.string().email(),
  password: z.string(),
  name: z.string().optional().nullable(),
  created: z.string().datetime(),
  lastLogin: z.string().datetime().nullable(),
});
