/**
 * Route options and loader bindings for the admin content editor view.
 *
 * Defines the eager editor loader while the route presentation is loaded lazily.
 */
import { loadAdminContentIdPage } from "../api/loaders";

export const adminContentIdRouteOptions = {
	loader: loadAdminContentIdPage,
};
