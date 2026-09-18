// src/shared/auth/api.ts
import { createServerFn } from "@tanstack/react-start";
import type { CurrentUser } from "./types";

export async function handleAuthRequest({ request }: { request: Request }) {
	const { handleAuthRequest: handleServerAuthRequest } = await import(
		"./server"
	);
	return handleServerAuthRequest({ request });
}

export const authApiRouteOptions = {
	server: {
		handlers: {
			GET: handleAuthRequest,
			POST: handleAuthRequest,
		},
	},
};

export async function getRegistrationStatusHandler(): Promise<boolean> {
	const { isRegistrationOpen } = await import("./server");
	return isRegistrationOpen();
}

export const getRegistrationStatus = createServerFn({ method: "GET" }).handler(
	getRegistrationStatusHandler,
);

export async function getSessionUserHandler(): Promise<CurrentUser | null> {
	const { getCurrentUser } = await import("./server");
	return getCurrentUser();
}

export const getSessionUser = createServerFn({ method: "GET" }).handler(
	getSessionUserHandler,
);
