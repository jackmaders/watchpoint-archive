import { describe, expect, it } from "vitest";
import { loadVodsIdSessionPage } from "../../api/loaders";
import { vodsIdSessionRouteOptions } from "../route-options";
import { sessionSearchSchema } from "../session-search";

describe("vods-id-session route options", () => {
	it("wires loadVodsIdSessionPage and sessionSearchSchema", () => {
		// Arrange & Act & Assert
		expect(vodsIdSessionRouteOptions.loader).toBe(loadVodsIdSessionPage);
		expect(vodsIdSessionRouteOptions.validateSearch).toBe(sessionSearchSchema);

		const search = { modules: "STRATEGY" };
		expect(vodsIdSessionRouteOptions.loaderDeps({ search })).toBe(search);
	});
});
