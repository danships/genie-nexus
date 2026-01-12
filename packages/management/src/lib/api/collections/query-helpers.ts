import type { Repository } from 'supersave';

type QueryParams = {
  tenantId: string;
  filters?: Record<string, string> | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  sort?: string | undefined;
  order?: 'asc' | 'desc' | undefined;
};

export function buildQuery<T>(repository: Repository<T>, params: QueryParams) {
  let query = repository.createQuery().eq('tenantId', params.tenantId);

  if (params.filters) {
    for (const [key, value] of Object.entries(params.filters)) {
      if (key !== 'tenantId') {
        query = query.eq(key, value);
      }
    }
  }

  if (params.limit) {
    query = query.limit(params.limit);
  }

  if (params.offset) {
    query = query.offset(params.offset);
  }

  if (params.sort) {
    query = query.sort(params.sort, params.order ?? 'asc');
  }

  return query;
}

export function parseQueryParams(
  searchParams: URLSearchParams
): Omit<QueryParams, 'tenantId'> {
  const filters: Record<string, string> = {};
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');

  for (const [key, value] of searchParams.entries()) {
    if (!['limit', 'offset', 'sort', 'order'].includes(key)) {
      filters[key] = value;
    }
  }

  return {
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    limit: limit ? Number.parseInt(limit, 10) : undefined,
    offset: offset ? Number.parseInt(offset, 10) : undefined,
    sort: sort ?? undefined,
    order: order === 'desc' ? 'desc' : order === 'asc' ? 'asc' : undefined,
  };
}
