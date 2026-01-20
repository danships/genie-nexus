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

const COLLECTION_NAME_ALIASES: Record<string, CollectionName> = {
  providers: "provider",
  deployments: "deployment",
  apikeys: "apiKey",
  tenants: "tenant",
  weaveflows: "weaveflow",
  llmflows: "llmflow",
  storedconfigurations: "storedconfiguration",
};

export function normalizeCollectionName(name: string): CollectionName | null {
  const lowercased = name.toLowerCase();
  if (lowercased in COLLECTION_MAP) {
    return lowercased as CollectionName;
  }
  return COLLECTION_NAME_ALIASES[lowercased] ?? null;
}
