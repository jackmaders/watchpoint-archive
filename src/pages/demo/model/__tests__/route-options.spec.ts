import { describe, expect, it } from "vitest";
import { loadDemoPage } from "../../api/loaders";
import { DemoRouteComponent } from "../../ui/demo-route";
import { demoRouteOptions } from "../route-options";

describe("demoRouteOptions", () => {
	it("wires loadDemoPage and DemoRouteComponent without auth guard", () => {
		// Arrange & Act & Assert
		expect(demoRouteOptions.loader).toBe(loadDemoPage);
		expect(demoRouteOptions.component).toBe(DemoRouteComponent);
		expect(
			(demoRouteOptions as Record<string, unknown>).beforeLoad,
		).toBeUndefined();
	});
});
