import { TypeSymbols } from "@genie-nexus/container";
import type { Tenant, TenantRepository } from "@genie-nexus/database";
import { getContainer } from "@lib/core/get-container";
import { environment } from "@lib/environment";
import { TenantMissingError } from "./errors";
import { generateDefaultTenant } from "./generate-default-tenant";

export type GetTenantResult = {
  tenant: Tenant;
};

export async function getTenant(tenantId?: string): Promise<GetTenantResult> {
  if (!environment.MULTI_TENANT) {
    return { tenant: generateDefaultTenant() };
  }

  if (!tenantId) {
    throw new TenantMissingError();
  }

  const container = await getContainer();
  const tenantRepository = container.resolve<TenantRepository>(
    TypeSymbols.TENANT_REPOSITORY
  );

  const tenant = await tenantRepository.getById(tenantId);
  if (!tenant) {
    throw new TenantMissingError();
  }

  return { tenant };
}
