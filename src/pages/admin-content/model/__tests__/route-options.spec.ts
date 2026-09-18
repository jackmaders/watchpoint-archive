import { describe, expect, it } from "vitest";
import { loadAdminContent } from "../../api/loaders";
import { adminContentRouteOptions } from "../route-options";

describe("admin content route options", () => {
	it("wires the eager admin content loader", () => {
		// Arrange & Act & Assert
		expect(adminContentRouteOptions.loader).toBe(loadAdminContent);
	});
});
