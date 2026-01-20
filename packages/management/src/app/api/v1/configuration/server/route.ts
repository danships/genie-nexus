import {
  getServerConfiguration,
  updateServerConfiguration,
} from '@lib/configuration';
import { TypeSymbols } from '@genie-nexus/container';
import type { StoredConfigurationRepository } from '@genie-nexus/database';
import type {
  ServerConfiguration,
  ServerConfigurationResponse,
} from '@genie-nexus/types';
import type { DataWrapper } from '@genie-nexus/types/dist/types/api.js';
import { checkApiKeyOrUser } from '@lib/api/middleware/check-api-key-or-user';
import { DEFAULT_TENANT_ID } from '@lib/api/middleware/constants';
import { ApplicationError } from '@lib/api/middleware/errors';
import { getTenant } from '@lib/api/middleware/get-tenant';
import { handleApiError } from '@lib/api/middleware/handle-api-error';
import { getContainer } from '@lib/core/get-container';
import { environment } from '@lib/environment';
import { sendTelemetryEvent } from '@lib/telemetry';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestValidator = z.object({
  telemetryEnabled: z.boolean().optional(),
  registrationEnabled: z.boolean().optional(),
});

export async function GET() {
  if (environment.MULTI_TENANT) {
    return NextResponse.json({
      data: {
        telemetryEnabled: true,
        registrationEnabled: true,
      },
    } satisfies DataWrapper<ServerConfigurationResponse>);
  }

  const container = await getContainer();
  const storedConfigurationRepository =
    container.resolve<StoredConfigurationRepository>(
      TypeSymbols.STORED_CONFIGURATION_REPOSITORY
    );

  const serverConfiguration = await getServerConfiguration(
    storedConfigurationRepository,
    DEFAULT_TENANT_ID
  );

  return NextResponse.json({
    data: {
      telemetryEnabled: serverConfiguration.telemetryEnabled,
      registrationEnabled: serverConfiguration.registrationEnabled,
    },
  } satisfies DataWrapper<ServerConfigurationResponse>);
}

export async function POST(request: Request) {
  try {
    await checkApiKeyOrUser(request, 'management-key');
    const { tenant } = await getTenant();

    const container = await getContainer();
    const storedConfigurationRepository =
      container.resolve<StoredConfigurationRepository>(
        TypeSymbols.STORED_CONFIGURATION_REPOSITORY
      );

    if (environment.MULTI_TENANT) {
      const currentConfig = await getServerConfiguration(
        storedConfigurationRepository,
        tenant.id
      );
      return NextResponse.json({
        data: currentConfig,
      } satisfies DataWrapper<ServerConfiguration>);
    }

    const body = await request.json();
    const parsedBody = requestValidator.parse(body);

    if (Object.keys(parsedBody).length === 0) {
      const currentConfiguration = await getServerConfiguration(
        storedConfigurationRepository,
        tenant.id
      );
      return NextResponse.json({
        data: currentConfiguration,
      } satisfies DataWrapper<ServerConfiguration>);
    }

    const configurationUpdates: Partial<ServerConfiguration> = {};

    let newServerHash: string | undefined;
    if (parsedBody.telemetryEnabled !== undefined) {
      configurationUpdates.telemetryEnabled = parsedBody.telemetryEnabled;
      if (parsedBody.telemetryEnabled) {
        newServerHash = crypto.randomUUID();
        configurationUpdates.server = newServerHash;
      }
    }

    if (parsedBody.registrationEnabled !== undefined) {
      configurationUpdates.registrationEnabled = parsedBody.registrationEnabled;
    }

    const updatedConfiguration = await updateServerConfiguration(
      storedConfigurationRepository,
      tenant.id,
      configurationUpdates
    );

    if (parsedBody.telemetryEnabled !== undefined) {
      if (parsedBody.telemetryEnabled) {
        sendTelemetryEvent({ type: 'telemetry-enabled' }, newServerHash);
        sendTelemetryEvent({ type: 'registered' }, newServerHash);
      } else {
        sendTelemetryEvent({ type: 'telemetry-disabled' });
      }
    }

    return NextResponse.json({
      data: updatedConfiguration,
    } satisfies DataWrapper<ServerConfiguration>);
  } catch (error) {
    if (error instanceof ApplicationError) {
      return handleApiError(error);
    }
    throw error;
  }
}
