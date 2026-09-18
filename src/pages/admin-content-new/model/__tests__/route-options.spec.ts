import { describe, expect, it } from "vitest";
import { adminContentNewRouteOptions } from "../route-options";

describe("admin-content-new route options", () => {
	it("leaves presentation to the lazy route companion", () => {
		// Arrange & Act & Assert
		expect(adminContentNewRouteOptions).toEqual({});
	});
});
