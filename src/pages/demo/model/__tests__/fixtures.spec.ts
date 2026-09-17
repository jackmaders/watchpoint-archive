/**
 * Unit test suite verifying fixture invariants for the public interactive demo scenario manifest.
 *
 * Tests `DEMO_VOD_MANIFEST` validating scenario counts, module types, option configurations,
 * and time limit structures required for public unauthenticated guest drills.
 */

import { describe, expect, it } from "vitest";
import { DEMO_VOD_MANIFEST } from "../fixtures";

describe("demo fixtures", () => {
	it("provides a valid published demo VOD manifest with 8 curated scenarios across all 4 module types", () => {
		// Arrange
		const manifest = DEMO_VOD_MANIFEST;

		// Act
		const scenarioCount = manifest.scenarios.length;

		// Assert
		expect(manifest.id).toBe("vod_demo_interactive");
		expect(manifest.isDemo).toBe(true);
		expect(manifest.isPublished).toBe(true);
		expect(manifest.heroName).toBe("Ana");
		expect(manifest.mapName).toBe("Busan");
		expect(manifest.rankTier).toBe("OWCS");
		expect(manifest.role).toBe("SUPPORT");
		expect(manifest.youtubeVideoId).toBe("PHVmqR1ANtc");
		expect(scenarioCount).toBe(8);

		const moduleCounts = manifest.scenarios.reduce(
			(acc, scenario) => {
				acc[scenario.moduleType] = (acc[scenario.moduleType] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		expect(moduleCounts.STRATEGY).toBe(2);
		expect(moduleCounts.TACTICS).toBe(2);
		expect(moduleCounts.TRACKING).toBe(2);
		expect(moduleCounts.SPATIAL).toBe(2);

		for (const scenario of manifest.scenarios) {
			expect(scenario.vodId).toBe("vod_demo_interactive");
			expect(scenario.inputType).toBe("MULTIPLE_CHOICE");
			expect(scenario.timeLimitSeconds).toBe(10);
			expect(scenario.promptText.length).toBeGreaterThan(10);
			expect(scenario.explanationText.length).toBeGreaterThan(10);

			const options = scenario.inputConfig.options as Array<{
				id: string;
				is_correct: boolean;
				text: string;
			}>;
			expect(Array.isArray(options)).toBe(true);
			expect(options.length).toBeGreaterThanOrEqual(2);
			expect(options.some((opt) => opt.is_correct)).toBe(true);
		}
	});
});
