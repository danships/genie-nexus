import { checkApiKey } from '@lib/api/middleware/check-api-key';
import { ApplicationError } from '@lib/api/middleware/errors';
import { handleApiError } from '@lib/api/middleware/handle-api-error';
import { handleChatCompletion } from '@lib/llm/handlers';
import type { OpenAIChatCompletionRequest } from '@lib/llm/types';
import { NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ tenantOrDeploymentSlug: string }>;
};

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { apiKey } = await checkApiKey(request, 'llm-api-key');
    const { tenantOrDeploymentSlug: deploymentSlug } = await params;
    const body: OpenAIChatCompletionRequest = await request.json();

    return await handleChatCompletion({
      apiKey,
      tenantId: apiKey.tenantId,
      deploymentSlug,
      body,
    });
  } catch (error) {
    if (error instanceof ApplicationError) {
      return handleApiError(error);
    }

    return NextResponse.json(
      {
        error: {
          message: 'An error occurred while processing your request',
          type: 'internal_server_error',
        },
      },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
