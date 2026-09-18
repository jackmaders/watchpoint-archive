export * from "./index";

import { handleMediaRequest } from "./api/media-route";

export const mediaApiRouteOptions = {
	server: {
		handlers: {
			GET: handleMediaRequest,
		},
	},
};
