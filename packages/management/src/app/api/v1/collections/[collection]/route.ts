import type { LocalBaseEntity } from "@genie-nexus/database";
import type { Repository } from "supersave";
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
  isValidCollection,
} from "@lib/api/collections/types";
import { checkApiKeyOrUser } from "@lib/api/middleware/check-api-key-or-user";
import { ApplicationError } from "@lib/api/middleware/errors";
import { getTenant } from "@lib/api/middleware/get-tenant";
import { handleApiError } from "@lib/api/middleware/handle-api-error";
import { getContainer } from "@lib/core/get-container";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ collection: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await checkApiKeyOrUser(request, "management-key");
    const { tenant } = await getTenant();
    const { collection } = await params;

    if (!isValidCollection(collection)) {
      return NextResponse.json(
        { error: `Unknown collection: ${collection}` },
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
    const transformed = transformEntities(
      collection as CollectionName,
      entities
    );

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
    const { collection } = await params;

    if (!isValidCollection(collection)) {
      return NextResponse.json(
        { error: `Unknown collection: ${collection}` },
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
    const transformed = transformEntity(collection as CollectionName, created);

    return NextResponse.json({ data: transformed }, { status: 201 });
  } catch (error) {
    if (error instanceof ApplicationError) {
      return handleApiError(error);
    }
    throw error;
  }
}
