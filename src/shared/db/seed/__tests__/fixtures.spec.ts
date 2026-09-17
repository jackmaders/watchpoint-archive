import { describe, expect, it } from "vitest";
import {
	FIXTURE_IDS,
	FIXTURE_VOD,
	getLocalFixtureScenarios,
	getLocalFixtureVod,
} from "../fixtures";

describe("seed fixtures", () => {
	it("exposes stable fixture identifiers", () => {
		// Arrange
		const ids = FIXTURE_IDS;

		// Act & Assert
		expect(ids.adminUser).toBe("usr_local_admin");
		expect(ids.playerUser).toBe("usr_local_player");
		expect(ids.vod).toBe("vod_local_fixture");
	});

	it("returns a synthetic local VOD fixture with valid defaults", () => {
		// Arrange & Act
		const vod = getLocalFixtureVod();

		// Assert
		expect(vod.id).toBe(FIXTURE_IDS.vod);
		expect(vod.title).toBe(FIXTURE_VOD.title);
		expect(vod.heroName).toBe("Brigitte");
		expect(vod.mapName).toBe("King's Row");
		expect(vod.rankTier).toBe("Grandmaster");
		expect(vod.role).toBe("SUPPORT");
		expect(vod.durationSeconds).toBe(960);
		expect(vod.youtubeVideoId).toBe("fyorxMHfass");
		expect(vod.isDemo).toBe(true);
		expect(vod.isPublished).toBe(true);
		expect(vod.createdAt).toBeInstanceOf(Date);
	});

	it("generates 5 distinct module scenarios for the VOD", () => {
		// Arrange
		const vodId = FIXTURE_IDS.vod;

		// Act
		const scenarios = getLocalFixtureScenarios(vodId);

		// Assert
		expect(scenarios).toHaveLength(5);
		const moduleTypes = scenarios.map((s) => s.moduleType);
		expect(moduleTypes).toEqual([
			"STRATEGY",
			"TACTICS",
			"TRACKING",
			"TRACKING",
			"SPATIAL",
		]);
		for (const scenario of scenarios) {
			expect(scenario.vodId).toBe(vodId);
			expect(scenario.inputType).toBe("MULTIPLE_CHOICE");
			const options = scenario.inputConfig.options as unknown[];
			expect(Array.isArray(options)).toBe(true);
			expect(options.length).toBeGreaterThanOrEqual(2);
		}
	});
});
