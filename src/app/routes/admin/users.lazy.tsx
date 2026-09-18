/**
 * Lazy presentation adapter for administrative user management.
 *
 * Binds `AdminUsersRouteComponent` to `/admin/users` while data loading remains eager and
 * presentation is delegated to the `pages/admin-users` slice.
 */
/* v8 ignore file */

import { createLazyFileRoute } from "@tanstack/react-router";
import { AdminUsersRouteComponent } from "@/pages/admin-users";

export const Route = createLazyFileRoute("/admin/users")({
	component: AdminUsersRouteComponent,
});
