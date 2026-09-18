import { describe, expect, it, vi } from "vitest";

vi.unmock("@tanstack/react-start");
vi.mock("../api/auth-server");

import {
	getRegistrationStatusHandler,
	getSessionUserHandler,
} from "../api/auth-functions";
import * as server from "../api/auth-server";
import { authApiRouteOptions, handleAuthRequest } from "../api/route-handler";

describe("authentication API boundary", () => {
	it("exposes GET and POST auth route handlers", () => {
		expect(authApiRouteOptions.server.handlers.GET).toBe(handleAuthRequest);
		expect(authApiRouteOptions.server.handlers.POST).toBe(handleAuthRequest);
	});

	it("delegates the auth request to the server implementation", async () => {
		const request = new Request("http://localhost/api/auth/session");

		expect(await handleAuthRequest({ request })).toBeInstanceOf(Response);
		expect(server.handleAuthRequest).toHaveBeenCalledWith({ request });
	});

	it("loads registration status through the server implementation", async () => {
		expect(await getRegistrationStatusHandler()).toBe(false);
		expect(server.isRegistrationOpen).toHaveBeenCalledTimes(1);
	});

	it("loads the current user through the server implementation", async () => {
		expect(await getSessionUserHandler()).toEqual({ id: "user-1" });
		expect(server.getCurrentUser).toHaveBeenCalledTimes(1);
	});
});
