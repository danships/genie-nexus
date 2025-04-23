import type {
  OpenAIChatCompletionRequest,
  OpenAIChatCompletionResponse,
} from '../types/openai';
import type { Request, Response, RequestHandler } from 'express';
import {
  createChatCompletion,
  createStreamingChatCompletion,
} from '../../providers/open-ai/proxy';

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

    if (isStreaming) {
      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Forward the streaming request to OpenAI
      const { textStream, response: responsePromise } =
        createStreamingChatCompletion(
          request,
          process.env['OPENAI_API_KEY'] || 'aa',
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
    } else {
      // Forward the non-streaming request to OpenAI
      const response = await createChatCompletion(
        request,
        process.env['OPENAI_API_KEY'] || 'aa',
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
