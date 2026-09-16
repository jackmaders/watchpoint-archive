/**
 * Defines static test fixtures, deterministic identifiers, and synthetic VOD and scenario
 * models used for seeding local development and testing databases.
 *
 * Implements deterministic fixture data. Exports `FIXTURE_IDS`, `FIXTURE_VOD`, `getLocalFixtureVod`,
 * and `getLocalFixtureScenarios` covering learning module types (Strategy, Tactics,
 * Tracking, and Spatial Awareness) with polymorphic configurations.
 */

export const FIXTURE_IDS = {
	adminUser: "usr_local_admin",
	playerUser: "usr_local_player",
	vod: "vod_local_fixture",
} as const;

export const FIXTURE_VOD = {
	durationSeconds: 960,
	heroName: "Ana",
	id: FIXTURE_IDS.vod,
	isPublished: true,
	mapName: "King's Row",
	rankTier: "Grandmaster",
	role: "SUPPORT" as const,
	title: "Grandmaster Ana — King's Row Defense & Streets Phase",
	youtubeVideoId: "local-fixture-video",
} as const;

export function getLocalFixtureVod() {
	return {
		...FIXTURE_VOD,
		createdAt: new Date(),
	};
}

const FIXTURE_SCENARIOS = [
	{
		explanationText:
			"Holding the high ground balcony maintains sightlines over the choke while keeping safe retreat routes to the mega health pack.",
		id: "scenario_local_strategy",
		moduleType: "STRATEGY" as const,
		promptText:
			"Where should Ana position during the enemy team's initial push through the King's Row choke?",
	},
	{
		explanationText:
			"Saving Biotic Grenade for the enemy Winston's jump commitment cancels his healing bubble advantage and enables your team to collapse.",
		id: "scenario_local_tactics",
		moduleType: "TACTICS" as const,
		promptText:
			"The enemy Winston dives your co-support with Barrier Shield. What is your immediate tactical priority?",
	},
	{
		explanationText:
			"Tracking enemy ultimate economy indicates the opposing Reinhardt has Earthshatter ready after two uninterrupted hammer swings in the previous fight.",
		id: "scenario_local_ultimate",
		moduleType: "TRACKING" as const,
		promptText:
			"Based on previous fight pacing, what is the status of the enemy Reinhardt's Earthshatter?",
	},
	{
		explanationText:
			"Kiriko just used Protection Suzu to cleanse an anti-heal grenade, leaving a 14-second vulnerability window for your Nano-Boosted teammate.",
		id: "scenario_local_cooldown",
		moduleType: "TRACKING" as const,
		promptText:
			"Enemy Kiriko deployed Protection Suzu 3 seconds ago. Is the defensive cooldown available for the upcoming Nano-Blade?",
	},
	{
		explanationText:
			"Footstep audio and lack of frontline presence suggest the enemy Reaper is flanking through the King's Row hotel corridor.",
		id: "scenario_local_spatial",
		moduleType: "SPATIAL" as const,
		promptText:
			"Where is the unspotted enemy Reaper most likely rotating to set up Death Blossom?",
	},
] as const;

export function getLocalFixtureScenarios(vodId: string) {
	return FIXTURE_SCENARIOS.map((scenario, index) => ({
		explanationText: scenario.explanationText,
		id: scenario.id,
		inputConfig: {
			options: [
				{ id: "correct", is_correct: true, text: "Best decision" },
				{ id: "other", is_correct: false, text: "Other decision" },
			],
		},
		inputType: "MULTIPLE_CHOICE" as const,
		moduleType: scenario.moduleType,
		promptText: scenario.promptText,
		timestampSeconds: 60 + index * 60,
		vodId,
	}));
}
