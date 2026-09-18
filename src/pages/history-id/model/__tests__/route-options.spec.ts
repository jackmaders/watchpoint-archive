import { describe, expect, it } from "vitest";
import { loadHistoryIdPage } from "../../api/loaders";
import { historyIdRouteOptions } from "../route-options";

describe("history-id route options", () => {
	it("wires the eager history detail loader", () => {
		// Arrange & Act & Assert
		expect(historyIdRouteOptions.loader).toBe(loadHistoryIdPage);
	});
});
