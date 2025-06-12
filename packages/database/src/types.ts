import type * as dbTypes from '@genie-nexus/types';
import type { BaseEntity } from 'supersave';

export interface LocalBaseEntity extends BaseEntity {
  id: string;
}

export type CollectionEntityWithTenantId = LocalBaseEntity & {
  tenantId: string;
};

export type Provider = dbTypes.Provider;

export type Deployment = dbTypes.Deployment;
export function isDeploymentLLM(
  deployment: Deployment
): deployment is dbTypes.DeploymentLLM {
  return deployment.type === 'llm';
}

export type ApiKey = dbTypes.ApiKey;

export type Tenant = dbTypes.Tenant;
export type WeaveFlow = dbTypes.WeaveFlow;

export interface Migration extends BaseEntity {
  version: string;
}

export type NextAuthUser = dbTypes.NextAuthUser;
