import { describe, expect, it } from "vitest";
import { loadVodsPage, vodsBeforeLoad } from "../../api/loaders";
import { VodsRouteComponent } from "../../ui/vods-route";
import { vodsRouteOptions } from "../route-options";
import { vodsSearchSchema } from "../search-params";

describe("vodsRouteOptions", () => {
	it("wires vodsBeforeLoad, loadVodsPage, VodsRouteComponent, validateSearch, and loaderDeps", () => {
		// Arrange & Act & Assert
		expect(vodsRouteOptions.beforeLoad).toBe(vodsBeforeLoad);
		expect(vodsRouteOptions.loader).toBe(loadVodsPage);
		expect(vodsRouteOptions.component).toBe(VodsRouteComponent);
		expect(vodsRouteOptions.validateSearch).toBe(vodsSearchSchema);
		expect(
			vodsRouteOptions.loaderDeps({ search: { map: "King's Row" } }),
		).toEqual({ map: "King's Row" });
	});
});
