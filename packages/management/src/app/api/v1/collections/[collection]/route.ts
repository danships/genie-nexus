import type { LocalBaseEntity } from "@genie-nexus/database";
import {
  buildQuery,
  parseQueryParams,
} from "@lib/api/collections/query-helpers";
import {
  transformEntities,
  transformEntity,
} from "@lib/api/collections/transform-entity";
import {
  COLLECTION_MAP,
  type CollectionName,
  normalizeCollectionName,
} from "@lib/api/collections/types";
import { checkApiKeyOrUser } from "@lib/api/middleware/check-api-key-or-user";
import { ApplicationError } from "@lib/api/middleware/errors";
import { getTenant } from "@lib/api/middleware/get-tenant";
import { handleApiError } from "@lib/api/middleware/handle-api-error";
import { getContainer } from "@lib/core/get-container";
import { sendTelemetryEvent } from "@lib/telemetry";
import { NextResponse } from "next/server";
import type { Repository } from "supersave";

const TELEMETRY_ENTITY_MAP: Partial<Record<CollectionName, string>> = {
  deployment: "deployment",
  provider: "provider",
  apiKey: "apiKey",
  llmflow: "llmflow",
  weaveflow: "weaveflow",
};

type RouteParams = {
  params: Promise<{ collection: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await checkApiKeyOrUser(request, "management-key");
    const { tenant } = await getTenant();
    const { collection: collectionParam } = await params;

    const collection = normalizeCollectionName(collectionParam);
    if (!collection) {
      return NextResponse.json(
        { error: `Unknown collection: ${collectionParam}` },
        { status: 404 }
      );
    }

    const container = await getContainer();
    const repository = container.resolve<Repository<LocalBaseEntity>>(
      COLLECTION_MAP[collection]
    );

    const url = new URL(request.url);
    const queryParams = parseQueryParams(url.searchParams);

    const query = buildQuery(repository, {
      tenantId: tenant.id,
      ...queryParams,
    });

    const entities = await repository.getByQuery(query);
    const transformed = transformEntities(collection, entities);

    return NextResponse.json({ data: transformed });
  } catch (error) {
    if (error instanceof ApplicationError) {
      return handleApiError(error);
    }
    throw error;
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    await checkApiKeyOrUser(request, "management-key");
    const { tenant } = await getTenant();
    const { collection: collectionParam } = await params;

    const collection = normalizeCollectionName(collectionParam);
    if (!collection) {
      return NextResponse.json(
        { error: `Unknown collection: ${collectionParam}` },
        { status: 404 }
      );
    }

    const container = await getContainer();
    const repository = container.resolve<Repository<LocalBaseEntity>>(
      COLLECTION_MAP[collection]
    );

    const body = await request.json();

    const entityToCreate = {
      ...body,
      tenantId: tenant.id,
    };

    const created = await repository.create(entityToCreate);
    const transformed = transformEntity(collection, created);

    const telemetryEntity = TELEMETRY_ENTITY_MAP[collection];
    if (telemetryEntity) {
      sendTelemetryEvent({ type: "create", entity: telemetryEntity });
    }

    return NextResponse.json({ data: transformed }, { status: 201 });
  } catch (error) {
    if (error instanceof ApplicationError) {
      return handleApiError(error);
    }
    throw error;
  }
}
