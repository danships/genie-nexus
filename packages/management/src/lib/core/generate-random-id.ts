export function generateRandomId() {
  return crypto.randomUUID().slice(0, 8);
}
