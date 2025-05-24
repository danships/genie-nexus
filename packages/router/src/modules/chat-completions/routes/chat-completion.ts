import type {
  OpenAIChatCompletionRequest,
  OpenAIChatCompletionResponse,
} from '../types/openai';
import type { Request, Response, RequestHandler } from 'express';
import {
  createChatCompletion as openAICreateChatCompletion,
  createStreamingChatCompletion as openAICreateStreamingChatCompletion,
} from '../../llm-providers/open-ai/proxy';
import {
  createChatCompletion as staticCreateChatCompletion,
  createStreamingChatCompletion as staticCreateStreamingChatCompletion,
} from '../../llm-providers/static/proxy';
import {
  createChatCompletion as googleCreateChatCompletion,
  createStreamingChatCompletion as googleCreateStreamingChatCompletion,
} from '../../llm-providers/google/proxy';

import { getApiKeyFromResponse } from '../../api-key/middleware/get-api-key-from-response';
import { getDeploymentByName } from '../../deployments/get-deployment-by-name';
import { executeForLlm } from '../../deployments/execute';
import { isLlmApiKey } from '@genie-nexus/types';
import { handleAiSdkStreamResponse } from '../handle-ai-sdk-stream-response';
import { handleAiSdkTextResponse } from '../handle-ai-sdk-text-response';

export const handler: RequestHandler<
  object,
  unknown,
  OpenAIChatCompletionRequest
> = async (
  req: Request<object, unknown, OpenAIChatCompletionRequest>,
  res: Response,
) => {
  try {
    const request = req.body;
    const isStreaming = Boolean(request.stream);

    // Validate required fields
    if (!request.messages || !Array.isArray(request.messages)) {
      res.status(400).json({
        error: {
          message: 'messages is required and must be an array',
          type: 'invalid_request_error',
        },
      });
      return;
    }

    const apiKey = getApiKeyFromResponse(res, 'llm-api-key');

    const deployment = await getDeploymentByName(
      apiKey.tenantId,
      request.model,
      'llm',
    );
    if (
      !isLlmApiKey(apiKey) ||
      (Array.isArray(apiKey.allowedDeployments) &&
        !apiKey.allowedDeployments.includes(deployment.id))
    ) {
      res.status(400).json({
        error: {
          message: 'model is not allowed for api key',
          type: 'invalid_request_error',
        },
      });
      return;
    }

    const { transformedRequest, provider } = await executeForLlm(
      deployment,
      request,
    );

    if (isStreaming) {
      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      switch (provider.type) {
        case 'openai': {
          const aiResponse = openAICreateStreamingChatCompletion(
            transformedRequest,
            provider.apiKey,
          );

          await handleAiSdkStreamResponse(request.model, res, aiResponse);
          break;
        }

        case 'google': {
          const aiResponse = googleCreateStreamingChatCompletion(
            transformedRequest,
            { apiKey: provider.apiKey },
          );
          await handleAiSdkStreamResponse(request.model, res, aiResponse);
          break;
        }

        case 'static': {
          const { id, text } =
            staticCreateStreamingChatCompletion(transformedRequest);

          let index = 0;
          for await (const textPart of text) {
            const chunk = {
              id: `${id}-${Date.now()}`,
              object: 'chat.completion.chunk',
              created: Math.floor(Date.now() / 1000),
              model: request.model,
              choices: [
                {
                  index,
                  delta: { content: textPart },
                  finish_reason: null,
                },
              ],
            };
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
            index++;
          }

          // Send the final chunk with finish_reason
          const finalChunk = {
            id: `chatcmpl-${Date.now()}`,
            object: 'chat.completion.chunk',
            created: Math.floor(Date.now() / 1000),
            model: request.model,
            choices: [
              {
                index: index - 1,
                delta: {},
                finish_reason: 'stop',
              },
            ],
          };
          res.write(`data: ${JSON.stringify(finalChunk)}\n\n`);
          res.write('data: [DONE]\n\n');
          res.end();
          break;
        }
        default: {
          throw new Error(`Unsupported LLM provider type ${provider.type}`);
        }
      }
    } else {
      switch (provider.type) {
        case 'openai': {
          const response = await openAICreateChatCompletion(
            transformedRequest,
            provider.apiKey,
          );

          handleAiSdkTextResponse(request.model, res, response);
          break;
        }

        case 'google': {
          const response = await googleCreateChatCompletion(
            transformedRequest,
            { apiKey: provider.apiKey },
          );
          handleAiSdkTextResponse(request.model, res, response);
          break;
        }

        case 'static': {
          const { text, usage } =
            staticCreateChatCompletion(transformedRequest);
          const staticResponse: OpenAIChatCompletionResponse = {
            id: `chatcmpl-${Date.now()}`,
            object: 'chat.completion',
            created: Math.floor(Date.now() / 1000),
            model: request.model,
            choices: [
              {
                index: 0,
                message: {
                  role: 'assistant',
                  content: text,
                },
                finish_reason: 'stop',
              },
            ],
            usage: {
              prompt_tokens: usage.promptTokens,
              completion_tokens: usage.completionTokens,
              total_tokens: usage.totalTokens,
            },
          };
          res.json(staticResponse);
          break;
        }

        default: {
          throw new Error(`Unsupported LLM provider type ${provider.type}`);
        }
      }
    }
  } catch (error) {
    // Log error for debugging purposes
    if (process.env['NODE_ENV'] !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Error in chat completion:', error);
    }

    res.status(500).json({
      error: {
        message: 'An error occurred while processing your request',
        type: 'internal_server_error',
      },
    });
  }
};
