/**
 * TanStack Start server functions for VOD discovery, manifest loading, attempt recording, and playthrough lifecycles.
 *
 * Exposes RPC endpoints (`getPublishedVods`, `getVodById`, `getSessionManifest`, `getProtectedSessionManifest`,
 * `startPlaythrough`, `recordAttempt`, `completePlaythrough`) bridging client components and server actions
 * to D1 query functions.
 */
import { createServerFn } from "@tanstack/react-start";
import { getCurrentUser } from "@/shared/auth/index.server";
import {
	createDbClient,
	getVodById as dbGetVodById,
	queryScenarios,
	queryVods,
} from "@/shared/db";
import { isWithinVodTimeRange } from "@/shared/lib/vod-time-range";
import {
	type RecordAttemptInput,
	RecordAttemptInputSchema,
	type RecordAttemptResult,
} from "../model/attempt";
import type { PublishedVodItem, SessionManifest } from "../model/types";
import {
	completePlaythroughAction,
	type StartPlaythroughInput,
	startPlaythroughAction,
} from "./playthrough";
import { recordAttemptAction } from "./record-attempt";
import {
	normalizeSessionManifestQuery,
	type SessionManifestTransportQuery,
} from "./session-manifest-query";

export type GetSessionManifestPayload = SessionManifestTransportQuery;

function isScenarioInVodRange(
	timestampSeconds: number | null | undefined,
	vod: Parameters<typeof isWithinVodTimeRange>[1],
): boolean {
	return (
		typeof timestampSeconds !== "number" ||
		isWithinVodTimeRange(timestampSeconds, vod)
	);
}

export const getPublishedVods = createServerFn({ method: "GET" })
	.validator((data: unknown) => {
		if (!data || typeof data !== "object") return {};
		return data as {
			hero?: string;
			levelOfPlay?: string;
			map?: string;
			player?: string;
		};
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
		if (vodList.length === 0) {
			return [];
		}
		const scenariosList = await queryScenarios(
			{
				filter: {
					vodId: { in: vodList.map((v) => v.id) },
				},
			},
			db,
		);
		const vodById = new Map(vodList.map((vod) => [vod.id, vod]));
		const scenariosByVodId = new Map<string, Array<{ id: string }>>();
		for (const scenario of scenariosList) {
			const vod = vodById.get(scenario.vodId);
			if (!vod || !isScenarioInVodRange(scenario.timestampSeconds, vod)) {
				continue;
			}
			const list = scenariosByVodId.get(scenario.vodId) ?? [];
			list.push({ id: scenario.id });
			scenariosByVodId.set(scenario.vodId, list);
		}
		return vodList.map((vod) => ({
			...vod,
			scenarios: scenariosByVodId.get(vod.id) ?? [],
		}));
	});

export const getVodById = createServerFn({ method: "GET" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }): Promise<SessionManifest | null> => {
		const db = createDbClient();
		const vod = await dbGetVodById(data.id, db);
		if (!vod) {
			return null;
		}
		const scenarios = (
			await queryScenarios(
				{
					filter: { vodId: { eq: data.id } },
					order: { timestampSeconds: "asc" },
				},
				db,
			)
		).filter((scenario) =>
			isScenarioInVodRange(scenario.timestampSeconds, vod),
		);
		return {
			...vod,
			scenarios,
		};
	});

export const getSessionManifest = createServerFn({ method: "GET" })
	.validator(normalizeSessionManifestQuery)
	.handler(async ({ data }): Promise<SessionManifest | null> => {
		const db = createDbClient();
		const vod = await dbGetVodById(data.vodId, db);
		if (!vod) {
			return null;
		}

		const filter: Record<string, unknown> = {
			vodId: { eq: data.vodId },
		};
		if (data.modules && data.modules.length > 0) {
			filter.moduleType = { in: data.modules };
		}

		const scenarios = (
			await queryScenarios(
				{
					filter,
					order: { timestampSeconds: "asc" },
				},
				db,
			)
		).filter((scenario) =>
			isScenarioInVodRange(scenario.timestampSeconds, vod),
		);

		return {
			...vod,
			scenarios,
		};
	});

export const getProtectedSessionManifest = createServerFn({ method: "GET" })
	.validator(normalizeSessionManifestQuery)
	.handler(async ({ data }): Promise<SessionManifest | null> => {
		if (!(await getCurrentUser())) {
			throw new Error("Authentication required");
		}

		const db = createDbClient();
		const vod = await dbGetVodById(data.vodId, db);
		if (!vod) {
			return null;
		}

		const filter: Record<string, unknown> = {
			vodId: { eq: data.vodId },
		};
		if (data.modules && data.modules.length > 0) {
			filter.moduleType = { in: data.modules };
		}

		const scenarios = (
			await queryScenarios(
				{
					filter,
					order: { timestampSeconds: "asc" },
				},
				db,
			)
		).filter((scenario) =>
			isScenarioInVodRange(scenario.timestampSeconds, vod),
		);

		return {
			...vod,
			scenarios,
		};
	});

export const recordAttempt = createServerFn({ method: "POST" })
	.validator((payload: RecordAttemptInput) => {
		const parsed = RecordAttemptInputSchema.safeParse(payload);
		if (!parsed.success) {
			throw new Error("Invalid attempt payload");
		}
		return parsed.data;
	})
	.handler(async ({ data }): Promise<RecordAttemptResult> => {
		return recordAttemptAction(data);
	});

export const startPlaythrough = createServerFn({ method: "POST" })
	.validator((payload: StartPlaythroughInput) => payload)
	.handler(async ({ data }) => startPlaythroughAction(data));

export const completePlaythrough = createServerFn({ method: "POST" })
	.validator((payload: { playthroughId: string }) => payload)
	.handler(async ({ data }) => completePlaythroughAction(data.playthroughId));
