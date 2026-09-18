/**
 * Lazy presentation adapter for an individual playthrough history record.
 *
 * Binds `HistoryIdRouteComponent` to `/history/$id` while data loading remains eager and
 * presentation is delegated to the `pages/history-id` slice.
 */
import { createLazyFileRoute } from "@tanstack/react-router";
import { HistoryIdRouteComponent } from "@/pages/history-id";

export const Route = createLazyFileRoute("/history/$id")({
	component: HistoryIdRouteComponent,
});
