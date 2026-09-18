import { describe, expect, it } from "vitest";
import { loadDemoPage } from "../../api/loaders";
import { demoRouteOptions } from "../route-options";

describe("demoRouteOptions", () => {
	it("wires loadDemoPage without an auth guard", () => {
		// Arrange & Act & Assert
		expect(demoRouteOptions.loader).toBe(loadDemoPage);
		expect(
			(demoRouteOptions as Record<string, unknown>).beforeLoad,
		).toBeUndefined();
	});
});
