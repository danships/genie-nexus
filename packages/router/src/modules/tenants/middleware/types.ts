import type { Tenant } from '@genie-nexus/database';
import type { Request } from 'express';

export type ResponseLocalsTenant = {
  tenant: Tenant;
};

export type RequestParamTenantId = {
  tenantId: string;
};

export function requestHasParamTenantId(
  req: Request<unknown, unknown>,
): req is Request<RequestParamTenantId> {
  return (
    req.params !== null &&
    typeof req.params === 'object' &&
    'tenantId' in req.params &&
    typeof req.params.tenantId === 'string'
  );
}
