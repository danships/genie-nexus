import type { ConfigurationResponse } from '@genie-nexus/types';
import { getAppVersion } from '@lib/api/get-app-version';
import { checkApiKeyOrUser } from '@lib/api/middleware/check-api-key-or-user';
import { DEFAULT_TENANT_ID } from '@lib/api/middleware/constants';
import { ApplicationError } from '@lib/api/middleware/errors';
import { getTenant } from '@lib/api/middleware/get-tenant';
import { handleApiError } from '@lib/api/middleware/handle-api-error';
import { environment } from '@lib/environment';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await checkApiKeyOrUser(request, 'management-key');
    const { tenant } = await getTenant();
    const appInfo = await getAppVersion();

    return NextResponse.json({
      data: {
        tenant,
        defaultTenant: tenant.id === DEFAULT_TENANT_ID,
        authentication: environment.AUTH_METHOD,
        version: appInfo.version,
      },
    } satisfies ConfigurationResponse);
  } catch (error) {
    if (error instanceof ApplicationError) {
      return handleApiError(error);
    }
    throw error;
  }
}
