/**
 * Provides the server-only public API for Cloudflare D1 persistence and database schemas.
 *
 * Uses an environment-specific entry point to re-export Drizzle clients, queries, schemas,
 * and browser-safe contracts while deliberately excluding seed operations.
 */

export { createDbClient } from "./client";
export * from "./index";
export {
	createAttemptRecord,
	deleteAttemptRecord,
	getAttemptRecordById,
	queryAttemptRecords,
	updateAttemptRecord,
} from "./queries/attempts";
export {
	createAuditEntry,
	deleteAuditEntry,
	getAuditEntryById,
	queryAuditEntries,
} from "./queries/audit";
export {
	createPlaythrough,
	createPlaythroughCompletion,
	createPlaythroughModuleSelections,
	createScenarioSnapshots,
	deleteOrphanInProgressPlaythroughs,
	deletePlaythrough,
	getPlaythroughById,
	queryPlaythroughCompletions,
	queryPlaythroughModuleSelections,
	queryPlaythroughs,
	queryScenarioSnapshots,
	updatePlaythrough,
} from "./queries/playthroughs";
export {
	createScenario,
	createScenarios,
	deleteScenario,
	getScenarioById,
	queryScenarios,
	reorderScenarios,
	updateScenario,
} from "./queries/scenarios";
export {
	createUser,
	deleteUser,
	getUserByEmail,
	getUserById,
	queryUsers,
	updateUser,
} from "./queries/users";
export {
	bulkDeleteVods,
	bulkPublishVods,
	createVod,
	deleteVod,
	getVodById,
	queryVods,
	updateVod,
} from "./queries/vods";
export {
	DEFAULT_LIMIT,
	filterToSQL,
	orderToSQL,
	type QueryOptions,
} from "./query";
export { accounts } from "./schema/account";
export { attemptRecords } from "./schema/attempt-record";
export { auditEntries } from "./schema/audit";
export { playthroughs } from "./schema/playthrough";
export { playthroughCompletions } from "./schema/playthrough-completion";
export { playthroughModuleSelections } from "./schema/playthrough-module-selection";
export { relations } from "./schema/relations";
export { scenarios } from "./schema/scenario";
export { scenarioSnapshots } from "./schema/scenario-snapshot";
export { sessions } from "./schema/session";
export { users } from "./schema/user";
export { verifications } from "./schema/verification";
export { vods } from "./schema/vod";
