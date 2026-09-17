/**
 * Curated static interactive demo VOD fixture for public unauthenticated gameplay drills.
 *
 * Implements `DEMO_VOD_MANIFEST` providing an OWCS Ana match drill on Busan (Shu) with curated
 * decision scenarios across Strategy, Tactics, Tracking, and Spatial Awareness module types.
 */
import type { SessionManifest } from "@/entities/vod";
import { FIXTURE_DEMO_VOD, getLocalDemoFixtureScenarios } from "@/shared/db";

export const DEMO_VOD_MANIFEST: SessionManifest = {
	...FIXTURE_DEMO_VOD,
	createdAt: new Date("2026-01-01T00:00:00.000Z"),
	scenarios: getLocalDemoFixtureScenarios(FIXTURE_DEMO_VOD.id),
};
