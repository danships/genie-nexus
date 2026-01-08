import { TypeSymbols } from "@genie-nexus/container";

export const COLLECTION_MAP = {
  provider: TypeSymbols.PROVIDER_REPOSITORY,
  deployment: TypeSymbols.DEPLOYMENT_REPOSITORY,
  apiKey: TypeSymbols.API_KEY_REPOSITORY,
  tenant: TypeSymbols.TENANT_REPOSITORY,
  weaveflow: TypeSymbols.WEAVE_FLOW_REPOSITORY,
  llmflow: TypeSymbols.LLM_FLOW_REPOSITORY,
  storedconfiguration: TypeSymbols.STORED_CONFIGURATION_REPOSITORY,
} as const;

export type CollectionName = keyof typeof COLLECTION_MAP;

export function isValidCollection(name: string): name is CollectionName {
  return name in COLLECTION_MAP;
}
