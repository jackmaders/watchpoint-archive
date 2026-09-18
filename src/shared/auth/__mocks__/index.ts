/**
 * Combines the browser and server authentication mocks for tests that import the shared auth public API.
 *
 * Keeps Vitest's automatic module replacement aligned with the runtime boundary exposed by `src/shared/auth/index.ts`.
 */

export * from "./api";
export * from "./auth-client";
