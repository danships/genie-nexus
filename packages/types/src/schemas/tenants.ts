import { z } from 'zod';

// Base schemas
const baseEntitySchema = z.object({
  id: z.string(),
});

const entityWithTenantIdSchema = baseEntitySchema.extend({
  tenantId: z.string(),
});

// API Tenant schema (without id)
export const tenantSchemaApi = z.object({
  name: z.string(),
});

// DB Tenant and User schemas (with id and tenantId)
export const tenantSchema = baseEntitySchema.extend({
  name: z.string(),
});

export const nextAuthUserSchema = entityWithTenantIdSchema.extend({
  email: z.string().email(),
  password: z.string(),
  name: z.string().optional().nullable(),
  created: z.string().datetime(),
  lastLogin: z.string().datetime().nullable(),
});
