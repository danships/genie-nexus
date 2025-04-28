import type { Response } from 'express';
import type { Tenant } from '@genie-nexus/database';

export function getTenantFromResponse(response: Response) {
  if (!response.locals['tenant']) {
    throw new Error('Tenant not found');
  }

  return response.locals['tenant'] as Tenant;
}
