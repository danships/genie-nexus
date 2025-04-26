import type { Response } from 'express';
import type { Tenant } from '../../core/db/types';

export function getTenantFromResponse(response: Response) {
  if (!response.locals['tenant']) {
    throw new Error('Tenant not found');
  }

  return response.locals['tenant'] as Tenant;
}
