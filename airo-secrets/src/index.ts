/**
 * Reads deployment secrets from environment variables.
 * In hosted environments, secrets are injected at runtime; locally they come from .env.
 */
export function getSecret(name: string): string | undefined {
  const value = process.env[name];
  return value === '' ? undefined : value;
}
