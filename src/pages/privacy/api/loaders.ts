/**
 * Data loader and query options for the public Privacy Statement page.
 *
 * Implements `fetchPrivacyPage`, `privacyPageQueryOptions`, and `loadPrivacyPage` using
 * `@tanstack/react-query` and `queryKeys.privacy` to verify platform registration state.
 */
import type { QueryClient } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { queryKeys } from "@/shared/api";
import { isRegistrationOpen } from "@/shared/lib/auth";

export const fetchPrivacyPage = createServerFn({ method: "GET" }).handler(
	async () => {
		const registrationEnabled = await isRegistrationOpen();
		return {
			registrationEnabled,
		};
	},
);

export const privacyPageQueryOptions = () =>
	queryOptions({
		queryFn: () => fetchPrivacyPage(),
		queryKey: queryKeys.privacy,
	});

/** Warms the privacy query cache on server or navigation before rendering. */
export async function loadPrivacyPage({
	context,
}: {
	context: { queryClient: QueryClient };
}) {
	await context.queryClient.query({
		...privacyPageQueryOptions(),
		staleTime: "static",
	});
}
