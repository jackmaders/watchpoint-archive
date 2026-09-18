/**
 * Lazy presentation adapter for the player's training history.
 *
 * Binds `HistoryRouteComponent` to `/history/` while authentication, search validation, and
 * data loading remain eager and presentation stays in `pages/history`.
 */
/* v8 ignore file */

import { createLazyFileRoute } from "@tanstack/react-router";
import { HistoryRouteComponent } from "@/pages/history";

export const Route = createLazyFileRoute("/history/")({
	component: HistoryRouteComponent,
});
