/**
 * Router view controller delegating to the production session player page.
 *
 * Provides the presentation view boundary for interactive VOD playthroughs, binding route parameters
 * and active module filters to the canonical player experience.
 *
 * Implements `SessionPlayerRouteView` within the `src/pages/vods-id-session/` slice.
 * Passes route parameters, active playthrough identifier, scenario snapshots, and module filters
 * to `SessionPlayerPage`.
 */
import { type ManifestVod, SessionPlayerPage } from "@/widgets/session-player";
import type { SessionSearch } from "../model/session-search";

export interface SessionPlayerRouteViewProps {
	onNavigateSearch: (
		updater: (prev: Record<string, unknown>) => Record<string, unknown>,
	) => void;
	playthroughId: string | null;
	scenarioSnapshotIds: string[];
	search?: SessionSearch;
	vod: ManifestVod | null;
	vodId: string;
}

export function SessionPlayerRouteView({
	playthroughId,
	scenarioSnapshotIds,
	search = {},
	vod,
	vodId,
}: SessionPlayerRouteViewProps) {
	const { modules } = search;

	return (
		<SessionPlayerPage
			params={{ id: vodId }}
			playthroughId={playthroughId}
			scenarioSnapshotIds={scenarioSnapshotIds}
			searchParams={{
				modules: modules ?? undefined,
			}}
			vod={vod}
		/>
	);
}
