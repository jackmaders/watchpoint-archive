/**
 * Provides the browser-safe public API for database-backed application contracts.
 *
 * Re-exports primitive domain constants and type-only schema projections without loading
 * Drizzle tables, query implementations, database clients, or seed operations at runtime.
 */

export type {
	HeroRole,
	InputType,
	ModuleType,
	PlaythroughStatus,
	UserRole,
} from "./database-contracts";
export {
	heroRoleEnum,
	inputTypeEnum,
	moduleTypeEnum,
	playthroughStatusEnum,
	userRoleEnum,
} from "./database-contracts";
export type { accounts } from "./schema/account";
export type { attemptRecords } from "./schema/attempt-record";
export type { auditEntries } from "./schema/audit";
export type { playthroughs } from "./schema/playthrough";
export type { playthroughCompletions } from "./schema/playthrough-completion";
export type { playthroughModuleSelections } from "./schema/playthrough-module-selection";
export type { scenarios } from "./schema/scenario";
export type { scenarioSnapshots } from "./schema/scenario-snapshot";
export type { sessions } from "./schema/session";
export type { users } from "./schema/user";
export type { verifications } from "./schema/verification";
export type { VodRecord, VodTransportRecord, vods } from "./schema/vod";
export type { JsonPrimitive, JsonValue } from "./types";
