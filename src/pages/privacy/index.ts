/**
 * Public API for the Privacy Statement page slice.
 *
 * Re-exports the public interface of `src/pages/privacy/` adhering to Feature-Sliced Design (FSD).
 * Exposes loaders, query options, route options, model types, and page UI components.
 */
export {
	fetchPrivacyPage,
	loadPrivacyPage,
	privacyPageQueryOptions,
} from "./api/loaders";
export { privacyRouteOptions } from "./model/route-options";
export type { PrivacyPageProps } from "./model/types";
export { PrivacyPage } from "./ui/privacy-page";
export { PrivacyRouteComponent } from "./ui/privacy-route";
