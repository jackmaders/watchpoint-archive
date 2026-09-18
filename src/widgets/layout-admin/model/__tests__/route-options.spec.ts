import { describe, expect, it } from "vitest";
import { adminBeforeLoad } from "../../api/admin-guard";
import { adminRouteOptions } from "../route-options";

describe("admin layout route options", () => {
	it("wires the eager admin access guard", () => {
		// Arrange & Act & Assert
		expect(adminRouteOptions.beforeLoad).toBe(adminBeforeLoad);
	});
});
