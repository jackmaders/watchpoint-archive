import { describe, expect, it } from "vitest";
import { historyBeforeLoad, loadHistoryIndexPage } from "../../api/loaders";
import { historyRouteOptions } from "../route-options";
import { historySearchSchema } from "../search-params";

describe("history route options", () => {
	it("wires historyBeforeLoad, loadHistoryIndexPage, and historySearchSchema", () => {
		// Arrange & Act & Assert
		expect(historyRouteOptions.beforeLoad).toBe(historyBeforeLoad);
		expect(historyRouteOptions.loader).toBe(loadHistoryIndexPage);
		expect(historyRouteOptions.validateSearch).toBe(historySearchSchema);

		const search = { page: 1 };
		expect(historyRouteOptions.loaderDeps({ search })).toBe(search);
	});
});
