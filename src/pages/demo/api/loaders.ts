/**
 * Data loaders and query options for the public interactive demo training session.
 *
 * Implements `loadDemoPage` and `demoPageQueryOptions` retrieving system registration parameters
 * and providing the curated unauthenticated demo manifest fixture.
 */
import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api";
import { getRegistrationStatus } from "@/shared/auth";
import { DEMO_VOD_MANIFEST } from "../model/fixtures";

export const demoPageQueryOptions = () =>
	queryOptions({
		queryFn: async () => {
			const registrationEnabled = await getRegistrationStatus().catch(
				() => true,
			);
			return {
				registrationEnabled,
				vod: DEMO_VOD_MANIFEST,
			};
		},
		queryKey: [...queryKeys.sessionPlaythrough, "demo"] as const,
	});

export async function loadDemoPage() {
	const registrationEnabled = await getRegistrationStatus().catch(() => true);
	return {
		registrationEnabled,
		vod: DEMO_VOD_MANIFEST,
	};
}
