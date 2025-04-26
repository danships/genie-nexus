export class TenantMissingError extends Error {
  constructor() {
    super('The tenant is missing from the request.');
  }
}
