/**
 * Provides deterministic fixture data shared by browser demos and server seed workflows.
 *
 * Re-exports static fixture identifiers and builders without exposing credential policy,
 * Better Auth cryptography, Drizzle schemas, or mutation-capable seed operations.
 */

export {
	FIXTURE_DEMO_VOD,
	FIXTURE_IDS,
	FIXTURE_VOD,
	getLocalDemoFixtureScenarios,
	getLocalDemoFixtureVod,
	getLocalFixtureScenarios,
	getLocalFixtureVod,
} from "./fixtures";
