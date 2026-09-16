/**
 * Route configuration options for the VOD catalog browser page (`/vods`).
 *
 * Configures `vodsRouteOptions` binding `vodsBeforeLoad` auth guard and `loadVodsPage` to `VodsRouteComponent`.
 */
import { loadVodsPage, vodsBeforeLoad } from "../api/loaders";
import { VodsRouteComponent } from "../ui/vods-route";

export const vodsRouteOptions = {
	beforeLoad: vodsBeforeLoad,
	component: VodsRouteComponent,
	loader: loadVodsPage,
};
