/**
 * Lazy presentation adapter for editing an existing VOD training asset.
 *
 * Binds `AdminContentIdRouteComponent` to `/admin/content/$id` while loader execution remains
 * eager and editor presentation is delegated to `pages/admin-content-id`.
 */
import { createLazyFileRoute } from "@tanstack/react-router";
import { AdminContentIdRouteComponent } from "@/pages/admin-content-id";

export const Route = createLazyFileRoute("/admin/content/$id")({
	component: AdminContentIdRouteComponent,
});
