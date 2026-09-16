import { describe, expect, it } from "vitest";
import { validateHistorySearch } from "../search-params";

describe("validateHistorySearch", () => {
	it("parses valid search parameters including advanced filters", () => {
		// Arrange
		const raw = {
			hero: "Tracer",
			levelOfPlay: "GM Ranked",
			map: "King's Row",
			modules: ["STRATEGY", "TACTICS"],
			page: "2",
			pageSize: "20",
			player: "Proper",
			vodId: "vod_123",
		};

		// Act
		const result = validateHistorySearch(raw);

		// Assert
		expect(result).toEqual({
			hero: "Tracer",
			levelOfPlay: "GM Ranked",
			map: "King's Row",
			modules: ["STRATEGY", "TACTICS"],
			page: 2,
			pageSize: 20,
			player: "Proper",
			vodId: "vod_123",
		});
	});

	it("parses comma-separated modules string", () => {
		// Arrange
		const raw = {
			modules: "STRATEGY,TRACKING",
		};

		// Act
		const result = validateHistorySearch(raw);

		// Assert
		expect(result.modules).toEqual(["STRATEGY", "TRACKING"]);
	});

	it("returns empty object when search input is invalid", () => {
		// Arrange
		const raw = {
			page: "-5",
			pageSize: "1000",
		};

		// Act
		const result = validateHistorySearch(raw);

		// Assert
		expect(result).toEqual({});
	});
});
