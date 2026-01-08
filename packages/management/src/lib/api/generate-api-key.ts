import "server-only";
import crypto from "node:crypto";
import { TypeSymbols } from "@genie-nexus/container";
import type { ApiKey, ApiKeyRepository } from "@genie-nexus/database";
import type {
  LlmApiKey,
  ManagementApiKey,
  WeaveApiKey,
} from "@genie-nexus/types";
import * as argon2 from "argon2";
import { getContainer } from "@lib/core/get-container";
import {
  API_KEY_PREFIX,
  API_KEY_SILENT_LLM_PREFIX,
  ID_SEPARATOR,
} from "./middleware/constants";

const KEY_PREVIEW_LENGTH = 12;

type ApiKeyGenerationResult = {
  secret: string;
  hash: string;
};

async function generateApiKeySecret(
  id: string
): Promise<ApiKeyGenerationResult> {
  const secret = crypto.randomBytes(32).toString("hex");
  const hash = await argon2.hash(`${secret}${id}`, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
    hashLength: 32,
  });

  return { secret, hash };
}

async function generateApiKeyHelper(
  apiKeyToCreate: Omit<ApiKey, "id">,
  keyPrefix = ""
): Promise<string> {
  const container = await getContainer();
  const apiKeyRepository = container.resolve<ApiKeyRepository>(
    TypeSymbols.API_KEY_REPOSITORY
  );

  const createdApiKey = await apiKeyRepository.create(apiKeyToCreate);

  const { secret, hash } = await generateApiKeySecret(createdApiKey.id ?? "");
  const generatedApiKey = `${keyPrefix}${API_KEY_PREFIX}${createdApiKey.id}${ID_SEPARATOR}${secret}`;

  await apiKeyRepository.update({
    ...createdApiKey,
    hash,
    keyPreview: generatedApiKey.slice(0, KEY_PREVIEW_LENGTH),
  });

  return generatedApiKey;
}

export function generateLlmApiKey(
  tenantId: string,
  label: string,
  allowedDeployments?: string[]
) {
  const apiKeyToCreate: Omit<LlmApiKey, "id"> = {
    tenantId,
    label,
    active: true,
    type: "llm-api-key",
    hash: "",
    keyPreview: "",
    createdAt: new Date().toISOString(),
  };
  if (allowedDeployments) {
    apiKeyToCreate.allowedDeployments = allowedDeployments;
  }

  return generateApiKeyHelper(apiKeyToCreate, API_KEY_SILENT_LLM_PREFIX);
}

export function generateWeaveApiKey(
  tenantId: string,
  label: string,
  allowedDeployments?: string[]
) {
  const apiKeyToCreate: Omit<WeaveApiKey, "id"> = {
    tenantId,
    label,
    active: true,
    type: "weave-api-key",
    hash: "",
    keyPreview: "",
    createdAt: new Date().toISOString(),
  };
  if (allowedDeployments) {
    apiKeyToCreate.allowedDeployments = allowedDeployments;
  }

  return generateApiKeyHelper(apiKeyToCreate);
}

export function generateManagementApiKey(
  tenantId: string,
  label: string,
  scopes: string[]
): Promise<string> {
  const apiKeyToCreate: Omit<ManagementApiKey, "id"> = {
    tenantId,
    label,
    active: true,
    type: "management-key",
    hash: "",
    keyPreview: "",
    scopes,
    createdAt: new Date().toISOString(),
  };

  return generateApiKeyHelper(apiKeyToCreate);
}
