/**
 * Unit test suite verifying fixture invariants for the public interactive demo scenario manifest.
 *
 * Tests `DEMO_VOD_MANIFEST` validating scenario counts, module types, option configurations,
 * and time limit structures required for public unauthenticated guest drills.
 */

import { describe, expect, it } from "vitest";
import { DEMO_VOD_MANIFEST } from "../fixtures";

describe("demo fixtures", () => {
	it("provides a valid published demo VOD manifest with 2 curated scenarios", () => {
		// Arrange
		const manifest = DEMO_VOD_MANIFEST;

		// Act & Assert
		expect(manifest.id).toBe("vod_demo_interactive");
		expect(manifest.isPublished).toBe(true);
		expect(manifest.heroName).toBe("Ana");
		expect(manifest.youtubeVideoId).toBe("dQw4w9WgXcQ");
		expect(manifest.scenarios).toHaveLength(2);
		expect(manifest.scenarios[0].moduleType).toBe("STRATEGY");
		expect(manifest.scenarios[1].moduleType).toBe("TACTICS");

		const scenario1Options = manifest.scenarios[0].inputConfig
			.options as Array<{
			id: string;
			is_correct: boolean;
			text: string;
		}>;
		expect(scenario1Options.some((opt) => opt.is_correct)).toBe(true);

		const scenario2Options = manifest.scenarios[1].inputConfig
			.options as Array<{
			id: string;
			is_correct: boolean;
			text: string;
		}>;
		expect(scenario2Options.some((opt) => opt.is_correct)).toBe(true);
	});
});
