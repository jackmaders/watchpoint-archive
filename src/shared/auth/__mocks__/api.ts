import { vi } from "vitest";

export const handleAuthRequest = vi.fn();
export const authApiRouteOptions = {
	server: {
		handlers: {
			GET: handleAuthRequest,
			POST: handleAuthRequest,
		},
	},
};
export const getRegistrationStatus = vi.fn().mockResolvedValue(true);
export const getSessionUser = vi.fn().mockResolvedValue(null);
