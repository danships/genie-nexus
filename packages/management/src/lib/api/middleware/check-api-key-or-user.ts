import type { ApiKey } from "@genie-nexus/database";
import { environment } from "@lib/environment";
import { getNextAuth } from "@lib/auth/next-auth";
import { type CheckApiKeyResult, checkApiKey } from "./check-api-key";
import { API_KEY_PREFIX } from "./constants";
import { ApplicationError } from "./errors";

export type CheckApiKeyOrUserResult =
  | { type: "apiKey"; apiKey: ApiKey }
  | { type: "user" }
  | { type: "none" };

export async function checkApiKeyOrUser(
  request: Request,
  apiKeyType: ApiKey["type"]
): Promise<CheckApiKeyOrUserResult> {
  if (environment.AUTH_METHOD === "none") {
    return { type: "none" };
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader?.toLowerCase().startsWith(API_KEY_PREFIX)) {
    const result: CheckApiKeyResult = await checkApiKey(request, apiKeyType);
    return { type: "apiKey", apiKey: result.apiKey };
  }

  const { auth } = await getNextAuth();
  const session = await auth();

  if (!session?.user) {
    throw new ApplicationError("Unauthorized", 401);
  }

  return { type: "user" };
}
