/**
 * Route options and loader bindings for the playthrough detail view.
 *
 * Configures the eager history-detail loader while the route presentation loads lazily.
 */
import { loadHistoryIdPage } from "../api/loaders";

export const historyIdRouteOptions = {
	loader: loadHistoryIdPage,
};
