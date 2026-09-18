/**
 * Route configuration options for the VOD catalog browser page (`/vods`).
 *
 * Configures `vodsRouteOptions` binding the auth guard, loader, search schema, and catalog presentation.
 */
import { loadVodsPage, vodsBeforeLoad } from "../api/loaders";
import { VodsRouteComponent } from "../ui/vods-route";
import { vodsSearchSchema } from "./search-params";

export const vodsRouteOptions = {
	beforeLoad: vodsBeforeLoad,
	component: VodsRouteComponent,
	loader: loadVodsPage,
	loaderDeps: ({ search }: { search: Record<string, unknown> }) => search,
	validateSearch: vodsSearchSchema,
};
