import { describe, expect, it } from "vitest";
import { validateSessionSearch } from "../session-search";

describe("validateSessionSearch", () => {
	it("parses valid session search parameters", () => {
		// Arrange
		const raw = {
			modules: "AIM,CD_TRACKING",
		};

		// Act
		const result = validateSessionSearch(raw);

		// Assert
		expect(result).toEqual(raw);
	});

	it("handles empty search parameters", () => {
		// Arrange
		const raw = {};

		// Act
		const result = validateSessionSearch(raw);

		// Assert
		expect(result).toEqual({});
	});

	it("throws on invalid search parameters", () => {
		// Arrange
		const raw = {
			modules: 123,
		};

		// Act & Assert
		expect(() => validateSessionSearch(raw)).toThrow();
	});
});
