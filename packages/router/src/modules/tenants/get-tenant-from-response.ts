import type { Tenant } from '@genie-nexus/database';
import type { Response } from 'express';

export function getTenantFromResponse(response: Response) {
  if (!response.locals['tenant']) {
    throw new Error('Tenant not found');
  }

  return response.locals['tenant'] as Tenant;
}
