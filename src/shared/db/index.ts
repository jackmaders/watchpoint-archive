/**
 * Provides the browser-safe public API for database-backed application contracts.
 *
 * Re-exports primitive domain constants and type-only schema projections without loading
 * Drizzle tables, query implementations, database clients, or seed operations at runtime.
 */

export { queryKeys } from "./api/query-keys";
export {
	FIXTURE_DEMO_VOD,
	FIXTURE_IDS,
	FIXTURE_VOD,
	getLocalDemoFixtureScenarios,
	getLocalDemoFixtureVod,
	getLocalFixtureScenarios,
	getLocalFixtureVod,
} from "./lib/seed";
export type {
	HeroRole,
	InputType,
	ModuleType,
	PlaythroughStatus,
	UserRole,
} from "./model/database-contracts";
export {
	heroRoleEnum,
	inputTypeEnum,
	moduleTypeEnum,
	playthroughStatusEnum,
	userRoleEnum,
} from "./model/database-contracts";
export type { accounts } from "./model/schema/account";
export type { attemptRecords } from "./model/schema/attempt-record";
export type { auditEntries } from "./model/schema/audit";
export type { playthroughs } from "./model/schema/playthrough";
export type { playthroughCompletions } from "./model/schema/playthrough-completion";
export type { playthroughModuleSelections } from "./model/schema/playthrough-module-selection";
export type { scenarios } from "./model/schema/scenario";
export type { scenarioSnapshots } from "./model/schema/scenario-snapshot";
export type { sessions } from "./model/schema/session";
export type { users } from "./model/schema/user";
export type { verifications } from "./model/schema/verification";
export type { VodRecord, VodTransportRecord, vods } from "./model/schema/vod";
export type { JsonPrimitive, JsonValue } from "./model/types";
