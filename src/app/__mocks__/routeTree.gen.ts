// biome-ignore-all lint/style/useFilenamingConvention: Vitest requires the mock to match the generated module filename.
/**
 * Provides a stable route-tree stand-in for router composition tests.
 *
 * Exports an inert object so tests can verify router construction without evaluating generated
 * lazy-route chaining against Vitest's automatically mocked TanStack Router objects.
 */

export const routeTree = { id: "mock-route-tree" };
