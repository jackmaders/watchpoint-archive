/**
 * Type definitions and contracts for the admin content catalog slice.
 */

import type { VodTransportRecord } from "@/shared/db";

export type AdminVodItem = VodTransportRecord & {
	scenarios: Array<{ id: string }>;
};
