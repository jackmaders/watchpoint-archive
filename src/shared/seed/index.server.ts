/**
 * Provides the server-only public API for deterministic local database seeding.
 *
 * Uses an environment-specific entry point to re-export browser-safe fixtures alongside the
 * guarded seed runner and credential policy helpers.
 */

export * from "./index";
export {
	assertLocalSeedTarget,
	getSeedCredentials,
	type SeedCredentials,
	type SeedEnvironment,
} from "./policy";
export { executeSeed } from "./seeder";
