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
		expect(insertedRows.length).toBe(4); // users, accounts, vods, scenarios
		expect(result.scenariosCount).toBe(5);
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
	});
});
