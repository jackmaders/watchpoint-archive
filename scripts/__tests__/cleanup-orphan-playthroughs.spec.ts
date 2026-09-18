import { describe, expect, it, vi } from "vitest";
import * as playthroughQueries from "../../src/shared/db/api/queries/playthroughs";
import { executeCleanupOrphanPlaythroughs } from "../cleanup-orphan-playthroughs";

describe("executeCleanupOrphanPlaythroughs", () => {
	it("deletes orphaned IN_PROGRESS playthroughs and returns deleted count", async () => {
		// Arrange
		const mockDeleted = [
			{ id: "orphan-1", status: "IN_PROGRESS" as const },
			{ id: "orphan-2", status: "IN_PROGRESS" as const },
		];
		vi.spyOn(
			playthroughQueries,
			"deleteOrphanInProgressPlaythroughs",
		).mockResolvedValueOnce(mockDeleted as never);

		// Act
		const result = await executeCleanupOrphanPlaythroughs({} as never);

		// Assert
		expect(
			playthroughQueries.deleteOrphanInProgressPlaythroughs,
		).toHaveBeenCalled();
		expect(result).toEqual({ deletedCount: 2 });
	});

	it("returns 0 when no orphaned records are found", async () => {
		// Arrange
		vi.spyOn(
			playthroughQueries,
			"deleteOrphanInProgressPlaythroughs",
		).mockResolvedValueOnce([]);

		// Act
		const result = await executeCleanupOrphanPlaythroughs({} as never);

		// Assert
		expect(result).toEqual({ deletedCount: 0 });
	});
});
