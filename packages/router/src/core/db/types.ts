import type { BaseEntity } from 'supersave';

interface LocalBaseEntity extends BaseEntity {
  id: string;
}

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

interface BaseProvider extends LocalBaseEntity {
  name: string;
  tenantId: string;
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
};

interface BaseDeployment extends LocalBaseEntity {
  name: string;
  model: string;
  tenantId: string;
  active: boolean;
  defaultProviderId: string;
}
export type Deployment = BaseDeployment & (DeploymentLLM | DeploymentWeave);

type LlmApiKey = {
  type: 'llm-api-key';
  allowedDeployments: [];
};
type ManagementKey = {
  type: 'management-key';
  scopes: string[];
};
type WeaveApiKey = {
  type: 'weave-api-key';
  allowedDeployments: [];
};

export interface SharedApiKey extends BaseEntity {
  label: string;
  tenantId: string;
  hash: string;
}
export type ApiKey = SharedApiKey & (LlmApiKey | ManagementKey | WeaveApiKey);

export interface Tenant extends BaseEntity {
  name: string;
}

export interface Migration extends BaseEntity {
  version: string;
}
