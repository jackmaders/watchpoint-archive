/**
 * Curated static interactive demo VOD fixture for public unauthenticated gameplay drills.
 *
 * Implements `DEMO_VOD_MANIFEST` providing a high-impact Grandmaster match drill with curated
 * Strategy and Tactics decision scenarios, enabling instant visitor preview without backend dependencies.
 */
import type { SessionManifest } from "@/entities/vod";

export const DEMO_VOD_MANIFEST: SessionManifest = {
	createdAt: new Date("2026-01-01T00:00:00.000Z"),
	durationSeconds: 300,
	heroName: "Ana",
	id: "vod_demo_interactive",
	isPublished: true,
	mapName: "King's Row",
	rankTier: "Grandmaster",
	role: "SUPPORT",
	scenarios: [
		{
			explanationText:
				"Holding the high ground balcony maintains sightlines over the choke while keeping safe retreat routes to the mega health pack.",
			id: "scenario_demo_strategy",
			imageUrl: null,
			inputConfig: {
				options: [
					{
						id: "opt_balcony",
						is_correct: true,
						text: "Hold high ground balcony sightline with cover",
					},
					{
						id: "opt_lowground",
						is_correct: false,
						text: "Drop to low ground behind the payload",
					},
					{
						id: "opt_hotel",
						is_correct: false,
						text: "Push into the hotel corridor",
					},
				],
			},
			inputType: "MULTIPLE_CHOICE",
			moduleType: "STRATEGY",
			promptText:
				"Where should Ana position during the enemy team's initial push through the King's Row choke?",
			timeLimitSeconds: 10,
			timestampSeconds: 15,
			vodId: "vod_demo_interactive",
		},
		{
			explanationText:
				"Saving Biotic Grenade for the enemy Winston's jump commitment cancels his healing bubble advantage and enables your team to collapse.",
			id: "scenario_demo_tactics",
			imageUrl: null,
			inputConfig: {
				options: [
					{
						id: "opt_bio_nade",
						is_correct: true,
						text: "Save Biotic Grenade for Winston's bubble landing to anti-heal",
					},
					{
						id: "opt_sleep_dart",
						is_correct: false,
						text: "Immediately fire Sleep Dart at the enemy frontline tank",
					},
					{
						id: "opt_retreat",
						is_correct: false,
						text: "Turn and run away from your co-support",
					},
				],
			},
			inputType: "MULTIPLE_CHOICE",
			moduleType: "TACTICS",
			promptText:
				"The enemy Winston dives your co-support with Barrier Shield. What is your immediate tactical priority?",
			timeLimitSeconds: 10,
			timestampSeconds: 35,
			vodId: "vod_demo_interactive",
		},
	],
	title: "Grandmaster Ana — Interactive Tactical Demo",
	youtubeVideoId: "local-fixture-video",
};
