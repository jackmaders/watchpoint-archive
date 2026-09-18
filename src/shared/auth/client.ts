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

export const authClient = createAuthClient({
	fetchOptions: {
		onSuccess: async () => {
			await invalidateSessionState();
		},
	},
});
