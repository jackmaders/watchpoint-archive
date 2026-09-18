/**
 * Exposes a cross-cutting server function to query structured administrative audit logs,
 * enabling authorized administrative interfaces to inspect system mutations and governance events.
 *
 * Implements `getAdminAuditLogs` as an authenticated TanStack Start server function using `createServerFn`.
 * Enforces the `audit:view` capability via `requirePermission`, validates query pagination and filter parameters
 * through `GetAdminAuditLogsSchema`, and delegates retrieval to `queryAuditEntries` in the shared database layer.
 */

import { createServerFn } from "@tanstack/react-start";
import { requirePermission } from "@/shared/auth/index.server";
import { queryAuditEntries } from "@/shared/db/index.server";
import { type AuditEntryItem, GetAdminAuditLogsSchema } from "../model/audit";

export { GetAdminAuditLogsSchema } from "../model/audit";

export const getAdminAuditLogs = createServerFn({ method: "GET" })
	.validator((data: unknown) => {
		const parsed = GetAdminAuditLogsSchema.safeParse(data ?? {});
		if (!parsed.success) {
			throw new Error("Invalid audit query payload");
		}
		return parsed.data;
	})
	.handler(async ({ data }): Promise<AuditEntryItem[]> => {
		await requirePermission("audit:view");
		const filter: Record<string, unknown> = {};
		if (data.actorUserId) filter.actorUserId = { eq: data.actorUserId };
		if (data.entityId) filter.entityId = { eq: data.entityId };
		if (data.entityType) filter.entityType = { eq: data.entityType };
		if (data.action && data.action !== "ALL") {
			filter.action = { eq: data.action };
		}

		return queryAuditEntries({
			filter,
			limit: data.limit,
			order: { createdAt: "desc" },
		});
	});
