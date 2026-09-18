/**
 * Unit test suite verifying database seeder execution, fixture insertion, and account credential setup.
 *
 * Tests `executeSeed` using mock database clients, asserting proper deletion sequence, user creation,
 * Better Auth compatible account issuer linking, and fixture counts.
 */

import { describe, expect, it, vi } from "vitest";
import { executeSeed } from "../seeder";

vi.mock("better-auth/crypto");

describe("executeSeed", () => {
	it("deletes existing rows and inserts fixtures into database", async () => {
		// Arrange
		const deletedTables: unknown[] = [];
		const insertedRows: Array<{ table: unknown; values: unknown }> = [];

		const mockDb = {
			delete: vi.fn((table: unknown) => {
				deletedTables.push(table);
				return Promise.resolve();
			}),
			insert: vi.fn((table: unknown) => ({
				values: vi.fn((values: unknown) => {
					insertedRows.push({ table, values });
					return Promise.resolve();
				}),
			})),
		};

		// Act
		const result = await executeSeed(mockDb as never);

		// Assert
		expect(deletedTables.length).toBeGreaterThan(0);
		expect(insertedRows.length).toBe(5); // users, accounts, vods, fixture scenarios, demo scenarios
		expect(result.scenariosCount).toBe(13);
		expect(result.adminEmail).toBe("admin@local.watchpoint");
		expect(result.playerEmail).toBe("player@local.watchpoint");
		expect(insertedRows[1]?.values).toEqual([
			expect.objectContaining({
				accountId: "usr_local_player",
				id: "account_local_player",
				issuer: "local:credential",
				providerId: "credential",
				userId: "usr_local_player",
			}),
			expect.objectContaining({
				accountId: "usr_local_admin",
				id: "account_local_admin",
				issuer: "local:credential",
				providerId: "credential",
				userId: "usr_local_admin",
			}),
		]);
		const insertedVods = insertedRows[2]?.values as Array<{ id: string }>;
		expect(insertedVods).toHaveLength(2);
		expect(insertedVods.map((v) => v.id)).toEqual([
			"vod_local_fixture",
			"vod_demo_interactive",
		]);
		const fixtureScenarios = insertedRows[3]?.values as Array<{
			id: string;
			vodId: string;
		}>;
		expect(fixtureScenarios).toHaveLength(5);
		const demoScenarios = insertedRows[4]?.values as Array<{
			id: string;
			vodId: string;
		}>;
		expect(demoScenarios).toHaveLength(8);
	});
});
