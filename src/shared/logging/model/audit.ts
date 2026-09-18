import { z } from "zod";
import type { auditEntries } from "@/shared/db";

export type AuditEntryItem = typeof auditEntries.$inferSelect;

export const GetAdminAuditLogsSchema = z.object({
	action: z.string().optional(),
	actorUserId: z.string().optional(),
	entityId: z.string().optional(),
	entityType: z.string().optional(),
	limit: z.number().int().positive().optional(),
	offset: z.number().int().nonnegative().optional(),
	search: z.string().optional(),
});

export type GetAdminAuditLogsPayload = z.infer<typeof GetAdminAuditLogsSchema>;
