/**
 * Lazy presentation adapter for an interactive VOD training session.
 *
 * Binds `VodsIdSessionRouteComponent` to `/vods/$id/session` while loader and search parsing
 * remain eager and presentation is delegated to `pages/vods-id-session`.
 */
import { createLazyFileRoute } from "@tanstack/react-router";
import { VodsIdSessionRouteComponent } from "@/pages/vods-id-session";

export const Route = createLazyFileRoute("/vods/$id/session")({
	component: VodsIdSessionRouteComponent,
});
