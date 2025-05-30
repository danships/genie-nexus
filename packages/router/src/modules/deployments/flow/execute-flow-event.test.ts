import type { Flow, RequestContext } from '@genie-nexus/types';
import { describe, expect, it } from 'vitest';
import { executeFlowEvent } from './execute-flow-event.js';

describe('executeFlowEvent', () => {
  const createTestContext = (): RequestContext => ({
    path: '/test',
    method: 'GET',
    requestHeaders: {},
    requestBody: {},
    responseHeaders: {},
    responseBody: undefined,
    responseStatusCode: 200,
    providerId: 'dep-1',
  });

  const createTestFlow = (events: Flow['events']): Flow => ({
    id: 'test-flow',
    deploymentId: 'test-deployment',
    events,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  describe('Request Header Actions', () => {
    it('should add request header', async () => {
      const flow = createTestFlow([
        {
          id: 'test-event',
          type: 'incomingRequest',
          name: 'Test Event',
          enabled: true,
          pipeline: {
            id: 'test-pipeline',
            enabled: true,
            steps: [
              {
                action: {
                  type: 'addRequestHeader',
                  key: 'X-Test',
                  value: 'test-value',
                },
              },
            ],
          },
        },
      ]);

      const context = createTestContext();
      const result = await executeFlowEvent(flow, 'incomingRequest', context);

      expect(result.requestHeaders['X-Test']).toBe('test-value');
    });

    it('should remove request header', async () => {
      const flow = createTestFlow([
        {
          id: 'test-event',
          type: 'incomingRequest',
          name: 'Test Event',
          enabled: true,
          pipeline: {
            id: 'test-pipeline',
            enabled: true,
            steps: [
              {
                action: {
                  type: 'addRequestHeader',
                  key: 'X-Test',
                  value: 'test-value',
                },
              },
              {
                action: {
                  type: 'removeRequestHeader',
                  key: 'X-Test',
                },
              },
            ],
          },
        },
      ]);

      const context = createTestContext();
      const result = await executeFlowEvent(flow, 'incomingRequest', context);

      expect(result.requestHeaders['X-Test']).toBeUndefined();
    });
  });

  describe('Response Actions', () => {
    it('should update response status code', async () => {
      const flow = createTestFlow([
        {
          id: 'test-event',
          type: 'response',
          name: 'Test Event',
          enabled: true,
          pipeline: {
            id: 'test-pipeline',
            enabled: true,
            steps: [
              {
                action: {
                  type: 'updateResponseStatusCode',
                  value: '404',
                },
              },
            ],
          },
        },
      ]);

      const context = createTestContext();
      const result = await executeFlowEvent(flow, 'response', context);

      expect(result.responseStatusCode).toBe(404);
    });

    it('should update response body', async () => {
      const flow = createTestFlow([
        {
          id: 'test-event',
          type: 'response',
          name: 'Test Event',
          enabled: true,
          pipeline: {
            id: 'test-pipeline',
            enabled: true,
            steps: [
              {
                action: {
                  type: 'updateResponseBody',
                  value: '{"message":"test"}',
                },
              },
            ],
          },
        },
      ]);

      const context = createTestContext();
      const result = await executeFlowEvent(flow, 'response', context);

      expect(result.responseBody).toBe('{"message":"test"}');
    });
  });

  describe('Conditions', () => {
    it('should execute action when condition is met', async () => {
      const flow = createTestFlow([
        {
          id: 'test-event',
          type: 'incomingRequest',
          name: 'Test Event',
          enabled: true,
          pipeline: {
            id: 'test-pipeline',
            enabled: true,
            steps: [
              {
                conditions: [
                  {
                    type: 'equals',
                    field: 'request.path',
                    value: '/test',
                  },
                ],
                action: {
                  type: 'addRequestHeader',
                  key: 'X-Test',
                  value: 'test-value',
                },
              },
            ],
          },
        },
      ]);

      const context = createTestContext();
      const result = await executeFlowEvent(flow, 'incomingRequest', context);

      expect(result.requestHeaders['X-Test']).toBe('test-value');
    });

    it('should not execute action when condition is not met', async () => {
      const flow = createTestFlow([
        {
          id: 'test-event',
          type: 'incomingRequest',
          name: 'Test Event',
          enabled: true,
          pipeline: {
            id: 'test-pipeline',
            enabled: true,
            steps: [
              {
                conditions: [
                  {
                    type: 'equals',
                    field: 'request.path',
                    value: '/different',
                  },
                ],
                action: {
                  type: 'addRequestHeader',
                  key: 'X-Test',
                  value: 'test-value',
                },
              },
            ],
          },
        },
      ]);

      const context = createTestContext();
      const result = await executeFlowEvent(flow, 'incomingRequest', context);

      expect(result.requestHeaders['X-Test']).toBeUndefined();
    });

    it('should handle multiple conditions', async () => {
      const flow = createTestFlow([
        {
          id: 'test-event',
          type: 'incomingRequest',
          name: 'Test Event',
          enabled: true,
          pipeline: {
            id: 'test-pipeline',
            enabled: true,
            steps: [
              {
                conditions: [
                  {
                    type: 'equals',
                    field: 'request.path',
                    value: '/test',
                  },
                  {
                    type: 'equals',
                    field: 'request.method',
                    value: 'GET',
                  },
                ],
                action: {
                  type: 'addRequestHeader',
                  key: 'X-Test',
                  value: 'test-value',
                },
              },
            ],
          },
        },
      ]);

      const context = createTestContext();
      const result = await executeFlowEvent(flow, 'incomingRequest', context);

      expect(result.requestHeaders['X-Test']).toBe('test-value');
    });
  });

  describe('Disabled Events and Pipelines', () => {
    it('should not execute disabled event', async () => {
      const flow = createTestFlow([
        {
          id: 'test-event',
          type: 'incomingRequest',
          name: 'Test Event',
          enabled: false,
          pipeline: {
            id: 'test-pipeline',
            enabled: true,
            steps: [
              {
                action: {
                  type: 'addRequestHeader',
                  key: 'X-Test',
                  value: 'test-value',
                },
              },
            ],
          },
        },
      ]);

      const context = createTestContext();
      const result = await executeFlowEvent(flow, 'incomingRequest', context);

      expect(result.requestHeaders['X-Test']).toBeUndefined();
    });

    it('should not execute disabled pipeline', async () => {
      const flow = createTestFlow([
        {
          id: 'test-event',
          type: 'incomingRequest',
          name: 'Test Event',
          enabled: true,
          pipeline: {
            id: 'test-pipeline',
            enabled: false,
            steps: [
              {
                action: {
                  type: 'addRequestHeader',
                  key: 'X-Test',
                  value: 'test-value',
                },
              },
            ],
          },
        },
      ]);

      const context = createTestContext();
      const result = await executeFlowEvent(flow, 'incomingRequest', context);

      expect(result.requestHeaders['X-Test']).toBeUndefined();
    });
  });

  describe('Set Provider Action', () => {
    it('should set provider ID in context', async () => {
      const flow = createTestFlow([
        {
          id: 'test-event',
          type: 'incomingRequest',
          name: 'Test Event',
          enabled: true,
          pipeline: {
            id: 'test-pipeline',
            enabled: true,
            steps: [
              {
                action: {
                  type: 'setProvider',
                  providerId: 'test-provider',
                },
              },
            ],
          },
        },
      ]);

      const context = createTestContext();
      const result = await executeFlowEvent(flow, 'incomingRequest', context);

      expect(result.providerId).toBe('test-provider');
    });
  });
});
