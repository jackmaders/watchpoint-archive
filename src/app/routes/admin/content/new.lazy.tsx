/**
 * Lazy presentation adapter for creating a VOD training asset.
 *
 * Binds `AdminContentNewRouteComponent` to `/admin/content/new` and delegates the complete
 * creation presentation to the `pages/admin-content-new` slice.
 */
import { createLazyFileRoute } from "@tanstack/react-router";
import { AdminContentNewRouteComponent } from "@/pages/admin-content-new";

export const Route = createLazyFileRoute("/admin/content/new")({
	component: AdminContentNewRouteComponent,
});
