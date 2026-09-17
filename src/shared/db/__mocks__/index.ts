/**
 * Provides pre-configured mock domain database queries and connection providers for isolated
 * unit and integration testing across consumer modules.
 *
 * Implements the mock isolation standard for ADR-0010. Backed by Vitest `vi.fn()` spies
 * without invoking real SQLite or Cloudflare D1 operations.
 */

import { vi } from "vitest";
import { accounts } from "../schema/account";
import { attemptRecords } from "../schema/attempt-record";
import { auditEntries } from "../schema/audit";
import { playthroughStatusEnum, playthroughs } from "../schema/playthrough";
import { playthroughCompletions } from "../schema/playthrough-completion";
import { playthroughModuleSelections } from "../schema/playthrough-module-selection";
import { relations } from "../schema/relations";
import { inputTypeEnum, moduleTypeEnum, scenarios } from "../schema/scenario";
import { scenarioSnapshots } from "../schema/scenario-snapshot";
import { sessions } from "../schema/session";
import { userRoleEnum, users } from "../schema/user";
import { verifications } from "../schema/verification";
import { heroRoleEnum, vods } from "../schema/vod";
import {
	FIXTURE_DEMO_VOD,
	FIXTURE_IDS,
	FIXTURE_VOD,
	getLocalDemoFixtureScenarios,
	getLocalDemoFixtureVod,
	getLocalFixtureScenarios,
	getLocalFixtureVod,
} from "../seed/fixtures";
import { assertLocalSeedTarget, getSeedCredentials } from "../seed/policy";
import { executeSeed } from "../seed/seeder";

// Audit domain queries
export const queryAuditEntries = vi.fn(async () => []);
export const createAuditEntry = vi.fn(async () => ({ id: "mock_audit_id" }));
export const getAuditEntryById = vi.fn(async () => null);
export const deleteAuditEntry = vi.fn(async () => ({ id: "mock_audit_id" }));

// User domain queries
export const queryUsers = vi.fn(async () => []);
export const createUser = vi.fn(async () => ({
	createdAt: new Date(),
	email: "user@example.com",
	emailVerified: false,
	id: "mock_user_id",
	image: null,
	isTestAccount: false,
	name: "Mock User",
	role: "PLAYER" as const,
	updatedAt: new Date(),
}));
export const getUserById = vi.fn(async () => null);
export const getUserByEmail = vi.fn(async () => null);
export const updateUser = vi.fn(async () => null);
export const deleteUser = vi.fn(async () => null);

// VOD domain queries
export const queryVods = vi.fn(async () => []);
export const getVodById = vi.fn(async () => null);
export const createVod = vi.fn(async () => ({ id: "mock_vod_id" }));
export const updateVod = vi.fn(async () => ({ id: "mock_vod_id" }));
export const deleteVod = vi.fn(async () => ({ id: "mock_vod_id" }));
export const bulkDeleteVods = vi.fn(async () => []);
export const bulkPublishVods = vi.fn(async () => []);

// Scenario domain queries
export const queryScenarios = vi.fn(async () => []);
export const getScenarioById = vi.fn(async () => null);
export const createScenario = vi.fn(async () => ({ id: "mock_scenario_id" }));
export const createScenarios = vi.fn(async () => []);
export const updateScenario = vi.fn(async () => ({ id: "mock_scenario_id" }));
export const deleteScenario = vi.fn(async () => ({ id: "mock_scenario_id" }));
export const reorderScenarios = vi.fn(async () => []);

// Playthrough domain queries
export const queryPlaythroughs = vi.fn(async () => []);
export const getPlaythroughById = vi.fn(async () => null);
export const createPlaythrough = vi.fn(async () => ({
	id: "mock_playthrough_id",
}));
export const updatePlaythrough = vi.fn(async () => ({
	id: "mock_playthrough_id",
}));
export const deletePlaythrough = vi.fn(async () => ({
	id: "mock_playthrough_id",
}));
export const deleteOrphanInProgressPlaythroughs = vi.fn(async () => ({
	count: 0,
}));
export const createPlaythroughCompletion = vi.fn(async () => ({
	id: "mock_comp_id",
}));
export const queryPlaythroughCompletions = vi.fn(async () => []);
export const createPlaythroughModuleSelections = vi.fn(async () => []);
export const queryPlaythroughModuleSelections = vi.fn(async () => []);
export const createScenarioSnapshots = vi.fn(async () => []);
export const queryScenarioSnapshots = vi.fn(async () => []);

// Attempt domain queries
export const queryAttemptRecords = vi.fn(async () => []);
export const getAttemptRecordById = vi.fn(async () => null);
export const createAttemptRecord = vi.fn(async () => ({
	id: "mock_attempt_id",
}));
export const updateAttemptRecord = vi.fn(async () => ({
	id: "mock_attempt_id",
}));
export const deleteAttemptRecord = vi.fn(async () => ({
	id: "mock_attempt_id",
}));

// Client & query helpers
export const createDbClient = vi.fn();
export const filterToSQL = vi.fn();
export const orderToSQL = vi.fn();
export const DEFAULT_LIMIT = 50;

// Schema definitions & enums
// Seed fixtures & runners
export {
	accounts,
	assertLocalSeedTarget,
	attemptRecords,
	auditEntries,
	executeSeed,
	FIXTURE_DEMO_VOD,
	FIXTURE_IDS,
	FIXTURE_VOD,
	getLocalDemoFixtureScenarios,
	getLocalDemoFixtureVod,
	getLocalFixtureScenarios,
	getLocalFixtureVod,
	getSeedCredentials,
	heroRoleEnum,
	inputTypeEnum,
	moduleTypeEnum,
	playthroughCompletions,
	playthroughModuleSelections,
	playthroughStatusEnum,
	playthroughs,
	relations,
	scenarioSnapshots,
	scenarios,
	sessions,
	userRoleEnum,
	users,
	verifications,
	vods,
};
