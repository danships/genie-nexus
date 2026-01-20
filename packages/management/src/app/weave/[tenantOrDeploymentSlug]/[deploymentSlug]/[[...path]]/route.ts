import { TypeSymbols } from '@genie-nexus/container';
import type { TenantRepository } from '@genie-nexus/database';
import { getContainer } from '@lib/core/get-container';
import { handleWeaveProxy } from '@lib/weave/handlers/weave-proxy';
import { NextResponse } from 'next/server';

async function handleRequest(
  request: Request,
  context: {
    params: Promise<{
      tenantOrDeploymentSlug: string;
      deploymentSlug: string;
      path?: string[];
    }>;
  }
) {
  const params = await context.params;
  const { tenantOrDeploymentSlug: tenantPath, deploymentSlug, path } = params;

  const container = await getContainer();
  const tenantRepository = container.resolve<TenantRepository>(
    TypeSymbols.TENANT_REPOSITORY
  );

  const tenant = await tenantRepository.getById(tenantPath);
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  }

  const fullPath = path ? `/${path.join('/')}` : '/';

  return handleWeaveProxy(request, {
    tenantId: tenantPath,
    deploymentSlug,
    path: fullPath,
  });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const OPTIONS = handleRequest;
export const HEAD = handleRequest;
