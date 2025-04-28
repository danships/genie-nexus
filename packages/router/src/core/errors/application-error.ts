export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly options: { expose?: boolean } = { expose: false },
  ) {
    super(message);
  }
}
