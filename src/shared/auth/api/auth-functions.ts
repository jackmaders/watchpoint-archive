import { createServerFn } from "@tanstack/react-start";
import type { CurrentUser } from "../model/types";

export async function getRegistrationStatusHandler(): Promise<boolean> {
	const { isRegistrationOpen } = await import("./auth-server");
	return isRegistrationOpen();
}

export const getRegistrationStatus = createServerFn({ method: "GET" }).handler(
	getRegistrationStatusHandler,
);

export async function getSessionUserHandler(): Promise<CurrentUser | null> {
	const { getCurrentUser } = await import("./auth-server");
	return getCurrentUser();
}

export const getSessionUser = createServerFn({ method: "GET" }).handler(
	getSessionUserHandler,
);
