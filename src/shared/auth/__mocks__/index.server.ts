/**
 * Manual mock for the server-only authentication public API used by server-boundary tests.
 *
 * Reuses the shared Better Auth server doubles while matching the `index.server.ts` entrypoint consumed by
 * application code, so tests can control session and registration behavior without importing internals.
 */

import { vi } from "vitest";

export * from "./api";
export * from "./auth";
export const requirePermission = vi.fn().mockResolvedValue({
	id: "user-1",
	role: "ADMIN",
});
