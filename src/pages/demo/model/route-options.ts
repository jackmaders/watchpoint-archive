/**
 * Route configuration options for the public interactive demo training session (`/demo`).
 *
 * Configures the eager `demoRouteOptions` loader without authentication guards; UI loads lazily.
 */
import { loadDemoPage } from "../api/loaders";

export const demoRouteOptions = {
	loader: loadDemoPage,
};
