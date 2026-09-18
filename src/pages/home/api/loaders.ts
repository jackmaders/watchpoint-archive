/**
 * Data loader and query options for the landing and home page view.
 *
 * Implements `fetchHomePage`, `homePageQueryOptions`, and `loadHomePage` using `@tanstack/react-query` and `queryKeys.home`.
 */
import type { QueryClient } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getPublishedVods } from "@/entities/vod";
import { isRegistrationOpen } from "@/shared/auth/index.server";
import { queryKeys } from "@/shared/db";

export const fetchHomePage = createServerFn({ method: "GET" }).handler(
	async () => {
		const [vods, registrationEnabled] = await Promise.all([
			getPublishedVods(),
			isRegistrationOpen(),
		]);
		return {
			registrationEnabled,
			vods,
		};
	},
);

export const homePageQueryOptions = () =>
	queryOptions({
		queryFn: () => fetchHomePage(),
		queryKey: queryKeys.home,
	});

/** Warms the home query cache on server or navigation before rendering. */
export async function loadHomePage({
	context,
}: {
	context: { queryClient: QueryClient };
}) {
	await context.queryClient.query({
		...homePageQueryOptions(),
		staleTime: "static",
	});
}
