/**
 * TanStack Start server function for retrieving published training VOD catalog items.
 *
 * Implements `getPublishedVods` using `createServerFn` and delegating to `queryVods`.
 */
import { createServerFn } from "@tanstack/react-start";
import {
	createDbClient,
	queryVods,
	type VodTransportRecord,
} from "@/shared/db/index.server";
import { vodsSearchSchema } from "../model/search-params";

export type PublishedVodItem = VodTransportRecord;

export const getPublishedVods = createServerFn({ method: "GET" })
	.validator((data: unknown) => {
		const parsed = vodsSearchSchema.safeParse(data ?? {});
		return parsed.success ? parsed.data : {};
	})
	.handler(async ({ data }): Promise<PublishedVodItem[]> => {
		const db = createDbClient();
		const filter: Record<string, unknown> = { isPublished: { eq: true } };
		if (data?.map) filter.mapName = { eq: data.map };
		if (data?.hero) filter.heroName = { eq: data.hero };
		if (data?.levelOfPlay) filter.rankTier = { eq: data.levelOfPlay };

		let vodList = await queryVods(
			{
				filter,
				order: { createdAt: "desc" },
			},
			db,
		);
		if (data?.player) {
			const playerQuery = data.player.toLowerCase().trim();
			vodList = vodList.filter((vod) =>
				vod.title.toLowerCase().includes(playerQuery),
			);
		}
		return vodList;
	});
