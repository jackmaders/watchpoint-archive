/**
 * Route configuration options for the admin content catalog view.
 *
 * Configures the eager `adminContentRouteOptions` loader while the catalog UI loads lazily.
 */
import { loadAdminContent } from "../api/loaders";

export const adminContentRouteOptions = {
	loader: loadAdminContent,
};
