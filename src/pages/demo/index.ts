/**
 * Public API for the unauthenticated interactive demo playthrough slice.
 *
 * Re-exports the public interface of `src/pages/demo/` adhering to Feature-Sliced Design (FSD).
 * Exposes loaders, route options, model fixtures, and page UI components.
 */
export {
	demoPageQueryOptions,
	loadDemoPage,
} from "./api/loaders";
export { DEMO_VOD_MANIFEST } from "./model/fixtures";
export { demoRouteOptions } from "./model/route-options";
export { DemoPage, type DemoPageProps } from "./ui/demo-page";
export { DemoRouteComponent } from "./ui/demo-route";
