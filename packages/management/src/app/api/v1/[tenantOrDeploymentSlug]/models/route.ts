import { checkApiKey } from '@lib/api/middleware/check-api-key';
import { ApplicationError } from '@lib/api/middleware/errors';
import { handleApiError } from '@lib/api/middleware/handle-api-error';
import { handleModels } from '@lib/llm/handlers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await checkApiKey(request, 'llm-api-key');
    return handleModels();
  } catch (error) {
    if (error instanceof ApplicationError) {
      return handleApiError(error);
    }
    throw error;
  }
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
