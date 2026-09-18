/**
 * Type definitions and contracts for the admin audit log page slice.
 */

import type { AuditEntryItem } from "@/shared/logging";

interface UserSummaryItem {
	email: string;
	id: string;
	name: string | null;
}

export type AdminAuditLogItem = AuditEntryItem & {
	actor?: UserSummaryItem | null;
};
