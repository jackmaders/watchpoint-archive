import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router");
vi.mock("@/pages/privacy");

import { privacyRouteOptions } from "@/pages/privacy";
import { Route } from "../privacy";

describe("Privacy route", () => {
	it("wires privacyRouteOptions into createFileRoute", () => {
		// Arrange & Act & Assert
		expect(Route.options).toEqual(privacyRouteOptions);
	});
});
