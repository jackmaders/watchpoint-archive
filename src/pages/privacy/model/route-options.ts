/**
 * Route configuration options for the Privacy Statement page (`/privacy`).
 *
 * Configures `privacyRouteOptions` binding `loadPrivacyPage` to `PrivacyRouteComponent`.
 */
import { loadPrivacyPage } from "../api/loaders";
import { PrivacyRouteComponent } from "../ui/privacy-route";

export const privacyRouteOptions = {
	component: PrivacyRouteComponent,
	loader: loadPrivacyPage,
};
