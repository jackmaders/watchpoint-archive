/**
 * Route configuration options for the public interactive demo training session (`/demo`).
 *
 * Configures `demoRouteOptions` binding `loadDemoPage` to `DemoRouteComponent` without authentication guards.
 */
import { loadDemoPage } from "../api/loaders";
import { DemoRouteComponent } from "../ui/demo-route";

export const demoRouteOptions = {
	component: DemoRouteComponent,
	loader: loadDemoPage,
};
