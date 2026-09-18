/**
 * Test mock for the browser-side Better Auth client, simulating session state and authentication workflows.
 *
 * Exports mock implementations of `authClient`, `signInEmail`, `signUpEmail`, `signOut`, `useSession`,
 * `registerSessionSync`, `getSessionSyncTarget`, and `invalidateSessionState` using Vitest spy functions (`vi.fn()`).
 */

import { vi } from "vitest";

let mockSessionSyncTarget: {
	queryClient?: { invalidateQueries: () => Promise<void> | void };
	router?: { invalidate: () => Promise<void> | void };
} = {};

export const registerSessionSync = vi.fn(
	(target: {
		queryClient?: { invalidateQueries: () => Promise<void> | void };
		router?: { invalidate: () => Promise<void> | void };
	}) => {
		mockSessionSyncTarget = { ...mockSessionSyncTarget, ...target };
	},
);

export const getSessionSyncTarget = vi.fn(() => mockSessionSyncTarget);

export const invalidateSessionState = vi.fn(async () => {
	const promises: Array<Promise<void> | void> = [];
	if (mockSessionSyncTarget.router?.invalidate) {
		promises.push(mockSessionSyncTarget.router.invalidate());
	}
	if (mockSessionSyncTarget.queryClient?.invalidateQueries) {
		promises.push(mockSessionSyncTarget.queryClient.invalidateQueries());
	}
	await Promise.all(promises);
});

export const signInEmail = vi.fn().mockImplementation(async () => {
	await invalidateSessionState();
	return { data: {}, error: null };
});
export const signUpEmail = vi.fn().mockImplementation(async () => {
	await invalidateSessionState();
	return { data: {}, error: null };
});
export const signOut = vi.fn().mockImplementation(async () => {
	await invalidateSessionState();
	return { data: {}, error: null };
});
export const useSession = vi.fn(() => ({ data: null, isPending: false }));

export const authClient = {
	signIn: { email: signInEmail },
	signOut,
	signUp: { email: signUpEmail },
	useSession,
};
