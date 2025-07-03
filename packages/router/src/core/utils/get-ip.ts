import type { Request } from 'express';
import requestIp from 'request-ip';

export function getIp(req: Request): null | string {
  return requestIp.getClientIp(req);
}
