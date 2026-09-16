import { describe, expect, it } from "vitest";
import { validateVodsSearch, vodsSearchSchema } from "../search-params";

describe("validateVodsSearch", () => {
	it("parses valid search parameters for map, hero, levelOfPlay, and player", () => {
		// Arrange
		const raw = {
			hero: "Ana",
			levelOfPlay: "Grandmaster",
			map: "King's Row",
			player: "Viol2t",
		};

		// Act
		const result = validateVodsSearch(raw);

		// Assert
		expect(result).toEqual({
			hero: "Ana",
			levelOfPlay: "Grandmaster",
			map: "King's Row",
			player: "Viol2t",
		});
	});

	it("parses partial search parameters", () => {
		// Arrange
		const raw = {
			hero: "Tracer",
			map: "Circuit Royal",
		};

		// Act
		const result = validateVodsSearch(raw);

		// Assert
		expect(result).toEqual({
			hero: "Tracer",
			map: "Circuit Royal",
		});
	});

	it("returns empty object when search input is empty or invalid", () => {
		// Arrange
		const raw = {
			hero: "",
		};

		// Act
		const result = validateVodsSearch(raw);

		// Assert
		expect(result).toEqual({});
	});

	it("schema safely validates unknown input", () => {
		// Arrange & Act
		const parsed = vodsSearchSchema.safeParse({ levelOfPlay: "FACEIT" });

		// Assert
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.levelOfPlay).toBe("FACEIT");
		}
	});
});
