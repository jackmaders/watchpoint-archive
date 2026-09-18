// src/shared/auth/api.ts
import { createServerFn } from "@tanstack/react-start";
import type { CurrentUser } from "./types";

export const getRegistrationStatus = createServerFn({ method: "GET" }).handler(
	async (): Promise<boolean> => {
		const { isRegistrationOpen } = await import("./server");
		return isRegistrationOpen();
	},
);

export const getSessionUser = createServerFn({ method: "GET" }).handler(
	async (): Promise<CurrentUser | null> => {
		const { getCurrentUser } = await import("./server");
		return getCurrentUser();
	},
);
