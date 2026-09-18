/**
 * Lazy presentation adapter for the protected administration layout.
 *
 * Binds `AdminLayoutRouteComponent` to `/admin` while the eager route retains its access
 * guard and delegates layout presentation to `widgets/layout-admin`.
 */
/* v8 ignore file */

import { createLazyFileRoute } from "@tanstack/react-router";
import { AdminLayoutRouteComponent } from "@/widgets/layout-admin";

export const Route = createLazyFileRoute("/admin")({
	component: AdminLayoutRouteComponent,
});
