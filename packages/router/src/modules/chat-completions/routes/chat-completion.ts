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
import { getApiKeyFromResponse } from '../../api-key/middleware/get-api-key-from-response';
import { getDeploymentByName } from '../../deployments/get-deployment-by-name';
import { executeForLlm } from '../../deployments/execute';
import { isLlmApiKey } from '@genie-nexus/types';

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
          const { textStream, response: responsePromise } =
            openAICreateStreamingChatCompletion(
              transformedRequest,
              provider.apiKey,
            );

          const index = 0;
          for await (const textPart of textStream) {
            // Format each chunk according to OpenAI's streaming format
            const chunk = {
              id: `chatcmpl-${Date.now()}`,
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
          }

          // Send the final chunk with finish_reason
          const finalResponse = await responsePromise;
          const finalChunk = {
            id: finalResponse.id,
            object: 'chat.completion.chunk',
            created: Math.floor(Date.now() / 1000),
            model: request.model,
            choices: [
              {
                index: 0,
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
          // Forward the non-streaming request to OpenAI
          const response = await openAICreateChatCompletion(
            transformedRequest,
            provider.apiKey,
          );

          // Transform the response to match OpenAI's format
          const openAIResponse: OpenAIChatCompletionResponse = {
            id: `chatcmpl-${Date.now()}`,
            object: 'chat.completion',
            created: Math.floor(Date.now() / 1000),
            model: request.model,
            choices: [
              {
                index: 0,
                message: {
                  role: 'assistant',
                  content: response.text,
                },
                finish_reason: 'stop',
              },
            ],
            usage: {
              prompt_tokens: response.usage.promptTokens,
              completion_tokens: response.usage.completionTokens,
              total_tokens: response.usage.totalTokens,
            },
          };

          res.json(openAIResponse);
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
