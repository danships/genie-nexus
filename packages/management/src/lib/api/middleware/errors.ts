export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly options: { expose?: boolean } = { expose: false }
  ) {
    super(message);
  }
}

export class ApiKeyNotPresentError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'API key not present', 401);
  }
}

export class ApiKeyValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class TenantMissingError extends ApplicationError {
  constructor() {
    super('Tenant missing', 404);
  }
}
