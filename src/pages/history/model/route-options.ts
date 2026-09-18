/**
 * Route options and search parameter validation for the player match history route.
 *
 * Configures the auth guard, loader, and search schema while the history presentation loads lazily.
 */
import { historyBeforeLoad, loadHistoryIndexPage } from "../api/loaders";
import { historySearchSchema } from "./search-params";

export const historyRouteOptions = {
	beforeLoad: historyBeforeLoad,
	loader: loadHistoryIndexPage,
	loaderDeps: ({ search }: { search: Record<string, unknown> }) => search,
	validateSearch: historySearchSchema,
};
