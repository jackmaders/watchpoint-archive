import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../db");
vi.mock("@tanstack/react-start/server");

import { getRequestHeaders } from "@tanstack/react-start/server";
import { queryUsers } from "../../db";
import {
	createAuthInstance,
	getAuth,
	getAuthConfig,
	getCurrentUser,
	handleAuthRequest,
	isRegistrationOpen,
} from "../server";

const authConfig = {
	allowRegistration: false,
	baseURL: "http://localhost:3000",
	emailAndPassword: { disableSignUp: false, enabled: true },
	secret: "test-secret-key-123456789012345678901234",
	session: { expiresIn: 1000, updateAge: 100 },
};

function sessionUser(role?: string) {
	return {
		session: {
			createdAt: new Date(),
			expiresAt: new Date(),
			id: "sess_123",
			token: "tok_123",
			updatedAt: new Date(),
			userId: "usr_123",
		},
		user: {
			createdAt: new Date(),
			email: "player@example.com",
			emailVerified: true,
			id: "usr_123",
			name: "Player 1",
			...(role ? { role } : {}),
			updatedAt: new Date(),
		},
	};
}

describe("server authentication", () => {
	beforeEach(() => {
		vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
		vi.stubEnv(
			"BETTER_AUTH_SECRET",
			"test-secret-key-123456789012345678901234",
		);
		vi.clearAllMocks();
	});

	it("validates and resolves authentication configuration", () => {
		expect(() => getAuthConfig({})).toThrow(
			"BETTER_AUTH_URL must be configured",
		);
		expect(() =>
			getAuthConfig({ BETTER_AUTH_URL: "https://watchpoint.example.com" }),
		).toThrow("BETTER_AUTH_SECRET must be configured");

		expect(
			getAuthConfig({
				BETTER_AUTH_SECRET: "custom-secret",
				BETTER_AUTH_URL: "https://watchpoint.example.com",
			}),
		).toEqual({
			allowRegistration: false,
			baseURL: "https://watchpoint.example.com",
			emailAndPassword: { disableSignUp: false, enabled: true },
			secret: "custom-secret",
			session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
		});
		expect(
			getAuthConfig({
				BETTER_AUTH_ALLOW_REGISTRATION: "true",
				BETTER_AUTH_SECRET: "custom-secret",
				BETTER_AUTH_URL: "https://watchpoint.example.com",
			}).allowRegistration,
		).toBe(true);
	});

	it("creates and caches the Better Auth instance", async () => {
		const auth = getAuth();

		expect(auth).toBeDefined();
		expect(auth.handler).toBeInstanceOf(Function);
		expect(getAuth()).toBe(auth);
	});

	it("assigns roles and rejects closed registration in the user hook", async () => {
		const firstUser = { email: "first@example.com", name: "First" };
		vi.mocked(queryUsers).mockResolvedValueOnce([]);
		const firstHook = (
			createAuthInstance({}, authConfig).options as never as {
				databaseHooks: {
					user: {
						create: { before: (user: typeof firstUser) => Promise<unknown> };
					};
				};
			}
		).databaseHooks.user.create.before;
		expect(await firstHook(firstUser)).toEqual({
			data: { ...firstUser, role: "ADMIN" },
		});

		vi.mocked(queryUsers).mockResolvedValueOnce([{ id: "u-1" } as never]);
		const openConfig = { ...authConfig, allowRegistration: true };
		const openHook = (
			createAuthInstance({}, openConfig).options as never as {
				databaseHooks: {
					user: {
						create: { before: (user: typeof firstUser) => Promise<unknown> };
					};
				};
			}
		).databaseHooks.user.create.before;
		expect(await openHook(firstUser)).toEqual({
			data: { ...firstUser, role: "PLAYER" },
		});

		vi.mocked(queryUsers).mockResolvedValueOnce([{ id: "u-1" } as never]);
		const closedHook = (
			createAuthInstance({}, authConfig).options as never as {
				databaseHooks: {
					user: {
						create: { before: (user: typeof firstUser) => Promise<unknown> };
					};
				};
			}
		).databaseHooks.user.create.before;
		await expect(closedHook(firstUser)).rejects.toThrow(
			"Registration is currently closed.",
		);
	});

	it("resolves users from request headers and handles missing sessions", async () => {
		const auth = getAuth();
		const getSession = vi.spyOn(auth.api, "getSession");
		getSession.mockResolvedValueOnce(sessionUser("ADMIN") as never);
		expect(await getCurrentUser(new Headers({ cookie: "session=1" }))).toEqual({
			email: "player@example.com",
			id: "usr_123",
			name: "Player 1",
			role: "ADMIN",
		});

		getSession.mockResolvedValueOnce({
			user: { id: "usr_456" },
		} as never);
		expect(await getCurrentUser({ cookie: "session=2" })).toEqual({
			email: undefined,
			id: "usr_456",
			name: undefined,
			role: "PLAYER",
		});

		getSession.mockResolvedValueOnce(null as never);
		expect(await getCurrentUser(new Headers({ cookie: "invalid" }))).toBeNull();

		getSession.mockRejectedValueOnce(new Error("Auth failed"));
		expect(await getCurrentUser(new Headers({ cookie: "error" }))).toBeNull();
	});

	it("returns null when request headers are unavailable", async () => {
		vi.mocked(getRequestHeaders).mockImplementationOnce(
			() => undefined as never,
		);
		expect(await getCurrentUser(null)).toBeNull();

		vi.mocked(getRequestHeaders).mockImplementationOnce(() => {
			throw new Error("Out of request context");
		});
		expect(await getCurrentUser()).toBeNull();
	});

	it("checks registration state from configuration and users", async () => {
		expect(
			await isRegistrationOpen({ BETTER_AUTH_ALLOW_REGISTRATION: "true" }),
		).toBe(true);

		vi.mocked(queryUsers).mockResolvedValueOnce([]);
		expect(
			await isRegistrationOpen({ BETTER_AUTH_ALLOW_REGISTRATION: "false" }),
		).toBe(true);

		vi.mocked(queryUsers).mockResolvedValueOnce([{ id: "usr_1" } as never]);
		expect(
			await isRegistrationOpen({ BETTER_AUTH_ALLOW_REGISTRATION: "false" }),
		).toBe(false);

		vi.mocked(queryUsers).mockRejectedValueOnce(new Error("Database offline"));
		expect(
			await isRegistrationOpen({ BETTER_AUTH_ALLOW_REGISTRATION: "false" }),
		).toBe(false);
	});

	it("delegates auth requests to the Better Auth handler", async () => {
		const auth = getAuth();
		const response = new Response("ok");
		const handler = vi.spyOn(auth, "handler").mockResolvedValueOnce(response);
		const request = new Request("http://localhost:3000/api/auth/session");

		expect(await handleAuthRequest({ request })).toBe(response);
		expect(handler).toHaveBeenCalledWith(request);
	});
});
