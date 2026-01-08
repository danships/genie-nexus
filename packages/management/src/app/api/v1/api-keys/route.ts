import {
  generateLlmApiKey,
  generateManagementApiKey,
  generateWeaveApiKey,
} from "@lib/api/generate-api-key";
import { checkApiKeyOrUser } from "@lib/api/middleware/check-api-key-or-user";
import { ApplicationError } from "@lib/api/middleware/errors";
import { getTenant } from "@lib/api/middleware/get-tenant";
import { handleApiError } from "@lib/api/middleware/handle-api-error";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  label: z.string(),
  type: z.enum(["management-key", "llm-api-key", "weave-api-key"]),
});

export async function POST(request: Request) {
  try {
    await checkApiKeyOrUser(request, "management-key");
    const { tenant } = await getTenant();

    const body = await request.json();
    const { label, type } = requestSchema.parse(body);

    let apiKey: string;
    switch (type) {
      case "management-key": {
        apiKey = await generateManagementApiKey(tenant.id, label, []);
        break;
      }
      case "llm-api-key": {
        apiKey = await generateLlmApiKey(tenant.id, label);
        break;
      }
      case "weave-api-key": {
        apiKey = await generateWeaveApiKey(tenant.id, label);
        break;
      }
    }

    return NextResponse.json({ data: { apiKey } });
  } catch (error) {
    if (error instanceof ApplicationError) {
      return handleApiError(error);
    }
    throw error;
  }
}
