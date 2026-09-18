import { handleAuthRequest } from "./auth-server";

export { handleAuthRequest };

export const authApiRouteOptions = {
	server: {
		handlers: {
			GET: handleAuthRequest,
			POST: handleAuthRequest,
		},
	},
};
