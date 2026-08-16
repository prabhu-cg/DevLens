/** Generates a random identifier using the platform crypto API. */
export function generateId(): string {
  return crypto.randomUUID();
}
