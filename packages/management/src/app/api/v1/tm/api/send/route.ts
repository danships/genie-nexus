import { getServerConfiguration } from "@genie-nexus/configuration";
import { TypeSymbols } from "@genie-nexus/container";
import type { StoredConfigurationRepository } from "@genie-nexus/database";
import { DEFAULT_TENANT_ID } from "@lib/api/middleware/constants";
import { getContainer } from "@lib/core/get-container";
import { environment } from "@lib/environment";
import { NextResponse } from "next/server";

function getClientIp(request: Request): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",");
    return ips[0]?.trim() ?? null;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return null;
}

export const POST = async function (request: Request) {
  const container = await getContainer();
  const storedConfigurationRepository =
    container.resolve<StoredConfigurationRepository>(
      TypeSymbols.STORED_CONFIGURATION_REPOSITORY
    );

  if (environment.NODE_ENV === "development") {
    return NextResponse.json({ beep: "boop" });
  }

  const serverConfig = await getServerConfiguration(
    storedConfigurationRepository,
    DEFAULT_TENANT_ID
  );

  if (!serverConfig.telemetryEnabled) {
    return NextResponse.json({ beep: "boop-nope" });
  }

  const requestBody = await request.json();

  const updatedBody = {
    ...requestBody,
    payload: {
      ...requestBody.payload,
      website: environment.TELEMETRY_SITE_ID,
    },
  };

  const clientIp = getClientIp(request);
  if (clientIp) {
    updatedBody.payload.ip = clientIp;
  }

  const cache = request.headers.get("x-umami-cache") ?? "";

  await fetch(`${environment.TELEMETRY_HOST_URL}/api/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": request.headers.get("user-agent") || "",
      "X-Umami-Cache": cache,
    },
    body: JSON.stringify(updatedBody),
  });

  return new NextResponse(null, { status: 204 });
};
