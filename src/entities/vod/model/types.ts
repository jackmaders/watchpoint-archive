/**
 * Type definitions and entity contracts for VOD catalog items, interactive scenarios, and session manifests.
 */

import type {
	HeroRole,
	InputType,
	ModuleType,
	scenarios,
	VodTransportRecord,
} from "@/shared/db";

export type { HeroRole, InputType, ModuleType };

export type VodItem = VodTransportRecord;
export type ScenarioItem = typeof scenarios.$inferSelect;

export type PublishedVodItem = VodItem & {
	scenarios: Array<{ id: string }>;
};

export type SessionManifest = VodItem & {
	scenarios: ScenarioItem[];
};
