import type { Request, Response } from 'express';
import z from 'zod';
import {
  generateLlmApiKey,
  generateManagementApiKey,
  generateWeaveApiKey,
} from '../generate-api-key.js';
import { getTenantFromResponse } from '../../tenants/get-tenant-from-response.js';

const requestSchema = z.object({
  label: z.string(),
  type: z.enum(['management-key', 'llm-api-key', 'weave-api-key']),
});

export async function createApiKey(req: Request, res: Response) {
  const { label, type } = requestSchema.parse(req.body);
  const tenant = getTenantFromResponse(res);

  let apiKey: string;
  switch (type) {
    case 'management-key': {
      apiKey = await generateManagementApiKey(tenant.id, label, []);
      break;
    }
    case 'llm-api-key': {
      apiKey = await generateLlmApiKey(tenant.id, label);
      break;
    }
    case 'weave-api-key': {
      apiKey = await generateWeaveApiKey(tenant.id, label);
      break;
    }
  }

  res.json({ data: { apiKey } });
}
