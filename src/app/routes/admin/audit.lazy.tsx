/**
 * Lazy presentation adapter for administrative audit review.
 *
 * Binds `AdminAuditRouteComponent` to `/admin/audit` while eager search validation and data
 * loading remain in the core route and presentation stays in `pages/admin-audit`.
 */
/* v8 ignore file */

import { createLazyFileRoute } from "@tanstack/react-router";
import { AdminAuditRouteComponent } from "@/pages/admin-audit";

export const Route = createLazyFileRoute("/admin/audit")({
	component: AdminAuditRouteComponent,
});
