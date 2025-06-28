import { z } from 'zod';

export const baseEntitySchema = z.object({
  id: z.string(),
});

export const entityWithTenantIdSchema = baseEntitySchema.extend({
  tenantId: z.string(),
});
