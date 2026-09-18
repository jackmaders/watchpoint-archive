/**
 * Lazy presentation adapter for the administrative VOD catalog.
 *
 * Binds `AdminContentRouteComponent` to `/admin/content` while data loading remains eager
 * and presentation is delegated to the `pages/admin-content` slice.
 */
/* v8 ignore file */

import { createLazyFileRoute } from "@tanstack/react-router";
import { AdminContentRouteComponent } from "@/pages/admin-content";

export const Route = createLazyFileRoute("/admin/content")({
	component: AdminContentRouteComponent,
});
