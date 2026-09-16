import { describe, expect, it } from "vitest";
import {
	DEFAULT_MODULE_TYPES,
	MODULE_DEFINITIONS,
	MODULE_MAP,
} from "../modules";

describe("modules model", () => {
	it("contains 4 default module types", () => {
		// Arrange & Act & Assert
		expect(DEFAULT_MODULE_TYPES).toHaveLength(4);
		expect(DEFAULT_MODULE_TYPES).toContain("STRATEGY");
		expect(DEFAULT_MODULE_TYPES).toContain("TACTICS");
		expect(DEFAULT_MODULE_TYPES).toContain("TRACKING");
		expect(DEFAULT_MODULE_TYPES).toContain("SPATIAL");
	});

	it("creates a complete map of all module definitions", () => {
		// Arrange & Act & Assert
		expect(Object.keys(MODULE_MAP)).toHaveLength(MODULE_DEFINITIONS.length);
		for (const def of MODULE_DEFINITIONS) {
			expect(MODULE_MAP[def.key]).toEqual(def);
		}
	});
});
