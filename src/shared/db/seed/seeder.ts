/**
 * Orchestrates deterministic database seeding by purging existing records and populating
 * initial user accounts, authentication credentials, VOD catalogs, and scenario fixtures.
 *
 * Implements the database seed runner. Validates local environment safety via `assertLocalSeedTarget`,
 * hashes seed passwords using `better-auth/crypto`, clears relational tables in dependency order,
 * and inserts reproducible player/admin accounts and synthetic VOD training data into Cloudflare D1 via Drizzle.
 */

import { createLocalAccountIssuer } from "better-auth";
import { hashPassword } from "better-auth/crypto";
import type { createDbClient } from "../client";
import { accounts } from "../schema/account";
import { attemptRecords } from "../schema/attempt-record";
import { auditEntries } from "../schema/audit";
import { playthroughs } from "../schema/playthrough";
import { playthroughCompletions } from "../schema/playthrough-completion";
import { playthroughModuleSelections } from "../schema/playthrough-module-selection";
import { scenarios } from "../schema/scenario";
import { scenarioSnapshots } from "../schema/scenario-snapshot";
import { sessions } from "../schema/session";
import { users } from "../schema/user";
import { vods } from "../schema/vod";
import {
	FIXTURE_IDS,
	getLocalDemoFixtureScenarios,
	getLocalDemoFixtureVod,
	getLocalFixtureScenarios,
	getLocalFixtureVod,
} from "./fixtures";
import { assertLocalSeedTarget, getSeedCredentials } from "./policy";

export async function executeSeed(db: ReturnType<typeof createDbClient>) {
	assertLocalSeedTarget();
	const credentials = getSeedCredentials();
	const now = new Date();

	await db.delete(attemptRecords);
	await db.delete(scenarioSnapshots);
	await db.delete(playthroughModuleSelections);
	await db.delete(playthroughs);
	await db.delete(playthroughCompletions);
	await db.delete(auditEntries);
	await db.delete(scenarios);
	await db.delete(vods);
	await db.delete(sessions);
	await db.delete(accounts);
	await db.delete(users);

	await db.insert(users).values([
		{
			createdAt: now,
			email: credentials.playerEmail,
			emailVerified: true,
			id: FIXTURE_IDS.playerUser,
			isTestAccount: true,
			name: "Local Player",
			role: "PLAYER",
			updatedAt: now,
		},
		{
			createdAt: now,
			email: credentials.adminEmail,
			emailVerified: true,
			id: FIXTURE_IDS.adminUser,
			isTestAccount: true,
			name: "Local Administrator",
			role: "ADMIN",
			updatedAt: now,
		},
	]);

	await db.insert(accounts).values([
		{
			accountId: FIXTURE_IDS.playerUser,
			createdAt: now,
			id: "account_local_player",
			issuer: createLocalAccountIssuer("credential"),
			password: await hashPassword(credentials.playerPassword),
			providerId: "credential",
			updatedAt: now,
			userId: FIXTURE_IDS.playerUser,
		},
		{
			accountId: FIXTURE_IDS.adminUser,
			createdAt: now,
			id: "account_local_admin",
			issuer: createLocalAccountIssuer("credential"),
			password: await hashPassword(credentials.adminPassword),
			providerId: "credential",
			updatedAt: now,
			userId: FIXTURE_IDS.adminUser,
		},
	]);

	const fixtureVod = getLocalFixtureVod();
	const demoVod = getLocalDemoFixtureVod();
	await db.insert(vods).values([fixtureVod, demoVod]);
	const fixtureScenarios = getLocalFixtureScenarios(FIXTURE_IDS.vod);
	const demoScenarios = getLocalDemoFixtureScenarios(FIXTURE_IDS.demoVod);
	await db.insert(scenarios).values(fixtureScenarios);
	await db.insert(scenarios).values(demoScenarios);

	return {
		adminEmail: credentials.adminEmail,
		playerEmail: credentials.playerEmail,
		scenariosCount: fixtureScenarios.length + demoScenarios.length,
		vodId: FIXTURE_IDS.vod,
	};
}
