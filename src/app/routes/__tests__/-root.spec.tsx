import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router");
vi.mock("@/shared/auth");

import { getSessionUser } from "@/shared/auth";
import { Route } from "../__root";

describe("Root route", () => {
	it("wires root route options and shell components", () => {
		// Arrange & Act
		const rootOptions = Route.options;

		// Assert
		expect(rootOptions).toBeDefined();
		expect(rootOptions.component).toBeDefined();
		expect(rootOptions.head).toBeDefined();
		expect(rootOptions.notFoundComponent).toBeDefined();
		expect(rootOptions.beforeLoad).toBeDefined();
	});

	it("resolves session user in beforeLoad", async () => {
		// Arrange
		const mockUser = { id: "u1", name: "Player One", role: "PLAYER" };
		vi.mocked(getSessionUser).mockResolvedValueOnce(mockUser as never);

		// Act
		const result = await Route.options.beforeLoad?.({} as never);

		// Assert
		expect(result).toEqual({ user: mockUser });
	});

	it("returns null user in beforeLoad when getSessionUser throws an error", async () => {
		// Arrange
		vi.mocked(getSessionUser).mockRejectedValueOnce(new Error("Auth failed"));

		// Act
		const result = await Route.options.beforeLoad?.({} as never);

		// Assert
		expect(result).toEqual({ user: null });
	});
});
