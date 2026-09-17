/**
 * Defines static test fixtures, deterministic identifiers, and synthetic VOD and scenario
 * models used for seeding local development and testing databases.
 *
 * Implements deterministic fixture data. Exports `FIXTURE_IDS`, `FIXTURE_VOD`, `FIXTURE_DEMO_VOD`,
 * `getLocalFixtureVod`, `getLocalDemoFixtureVod`, `getLocalFixtureScenarios`, and
 * `getLocalDemoFixtureScenarios` covering learning module types (Strategy, Tactics,
 * Tracking, and Spatial Awareness) with polymorphic configurations.
 */

import type { ModuleType } from "../schema/scenario";
import type { JsonValue } from "../types";

export const FIXTURE_IDS = {
	adminUser: "usr_local_admin",
	demoVod: "vod_demo_interactive",
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

export const FIXTURE_DEMO_VOD = {
	durationSeconds: 600,
	heroName: "Ana",
	id: FIXTURE_IDS.demoVod,
	isDemo: true,
	isPublished: true,
	mapName: "Busan",
	rankTier: "OWCS",
	role: "SUPPORT" as const,
	title: "OWCS Ana — Busan (Shu)",
	youtubeVideoId: "PHVmqR1ANtc",
} as const;

export function getLocalDemoFixtureVod() {
	return {
		...FIXTURE_DEMO_VOD,
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

const DEMO_FIXTURE_SCENARIOS: FixtureScenarioItem[] = [
	{
		explanationText:
			"The Downtown train platform provides superior elevation and unobstructed sightlines across the point while the billboard provides immediate hard cover against hitscan poke.",
		id: "scenario_demo_strategy_1",
		inputConfig: {
			options: [
				{
					id: "opt_dt_train_platform",
					is_correct: true,
					text: "Hold high ground train platform with cover behind the billboard",
				},
				{
					id: "opt_dt_point_floor",
					is_correct: false,
					text: "Stand directly on the point behind low-ground obstacles",
				},
				{
					id: "opt_dt_arcade_flank",
					is_correct: false,
					text: "Push aggressively through the underground arcade tunnel",
				},
			],
		},
		moduleType: "STRATEGY",
		promptText:
			"During the opening neutral fight on Busan Downtown, where should Ana establish initial positioning?",
		timestampSeconds: 20,
	},
	{
		explanationText:
			"Holding the elevated temple terrace keeps Ana out of enemy dive range while preserving sightlines to heal frontline tanks and rotate through the courtyard.",
		id: "scenario_demo_strategy_2",
		inputConfig: {
			options: [
				{
					id: "opt_sanc_terrace",
					is_correct: true,
					text: "Position on the raised temple terrace near the drum for elevation and escape options",
				},
				{
					id: "opt_sanc_gazebo",
					is_correct: false,
					text: "Drop inside the central gazebo directly on the point",
				},
				{
					id: "opt_sanc_coastal_cliff",
					is_correct: false,
					text: "Hold the narrow coastal flank corridor by the cliff edge",
				},
			],
		},
		moduleType: "STRATEGY",
		promptText:
			"Your team has captured Busan Sanctuary and the enemy team is grouping for a retake from main. How should you position?",
		timestampSeconds: 85,
	},
	{
		explanationText:
			"Landing Sleep Dart on an enraged Winston neutralizes his massive health pool and knockback threat, allowing you to escape the hazard zone safely.",
		id: "scenario_demo_tactics_1",
		inputConfig: {
			options: [
				{
					id: "opt_meka_primal_sleep",
					is_correct: true,
					text: "Bait the landing punch, land Sleep Dart mid-swing, and reposition away from the pit edge",
				},
				{
					id: "opt_meka_nade_self",
					is_correct: false,
					text: "Throw Biotic Grenade at your own feet and primary fire Winston repeatedly",
				},
				{
					id: "opt_meka_panic_nano",
					is_correct: false,
					text: "Immediately Nano Boost your co-support to save them",
				},
			],
		},
		moduleType: "TACTICS",
		promptText:
			"An enemy Winston leaps onto you with Primal Rage activated on Busan MEKA Base. What is your immediate ability sequence?",
		timestampSeconds: 150,
	},
	{
		explanationText:
			"Prematurely using Biotic Grenade into Kitsune Rush allows Kiriko to cleanse with Suzu; holding it until Suzu is baited secures a decisive counter-engage.",
		id: "scenario_demo_tactics_2",
		inputConfig: {
			options: [
				{
					id: "opt_dt_hold_nade_suzu",
					is_correct: true,
					text: "Hold Biotic Grenade until Protection Suzu is forced or Kitsune path narrows, then anti-heal the advance",
				},
				{
					id: "opt_dt_rush_nade_instant",
					is_correct: false,
					text: "Immediately throw Biotic Grenade into the center of the Kitsune path",
				},
				{
					id: "opt_dt_self_heal_only",
					is_correct: false,
					text: "Use Biotic Grenade exclusively on yourself for self-healing",
				},
			],
		},
		moduleType: "TACTICS",
		promptText:
			"The enemy team commits Kiriko's Kitsune Rush through Downtown choke. How should you use your Biotic Grenade?",
		timestampSeconds: 215,
	},
	{
		explanationText:
			"Tracer's Recall has a 12-second cooldown. Tracking the 8-second vulnerability window allows Ana and teammates to punish aggressive blinks.",
		id: "scenario_demo_tracking_1",
		inputConfig: {
			options: [
				{
					id: "opt_sanc_recall_cooldown",
					is_correct: true,
					text: "Recall is on cooldown for 8 more seconds — ping Tracer to coordinate burst focus",
				},
				{
					id: "opt_sanc_recall_ready",
					is_correct: false,
					text: "Recall is already available",
				},
				{
					id: "opt_sanc_ignore_tracer",
					is_correct: false,
					text: "Tracer cannot be eliminated without Sleep Dart",
				},
			],
		},
		moduleType: "TRACKING",
		promptText:
			"The enemy Tracer used Recall 4 seconds ago on Sanctuary. What is the current status of her escape cooldown?",
		timestampSeconds: 280,
	},
	{
		explanationText:
			"Pacing and extended absence indicate EMP is ready for an initiation; pre-spreading prevents both supports from being silenced simultaneously.",
		id: "scenario_demo_tracking_2",
		inputConfig: {
			options: [
				{
					id: "opt_meka_emp_ready",
					is_correct: true,
					text: "EMP is fully charged — spread out from your co-support and anticipate the engage",
				},
				{
					id: "opt_meka_emp_low",
					is_correct: false,
					text: "EMP is at approximately 25% charge",
				},
				{
					id: "opt_meka_sombra_swapped",
					is_correct: false,
					text: "Sombra has switched heroes in spawn",
				},
			],
		},
		moduleType: "TRACKING",
		promptText:
			"Enemy Sombra has completed two EMP farming rotations and hasn't uncloaked in 15 seconds on MEKA Base. What is her ultimate status?",
		timestampSeconds: 345,
	},
	{
		explanationText:
			"Catwalk audio cues indicate an elevated flanker seeking an overhead drop angle onto vulnerable backline supports.",
		id: "scenario_demo_spatial_1",
		inputConfig: {
			options: [
				{
					id: "opt_meka_catwalk_threat",
					is_correct: true,
					text: "Top catwalk rafters above the blast shields looking down onto the point",
				},
				{
					id: "opt_meka_sublevel_tunnel",
					is_correct: false,
					text: "Sub-level maintenance tunnel beneath the core",
				},
				{
					id: "opt_meka_spawn_choke",
					is_correct: false,
					text: "Directly from the enemy team's main spawn choke",
				},
			],
		},
		moduleType: "SPATIAL",
		promptText:
			"Audio cues reveal high-frequency footsteps above Busan MEKA Base control room. Where is the threat approaching from?",
		timestampSeconds: 410,
	},
	{
		explanationText:
			"Sound localization behind the wooden partition confirms the coastal garden flank route, providing advance warning before the wall-climb engage.",
		id: "scenario_demo_spatial_2",
		inputConfig: {
			options: [
				{
					id: "opt_sanc_garden_flank",
					is_correct: true,
					text: "Left-side coastal garden route preparing for a wall-climb dive over the bell pavilion",
				},
				{
					id: "opt_sanc_main_gate",
					is_correct: false,
					text: "Main central gate staircase",
				},
				{
					id: "opt_sanc_far_cliff",
					is_correct: false,
					text: "Far right cliff edge beyond the health pack",
				},
			],
		},
		moduleType: "SPATIAL",
		promptText:
			"You hear a Genji double-jump sound behind the wooden partition on Busan Sanctuary. What is the flank angle?",
		timestampSeconds: 475,
	},
];

function mapScenarios(scenarios: FixtureScenarioItem[], vodId: string) {
	return scenarios.map((scenario) => ({
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

export function getLocalFixtureScenarios(vodId: string) {
	return mapScenarios(FIXTURE_SCENARIOS, vodId);
}

export function getLocalDemoFixtureScenarios(
	vodId: string = FIXTURE_IDS.demoVod,
) {
	return mapScenarios(DEMO_FIXTURE_SCENARIOS, vodId);
}
