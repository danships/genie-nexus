import { ApplicationError } from '../../../core/errors/application-error.js';

export class ApiKeyNotPresentError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'API key not present', 401);
  }
}
