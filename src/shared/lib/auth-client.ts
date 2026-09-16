/**
 * Provides the shared browser-side authentication client for managing player sessions,
 * sign-in operations, and credential lifecycles across the application.
 *
 * Instantiates and exports `authClient` via Better Auth React client (`createAuthClient`),
 * provides session synchronization with TanStack Router and TanStack Query via `registerSessionSync`,
 * and exposes reactive session hooks and authentication methods consumed by client UI components.
 */

import { createAuthClient } from "better-auth/react";

export interface SessionSyncTarget {
	queryClient?: { invalidateQueries: () => Promise<void> | void };
	router?: { invalidate: () => Promise<void> | void };
}

let sessionSyncTarget: SessionSyncTarget = {};

export function registerSessionSync(target: SessionSyncTarget) {
	sessionSyncTarget = { ...sessionSyncTarget, ...target };
}

export function getSessionSyncTarget(): SessionSyncTarget {
	return sessionSyncTarget;
}

export async function invalidateSessionState() {
	const promises: Array<Promise<void> | void> = [];
	if (sessionSyncTarget.router?.invalidate) {
		promises.push(sessionSyncTarget.router.invalidate());
	}
	if (sessionSyncTarget.queryClient?.invalidateQueries) {
		promises.push(sessionSyncTarget.queryClient.invalidateQueries());
	}
	await Promise.all(promises);
}

export const authClientOptions = {
	fetchOptions: {
		onSuccess: async () => {
			await invalidateSessionState();
		},
	},
};

export const authClient = createAuthClient(authClientOptions);
