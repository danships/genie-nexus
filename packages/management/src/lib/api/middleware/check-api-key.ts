import { TypeSymbols } from "@genie-nexus/container";
import type { ApiKey, ApiKeyRepository } from "@genie-nexus/database";
import type { Logger } from "@genie-nexus/logger";
import { getContainer } from "@lib/core/get-container";
import { breakDownApiKey } from "./break-down-api-key";
import { API_KEY_SILENT_LLM_PREFIX } from "./constants";
import {
  ApiKeyNotPresentError,
  ApiKeyValidationError,
  ValidationError,
} from "./errors";
import { validateApiKey } from "./validate-api-key";

export type CheckApiKeyResult = {
  apiKey: ApiKey;
};

export async function checkApiKey(
  request: Request,
  type: ApiKey["type"]
): Promise<CheckApiKeyResult> {
  const container = await getContainer();
  const logger = container.resolve<Logger>(TypeSymbols.LOGGER);
  const apiKeyRepository = container.resolve<ApiKeyRepository>(
    TypeSymbols.API_KEY_REPOSITORY
  );

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiKeyNotPresentError("Missing or invalid Authorization header");
  }

  let apiKeyValue = authHeader.substring("Bearer ".length);
  if (apiKeyValue.startsWith(API_KEY_SILENT_LLM_PREFIX)) {
    apiKeyValue = apiKeyValue.substring(API_KEY_SILENT_LLM_PREFIX.length);
  }

  try {
    const { keyId, keySecret } = breakDownApiKey(apiKeyValue);

    const storedApiKey = await apiKeyRepository.getById(keyId);
    if (!storedApiKey || storedApiKey.type !== type) {
      logger.warning("Stored api key not found, or no matching type.", {
        type: storedApiKey?.type,
        expected: type,
      });
      throw new ApiKeyValidationError("Invalid API key");
    }

    const validApiKey = await validateApiKey(
      keyId,
      storedApiKey.hash,
      keySecret
    );
    if (!validApiKey) {
      logger.warning("API Key validation failed.");
      throw new ApiKeyValidationError("Invalid API key");
    }

    return { apiKey: storedApiKey };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApiKeyValidationError("Invalid API key");
    }
    if (
      error instanceof ApiKeyValidationError ||
      error instanceof ApiKeyNotPresentError
    ) {
      throw error;
    }
    logger.warning("API Key validation failed because of an unknown error.", {
      error: error instanceof Error ? error.message : `${error}`,
    });
    throw error;
  }
}
