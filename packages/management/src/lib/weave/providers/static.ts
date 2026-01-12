import type { Provider } from "@genie-nexus/database";
import type { ProviderResponse } from "../types";

export function generateStaticResponse(provider: Provider): ProviderResponse {
  if (provider.type !== "http-static") {
    throw new Error("Provider is not a static provider");
  }

  const headers: Record<string, string> = {};
  if (provider.responseHeaders) {
    for (const header of provider.responseHeaders) {
      switch (header.operation) {
        case "set":
          headers[header.key] = header.value ?? "";
          break;
        case "add":
          headers[header.key] = headers[header.key]
            ? `${headers[header.key]}, ${header.value}`
            : (header.value ?? "");
          break;
        case "remove":
          delete headers[header.key];
          break;
      }
    }
  }

  return {
    statusCode: provider.statusCode || 200,
    headers,
    body: Buffer.from(provider.body ?? ""),
  };
}
