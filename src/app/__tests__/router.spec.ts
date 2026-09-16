import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router");
vi.mock("@tanstack/react-router-ssr-query");
vi.mock("@tanstack/react-query");
vi.mock("@/shared/lib/auth-client");

import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { registerSessionSync } from "@/shared/lib/auth-client";
import { createRouter } from "../router";
import { routeTree } from "../routeTree.gen";

describe("createRouter", () => {
	it("instantiates QueryClient, passes it to router context, calls setupRouterSsrQueryIntegration, and registers session sync", () => {
		// Arrange
		const mockQueryClient = { mock: "query-client" };
		vi.mocked(QueryClient).mockImplementation(function (this: unknown) {
			return mockQueryClient as unknown as QueryClient;
		});
		const mockRouter = { mock: "router", options: {} };
		vi.mocked(createTanStackRouter).mockReturnValue(
			mockRouter as unknown as ReturnType<typeof createTanStackRouter>,
		);

		// Act
		const router = createRouter();

		// Assert
		expect(createTanStackRouter).toHaveBeenCalledWith({
			context: {
				queryClient: mockQueryClient,
			},
			defaultPreload: "intent",
			routeTree,
			scrollRestoration: true,
		});
		expect(setupRouterSsrQueryIntegration).toHaveBeenCalledWith({
			queryClient: mockQueryClient,
			router: mockRouter,
		});
		expect(registerSessionSync).toHaveBeenCalledWith({
			queryClient: mockQueryClient,
			router: mockRouter,
		});
		expect(router).toBe(mockRouter);
	});
});
