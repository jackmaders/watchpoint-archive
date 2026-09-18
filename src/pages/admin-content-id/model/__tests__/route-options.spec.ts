import { describe, expect, it } from "vitest";
import { loadAdminContentIdPage } from "../../api/loaders";
import { adminContentIdRouteOptions } from "../route-options";

describe("admin-content-id route options", () => {
	it("wires the eager admin content detail loader", () => {
		// Arrange & Act & Assert
		expect(adminContentIdRouteOptions.loader).toBe(loadAdminContentIdPage);
	});
});
