import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	authClient,
	authClientOptions,
	getSessionSyncTarget,
	invalidateSessionState,
	registerSessionSync,
} from "../client";

describe("browser authentication client", () => {
	beforeEach(() => {
		registerSessionSync({ queryClient: undefined, router: undefined });
	});

	it("exposes the Better Auth session lifecycle methods", () => {
		expect(typeof authClient.signIn.email).toBe("function");
		expect(typeof authClient.signOut).toBe("function");
		expect(typeof authClient.signUp.email).toBe("function");
		expect(typeof authClient.useSession).toBe("function");
	});

	it("registers router and query client for session synchronization", () => {
		const router = { invalidate: vi.fn() };
		const queryClient = { invalidateQueries: vi.fn() };

		registerSessionSync({ queryClient, router });

		expect(getSessionSyncTarget()).toEqual({ queryClient, router });
	});

	it("invalidates registered session consumers", async () => {
		const router = { invalidate: vi.fn().mockResolvedValue(undefined) };
		const queryClient = {
			invalidateQueries: vi.fn().mockResolvedValue(undefined),
		};
		registerSessionSync({ queryClient, router });

		await invalidateSessionState();

		expect(router.invalidate).toHaveBeenCalledTimes(1);
		expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(1);
	});

	it("handles missing session consumers safely", async () => {
		await expect(invalidateSessionState()).resolves.toBeUndefined();
	});

	it("invalidates session consumers after a successful auth request", async () => {
		const router = { invalidate: vi.fn().mockResolvedValue(undefined) };
		registerSessionSync({ router });

		await authClientOptions.fetchOptions.onSuccess();

		expect(router.invalidate).toHaveBeenCalledTimes(1);
	});
});
