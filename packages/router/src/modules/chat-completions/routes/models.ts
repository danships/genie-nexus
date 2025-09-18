import { Lifecycle, scoped } from '@genie-nexus/container';
import type { Request, Response } from 'express';
import type { HttpRequestHandler } from '../../../core/http/get-handler-using-container.js';

@scoped(Lifecycle.ContainerScoped)
export class ModelsHandler implements HttpRequestHandler {
  public handle(_req: Request, res: Response) {
    res.json({
      type: 'list',
      data: [
        {
          type: 'genie-nexus-model',
          created: 1758225573,
          object: 'model',
          owned_by: 'genie-nexus',
        },
      ],
    });
  }
}
