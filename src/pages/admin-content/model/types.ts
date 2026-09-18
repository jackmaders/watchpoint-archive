/**
 * Type definitions and contracts for the admin content catalog slice.
 */

import type { HeroRole, VodTransportRecord } from "@/shared/db";

export type { HeroRole };

export type AdminVodItem = VodTransportRecord & {
	scenarios: Array<{ id: string }>;
};
