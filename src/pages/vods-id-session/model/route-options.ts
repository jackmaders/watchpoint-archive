/**
 * Route options and loader bindings for the interactive VOD training session view.
 *
 * Configures the loader and search schema while the interactive session presentation loads lazily.
 */
import { loadVodsIdSessionPage } from "../api/loaders";
import { sessionSearchSchema } from "./session-search";

export const vodsIdSessionRouteOptions = {
	loader: loadVodsIdSessionPage,
	loaderDeps: ({ search }: { search: Record<string, unknown> }) => search,
	validateSearch: sessionSearchSchema,
};
