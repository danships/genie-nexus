import type { LocalBaseEntity } from '@genie-nexus/database';
import { transformEntity } from '@lib/api/collections/transform-entity';
import {
  COLLECTION_MAP,
  type CollectionName,
  isValidCollection,
} from '@lib/api/collections/types';
import { checkApiKeyOrUser } from '@lib/api/middleware/check-api-key-or-user';
import { ApplicationError } from '@lib/api/middleware/errors';
import { getTenant } from '@lib/api/middleware/get-tenant';
import { handleApiError } from '@lib/api/middleware/handle-api-error';
import { getContainer } from '@lib/core/get-container';
import { NextResponse } from 'next/server';
import type { Repository } from 'supersave';

type EntityWithTenant = LocalBaseEntity & { tenantId?: string };

type RouteParams = {
  params: Promise<{ collection: string; id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await checkApiKeyOrUser(request, 'management-key');
    const { tenant } = await getTenant();
    const { collection, id } = await params;

    if (!isValidCollection(collection)) {
      return NextResponse.json(
        { error: `Unknown collection: ${collection}` },
        { status: 404 }
      );
    }

    const container = await getContainer();
    const repository = container.resolve<Repository<EntityWithTenant>>(
      COLLECTION_MAP[collection]
    );

    const entity = await repository.getById(id);

    if (!entity) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (entity.tenantId !== tenant.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const transformed = transformEntity(collection as CollectionName, entity);
    return NextResponse.json({ data: transformed });
  } catch (error) {
    if (error instanceof ApplicationError) {
      return handleApiError(error);
    }
    throw error;
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await checkApiKeyOrUser(request, 'management-key');
    const { tenant } = await getTenant();
    const { collection, id } = await params;

    if (!isValidCollection(collection)) {
      return NextResponse.json(
        { error: `Unknown collection: ${collection}` },
        { status: 404 }
      );
    }

    const container = await getContainer();
    const repository = container.resolve<Repository<EntityWithTenant>>(
      COLLECTION_MAP[collection]
    );

    const existing = await repository.getById(id);

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (existing.tenantId !== tenant.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const body = await request.json();

    const updated = await repository.update({
      ...existing,
      ...body,
      id,
      tenantId: tenant.id,
    });

    const transformed = transformEntity(collection as CollectionName, updated);
    return NextResponse.json({ data: transformed });
  } catch (error) {
    if (error instanceof ApplicationError) {
      return handleApiError(error);
    }
    throw error;
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await checkApiKeyOrUser(request, 'management-key');
    const { tenant } = await getTenant();
    const { collection, id } = await params;

    if (!isValidCollection(collection)) {
      return NextResponse.json(
        { error: `Unknown collection: ${collection}` },
        { status: 404 }
      );
    }

    const container = await getContainer();
    const repository = container.resolve<Repository<EntityWithTenant>>(
      COLLECTION_MAP[collection]
    );

    const existing = await repository.getById(id);

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (existing.tenantId !== tenant.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    await repository.deleteUsingId(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof ApplicationError) {
      return handleApiError(error);
    }
    throw error;
  }
}
