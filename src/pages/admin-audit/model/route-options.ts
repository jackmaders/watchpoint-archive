/**
 * Route definition and configuration options for the admin audit trail route.
 *
 * Configures `adminAuditRouteOptions` with `loadAdminAudit` and `validateAuditSearch`
 * while the audit presentation is loaded through the route's lazy companion.
 */
import { loadAdminAudit } from "../api/loaders";
import type { AuditSearchParams } from "./search-params";
import { validateAuditSearch } from "./search-params";

export const adminAuditRouteOptions = {
	loader: loadAdminAudit,
	loaderDeps: ({ search }: { search: AuditSearchParams }) => search,
	validateSearch: validateAuditSearch,
};
