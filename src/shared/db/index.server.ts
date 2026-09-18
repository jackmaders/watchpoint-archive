/**
 * Provides the server-only public API for Cloudflare D1 persistence and database schemas.
 *
 * Uses an environment-specific entry point to re-export Drizzle clients, queries, schemas,
 * and browser-safe contracts while deliberately excluding seed operations.
 */

export { createDbClient } from "./api/client";
export {
	createAttemptRecord,
	deleteAttemptRecord,
	getAttemptRecordById,
	queryAttemptRecords,
	updateAttemptRecord,
} from "./api/queries/attempts";
export {
	createAuditEntry,
	deleteAuditEntry,
	getAuditEntryById,
	queryAuditEntries,
} from "./api/queries/audit";
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
} from "./api/queries/playthroughs";
export {
	createScenario,
	createScenarios,
	deleteScenario,
	getScenarioById,
	queryScenarios,
	reorderScenarios,
	updateScenario,
} from "./api/queries/scenarios";
export {
	createUser,
	deleteUser,
	getUserByEmail,
	getUserById,
	queryUsers,
	updateUser,
} from "./api/queries/users";
export {
	bulkDeleteVods,
	bulkPublishVods,
	createVod,
	deleteVod,
	getVodById,
	queryVods,
	updateVod,
} from "./api/queries/vods";
export {
	DEFAULT_LIMIT,
	filterToSQL,
	orderToSQL,
	type QueryOptions,
} from "./api/query";
export * from "./index";
export * from "./lib/seed/index.server";
export { accounts } from "./model/schema/account";
export { attemptRecords } from "./model/schema/attempt-record";
export { auditEntries } from "./model/schema/audit";
export { playthroughs } from "./model/schema/playthrough";
export { playthroughCompletions } from "./model/schema/playthrough-completion";
export { playthroughModuleSelections } from "./model/schema/playthrough-module-selection";
export { relations } from "./model/schema/relations";
export { scenarios } from "./model/schema/scenario";
export { scenarioSnapshots } from "./model/schema/scenario-snapshot";
export { sessions } from "./model/schema/session";
export { users } from "./model/schema/user";
export { verifications } from "./model/schema/verification";
export { vods } from "./model/schema/vod";
