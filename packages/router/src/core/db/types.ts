import type { BaseEntity } from 'supersave';

export type OpenAIProvider = {
  type: 'openai';
  apiKey: string;
  baseURL: string;
};
export type StaticProvider = {
  type: 'static';
};

export interface BaseProvider extends BaseEntity {
  name: string;
  tenantId: string;
}

export type Provider = BaseProvider & (OpenAIProvider | StaticProvider);

export interface Deployment extends BaseEntity {
  name: string;
  model: string;
  tenantId: string;
  active: boolean;
  defaultProviderId: string;
}

type LlmApiKey = {
  type: 'llm-api-key';
  allowedDeployments: [];
};
type ManagementKey = {
  type: 'management-key';
  scopes: string[];
};

export interface SharedApiKey extends BaseEntity {
  label: string;
  tenantId: string;
  hash: string;
}
export type ApiKey = SharedApiKey & (LlmApiKey | ManagementKey);

export interface Tenant extends BaseEntity {
  name: string;
}

export interface Migration extends BaseEntity {
  version: string;
}
