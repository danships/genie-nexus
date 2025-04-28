import type { BaseEntity } from 'supersave';

export interface LocalBaseEntity extends BaseEntity {
  id: string;
}

export type CollectionEntityWithTenantId = LocalBaseEntity & {
  tenantId: string;
};

export type OpenAIProvider = {
  type: 'openai';
  apiKey: string;
  baseURL: string;
};
export type StaticLlmProvider = {
  type: 'static';
};

export type HeaderDefinition = {
  key: string;
  operation: 'set' | 'add' | 'remove';
  value?: string;
};

export type WeaveHttpProxyProvider = {
  type: 'http-proxy';
  baseUrl: string;
  requestHeaders?: HeaderDefinition[];
  responseHeaders?: HeaderDefinition[];
};
export type WeaveHttpStaticProvider = {
  type: 'http-static';
  requestHeaders?: HeaderDefinition[];
  responseHeaders?: HeaderDefinition[];
  body?: string;
  statusCode?: number;
};

interface BaseProvider extends CollectionEntityWithTenantId {
  name: string;
}

export type Provider = BaseProvider &
  (
    | OpenAIProvider
    | StaticLlmProvider
    | WeaveHttpProxyProvider
    | WeaveHttpStaticProvider
  );

export type DeploymentLLM = {
  type: 'llm';
  model: string;
};
export type DeploymentWeave = {
  type: 'weave';
  requiresApiKey: boolean;
  supportedMethods?: Array<
    'get' | 'post' | 'put' | 'delete' | 'patch' | 'options'
  >;
  allowedDeployments?: string[];
};

interface BaseDeployment extends CollectionEntityWithTenantId {
  name: string;
  model: string;
  active: boolean;
  defaultProviderId: string;
}
export type Deployment = BaseDeployment & (DeploymentLLM | DeploymentWeave);

type LlmApiKey = {
  type: 'llm-api-key';
  allowedDeployments: string[];
};
type ManagementKey = {
  type: 'management-key';
  scopes: string[];
};
type WeaveApiKey = {
  type: 'weave-api-key';
  allowedDeployments: [];
};

export interface SharedApiKey extends CollectionEntityWithTenantId {
  label: string;
  hash: string;
}
export type ApiKey = SharedApiKey & (LlmApiKey | ManagementKey | WeaveApiKey);

export interface Tenant extends LocalBaseEntity {
  name: string;
}

export interface Migration extends BaseEntity {
  version: string;
}

export type NextAuthUser = LocalBaseEntity & {
  email: string;
  password: string;
  name?: string;
  created: string;
  lastLogin: string | null;
};
