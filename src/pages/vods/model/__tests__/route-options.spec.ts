import { describe, expect, it } from "vitest";
import { loadVodsPage, vodsBeforeLoad } from "../../api/loaders";
import { VodsRouteComponent } from "../../ui/vods-route";
import { vodsRouteOptions } from "../route-options";

describe("vodsRouteOptions", () => {
	it("wires vodsBeforeLoad, loadVodsPage, and VodsRouteComponent", () => {
		// Arrange & Act & Assert
		expect(vodsRouteOptions.beforeLoad).toBe(vodsBeforeLoad);
		expect(vodsRouteOptions.loader).toBe(loadVodsPage);
		expect(vodsRouteOptions.component).toBe(VodsRouteComponent);
	});
});
