/**
 * Unit test suite verifying the structure and exported interface of the browser-side Better Auth client.
 *
 * Asserts that `authClient` correctly exposes expected session lifecycle and authentication methods,
 * and verifies that `registerSessionSync` and `invalidateSessionState` trigger router and query cache updates.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	authClient,
	authClientOptions,
	getSessionSyncTarget,
	invalidateSessionState,
	registerSessionSync,
} from "../auth-client";

describe("auth client", () => {
	beforeEach(() => {
		registerSessionSync({ queryClient: undefined, router: undefined });
	});

	it("exposes the Better Auth session lifecycle methods", () => {
		// Arrange
		const client = authClient as typeof authClient & {
			signIn: { email: unknown };
			signOut: unknown;
			signUp: { email: unknown };
			useSession: unknown;
		};

		// Act
		const methods = [
			client.signIn.email,
			client.signOut,
			client.signUp.email,
			client.useSession,
		];

		// Assert
		expect(methods.every((method) => typeof method === "function")).toBe(true);
	});

	it("registers router and queryClient for session synchronization", () => {
		// Arrange
		const mockRouter = { invalidate: vi.fn() };
		const mockQueryClient = { invalidateQueries: vi.fn() };

		// Act
		registerSessionSync({
			queryClient: mockQueryClient,
			router: mockRouter,
		});

		// Assert
		expect(getSessionSyncTarget()).toEqual({
			queryClient: mockQueryClient,
			router: mockRouter,
		});
	});

	it("invalidates router and queryClient when invalidateSessionState is invoked", async () => {
		// Arrange
		const mockRouter = { invalidate: vi.fn().mockResolvedValue(undefined) };
		const mockQueryClient = {
			invalidateQueries: vi.fn().mockResolvedValue(undefined),
		};
		registerSessionSync({
			queryClient: mockQueryClient,
			router: mockRouter,
		});

		// Act
		await invalidateSessionState();

		// Assert
		expect(mockRouter.invalidate).toHaveBeenCalledTimes(1);
		expect(mockQueryClient.invalidateQueries).toHaveBeenCalledTimes(1);
	});

	it("handles missing router or queryClient safely in invalidateSessionState", async () => {
		// Arrange
		registerSessionSync({
			queryClient: undefined,
			router: undefined,
		});

		// Act & Assert
		await expect(invalidateSessionState()).resolves.toBeUndefined();
	});

	it("triggers invalidateSessionState on fetchOptions onSuccess hook", async () => {
		// Arrange
		const mockRouter = { invalidate: vi.fn().mockResolvedValue(undefined) };
		registerSessionSync({ router: mockRouter });

		// Act
		await authClientOptions.fetchOptions.onSuccess();

		// Assert
		expect(mockRouter.invalidate).toHaveBeenCalledTimes(1);
	});
});
