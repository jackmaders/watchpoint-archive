/**
 * Defines static test fixtures, deterministic identifiers, and synthetic VOD and scenario
 * models used for seeding local development and testing databases.
 *
 * Implements deterministic fixture data. Exports `FIXTURE_IDS`, `FIXTURE_VOD`, `getLocalFixtureVod`,
 * and `getLocalFixtureScenarios` covering learning module types (Strategy, Tactics,
 * Tracking, and Spatial Awareness) with polymorphic configurations.
 */

import type { ModuleType } from "../schema/scenario";
import type { JsonValue } from "../types";

export const FIXTURE_IDS = {
	adminUser: "usr_local_admin",
	playerUser: "usr_local_player",
	vod: "vod_local_fixture",
} as const;

export const FIXTURE_VOD = {
	durationSeconds: 960,
	heroName: "Brigitte",
	id: FIXTURE_IDS.vod,
	isDemo: true,
	isPublished: true,
	mapName: "King's Row",
	rankTier: "Grandmaster",
	role: "SUPPORT" as const,
	title: "Grandmaster Brigitte — King's Row Defense & Streets Phase",
	youtubeVideoId: "fyorxMHfass",
} as const;

export function getLocalFixtureVod() {
	return {
		...FIXTURE_VOD,
		createdAt: new Date(),
	};
}

interface FixtureScenarioItem {
	explanationText: string;
	id: string;
	inputConfig: Record<string, JsonValue>;
	moduleType: ModuleType;
	promptText: string;
	timestampSeconds: number;
}

const FIXTURE_SCENARIOS: FixtureScenarioItem[] = [
	{
		explanationText:
			"Holding corner cover near the statue maintains Inspire uptime via Whip Shot while preventing enemy poke from breaking your Barrier Shield.",
		id: "scenario_local_strategy",
		inputConfig: {
			options: [
				{
					id: "opt_statue_cover",
					is_correct: true,
					text: "Hold corner cover near statue to proc Inspire with Whip Shot",
				},
				{
					id: "opt_open_choke",
					is_correct: false,
					text: "Stand in open choke with shield raised",
				},
				{
					id: "opt_hotel_flank",
					is_correct: false,
					text: "Solo flank through the hotel corridor",
				},
			],
		},
		moduleType: "STRATEGY",
		promptText:
			"Where should Brigitte position during the enemy team's initial push through the King's Row choke?",
		timestampSeconds: 45,
	},
	{
		explanationText:
			"Using Whip Shot boops Winston out of your co-support's immediate hitbox and procs Inspire, while Repair Pack sustains them through initial zap damage.",
		id: "scenario_local_tactics",
		inputConfig: {
			options: [
				{
					id: "opt_whip_pack",
					is_correct: true,
					text: "Whip Shot Winston to displace dive and apply Repair Pack to co-support",
				},
				{
					id: "opt_shield_bash_in",
					is_correct: false,
					text: "Shield Bash directly into Winston's bubble",
				},
				{
					id: "opt_retreat",
					is_correct: false,
					text: "Back up to spawn and abandon co-support",
				},
			],
		},
		moduleType: "TACTICS",
		promptText:
			"The enemy Winston dives your co-support with Barrier Shield. What is your immediate tactical priority?",
		timestampSeconds: 110,
	},
	{
		explanationText:
			"Tracking enemy ultimate economy indicates the opposing Reinhardt has Earthshatter ready after two uninterrupted hammer swings and firestrikes in the previous fight.",
		id: "scenario_local_ultimate",
		inputConfig: {
			options: [
				{
					id: "opt_shatter_ready",
					is_correct: true,
					text: "Earthshatter is ready — hold Shield Bash to interrupt or block angle",
				},
				{
					id: "opt_shatter_low",
					is_correct: false,
					text: "Earthshatter is below 50% charge",
				},
			],
		},
		moduleType: "TRACKING",
		promptText:
			"Based on previous fight pacing and hammer contact, what is the status of the enemy Reinhardt's Earthshatter?",
		timestampSeconds: 195,
	},
	{
		explanationText:
			"Tracer's Recall has a 12-second cooldown, creating a 9-second window where Shield Bash + primary attack can confirm an elimination without escape.",
		id: "scenario_local_cooldown",
		inputConfig: {
			options: [
				{
					id: "opt_recall_down",
					is_correct: true,
					text: "No Recall for 9s — ping Tracer and look for Shield Bash combo",
				},
				{
					id: "opt_ignore",
					is_correct: false,
					text: "Ignore Tracer and focus enemy tank",
				},
			],
		},
		moduleType: "TRACKING",
		promptText:
			"Enemy Tracer used Recall 3 seconds ago after taking poke damage. What is your cooldown callout?",
		timestampSeconds: 280,
	},
	{
		explanationText:
			"Listening to vertical audio cues identifies the enemy DPS attempting a drop-down flank from the upper archway balcony above the choke.",
		id: "scenario_local_spatial",
		inputConfig: {
			options: [
				{
					id: "opt_arch_highground",
					is_correct: true,
					text: "Upper archway balcony looking over the choke",
				},
				{
					id: "opt_underground_subway",
					is_correct: false,
					text: "Subway tunnels below point",
				},
				{
					id: "opt_spawn_exit",
					is_correct: false,
					text: "Enemy spawn doors",
				},
			],
		},
		moduleType: "SPATIAL",
		promptText:
			"Audio cues indicate footsteps on high ground above King's Row arch. Where is the flanker rotating?",
		timestampSeconds: 370,
	},
];

export function getLocalFixtureScenarios(vodId: string) {
	return FIXTURE_SCENARIOS.map((scenario) => ({
		explanationText: scenario.explanationText,
		id: scenario.id,
		imageUrl: null,
		inputConfig: scenario.inputConfig,
		inputType: "MULTIPLE_CHOICE" as const,
		moduleType: scenario.moduleType,
		promptText: scenario.promptText,
		timeLimitSeconds: 10,
		timestampSeconds: scenario.timestampSeconds,
		vodId,
	}));
}
