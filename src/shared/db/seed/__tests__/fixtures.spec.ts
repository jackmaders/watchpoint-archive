import { describe, expect, it } from "vitest";
import {
	FIXTURE_DEMO_VOD,
	FIXTURE_IDS,
	FIXTURE_VOD,
	getLocalDemoFixtureScenarios,
	getLocalDemoFixtureVod,
	getLocalFixtureScenarios,
	getLocalFixtureVod,
} from "../fixtures";

describe("seed fixtures", () => {
	it("exposes stable fixture identifiers", () => {
		// Arrange
		const expectedIds = {
			adminUser: "usr_local_admin",
			demoVod: "vod_demo_interactive",
			playerUser: "usr_local_player",
			vod: "vod_local_fixture",
		};

		// Act
		const ids = FIXTURE_IDS;

		// Assert
		expect(ids).toEqual(expectedIds);
	});

	it("returns a synthetic local VOD fixture with valid defaults", () => {
		// Arrange
		const expectedId = FIXTURE_IDS.vod;

		// Act
		const vod = getLocalFixtureVod();

		// Assert
		expect(vod.id).toBe(expectedId);
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

	it("returns an OWCS Ana Busan demo VOD fixture with valid defaults", () => {
		// Arrange
		const expectedId = FIXTURE_IDS.demoVod;

		// Act
		const demoVod = getLocalDemoFixtureVod();

		// Assert
		expect(demoVod.id).toBe(expectedId);
		expect(demoVod.title).toBe(FIXTURE_DEMO_VOD.title);
		expect(demoVod.heroName).toBe("Ana");
		expect(demoVod.mapName).toBe("Busan");
		expect(demoVod.rankTier).toBe("OWCS");
		expect(demoVod.role).toBe("SUPPORT");
		expect(demoVod.durationSeconds).toBe(600);
		expect(demoVod.youtubeVideoId).toBe("PHVmqR1ANtc");
		expect(demoVod.isDemo).toBe(true);
		expect(demoVod.isPublished).toBe(true);
		expect(demoVod.createdAt).toBeInstanceOf(Date);
	});

	it("generates 5 distinct module scenarios for the local fixture VOD", () => {
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

	it("generates 8 distinct module scenarios across all 4 types for the demo VOD", () => {
		// Arrange
		const vodId = FIXTURE_IDS.demoVod;

		// Act
		const scenarios = getLocalDemoFixtureScenarios(vodId);

		// Assert
		expect(scenarios).toHaveLength(8);
		const moduleCounts = scenarios.reduce(
			(acc, s) => {
				acc[s.moduleType] = (acc[s.moduleType] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);
		expect(moduleCounts.STRATEGY).toBe(2);
		expect(moduleCounts.TACTICS).toBe(2);
		expect(moduleCounts.TRACKING).toBe(2);
		expect(moduleCounts.SPATIAL).toBe(2);

		for (const scenario of scenarios) {
			expect(scenario.vodId).toBe(vodId);
			expect(scenario.inputType).toBe("MULTIPLE_CHOICE");
			expect(scenario.timeLimitSeconds).toBe(10);
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
