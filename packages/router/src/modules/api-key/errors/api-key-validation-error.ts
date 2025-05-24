import { ApplicationError } from '../../../core/errors/application-error.js';

export class ApiKeyValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, 401);
  }
}
