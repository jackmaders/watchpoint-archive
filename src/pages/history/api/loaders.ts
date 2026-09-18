/**
 * Data loader, navigation guards, and query options for the training match history page and search filter state.
 *
 * Implements `historyBeforeLoad` enforcing authentication guards, `historyQueryOptions`, `loadPlayerHistory`,
 * and `loadHistoryIndexPage` to concurrently fetch published VODs, registration configuration via server function,
 * and paginated match history records using `queryKeys.history`.
 */

import type { QueryClient } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { getPublishedVods } from "@/entities/vod";
import { getRegistrationStatus, getSessionUser } from "@/shared/auth";
import { queryKeys } from "@/shared/db";
import type { HistorySearchParams } from "../model/search-params";
import { getPlayerHistory } from "./server-fns";

export async function historyBeforeLoad() {
	const user = await getSessionUser().catch(() => null);
	if (!user) {
		throw redirect({ to: "/" });
	}
	return { user };
}

export const historyQueryOptions = (deps?: HistorySearchParams) =>
	queryOptions({
		queryFn: () =>
			getPlayerHistory({
				data: {
					hero: deps?.hero,
					levelOfPlay: deps?.levelOfPlay,
					map: deps?.map,
					modules: deps?.modules ? [...deps.modules] : undefined,
					page: deps?.page,
					pageSize: deps?.pageSize,
					player: deps?.player,
					vodId: deps?.vodId,
				},
			}),
		queryKey:
			deps && Object.keys(deps).length > 0
				? ([...queryKeys.history, deps] as const)
				: queryKeys.history,
	});

export async function loadPlayerHistory(deps?: HistorySearchParams) {
	const historyResult = (await getPlayerHistory({
		data: {
			hero: deps?.hero,
			levelOfPlay: deps?.levelOfPlay,
			map: deps?.map,
			modules: deps?.modules ? [...deps.modules] : undefined,
			page: deps?.page,
			pageSize: deps?.pageSize,
			player: deps?.player,
			vodId: deps?.vodId,
		},
	})) as unknown as import("../model/types").GetHistoryResult;

	return {
		data: historyResult.status === "success" ? historyResult.data : undefined,
		error: historyResult.status === "rejected" ? historyResult.reason : null,
	};
}

export async function loadHistoryIndexPage({
	context,
	deps,
}: {
	context?: { queryClient: QueryClient };
	deps: HistorySearchParams;
}) {
	if (context?.queryClient) {
		await context.queryClient.query({
			...historyQueryOptions(deps),
			staleTime: "static",
		});
	}

	const [vods, registrationEnabled, historyResult] = await Promise.all([
		getPublishedVods(),
		getRegistrationStatus(),
		loadPlayerHistory(deps),
	]);

	return {
		data: historyResult.data,
		error: historyResult.error,
		registrationEnabled,
		vods: vods ?? [],
	};
}
