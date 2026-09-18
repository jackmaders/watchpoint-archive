/**
 * Provides the server-entry alias for isolated database tests.
 *
 * Re-exports the shared Vitest database spies so server-only consumers resolve the same
 * deterministic mock functions without loading TanStack Start's runtime boundary marker.
 */

export * from "./index";
