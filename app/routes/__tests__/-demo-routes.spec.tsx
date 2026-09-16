import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router");
vi.mock("@/pages/demo");

import { demoRouteOptions } from "@/pages/demo";
import { Route } from "../demo";

describe("Demo route", () => {
	it("wires demoRouteOptions into createFileRoute", () => {
		// Arrange
		const expectedOptions = demoRouteOptions;

		// Act
		const routeOptions = Route.options;

		// Assert
		expect(routeOptions).toEqual(expectedOptions);
	});
});
