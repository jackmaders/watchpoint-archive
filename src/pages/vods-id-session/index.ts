/**
 * Public API for the interactive VOD training session and scenario playthrough page slice.
 *
 * Re-exports the public interface of `src/pages/vods-id-session/` adhering to Feature-Sliced Design (FSD).
 * Exposes loaders, route options, route views, and delegates playback widget exports.
 */

// Re-export session-player widget primitives for backward compatibility
export {
	type AttemptOutcome,
	calculateBackoffDelay,
	calculateSessionSummary,
	createSessionPlaythroughState,
	executeRecordAttempt,
	getScenarioLimitMs,
	InteractiveOverlayEngine,
	type InteractiveOverlayEngineProps,
	initialSessionPlayerSession,
	isRetryableAttemptError,
	MAX_ATTEMPT_DELIVERY_ATTEMPTS,
	type ManifestVod,
	type MediaHealth,
	type ModuleSummaryReport,
	normalizeScenario,
	normalizeScenarioInput,
	type PlaythroughPlayerState,
	type RecordAttemptInput,
	RecordAttemptInputSchema,
	type RecordAttemptResult,
	resolveNewStatusState,
	type ScenarioAnswerSemantics,
	type ScenarioData,
	type ScenarioInput,
	type ScenarioInputType,
	type ScenarioItem,
	type ScenarioOption,
	ScenarioOverlay,
	type ScenarioOverlayProps,
	type ScenarioOverlayState,
	type SessionAttempt,
	type SessionAttemptOutcome,
	SessionPlayerClient,
	type SessionPlayerClientProps,
	SessionPlayerPage,
	type SessionPlayerPageProps,
	type SessionPlayerSession,
	type SessionPlayerState,
	SessionPlayerViewport,
	type SessionPlaythroughAction,
	type SessionPlaythroughEffect,
	type SessionPlaythroughState,
	type SessionScenario,
	SessionSummaryPanel,
	type SessionSummaryPanelProps,
	type SessionSummaryReport,
	sessionPlaythroughReducer,
	toScenarioOverlayData,
	useRecordAttemptMutation,
	useSessionPlayer,
} from "@/widgets/session-player";
export {
	loadVodsIdSessionPage,
	sessionPlaythroughQueryOptions,
} from "./api/loaders";
export { vodsIdSessionRouteOptions } from "./model/route-options";
export {
	type SessionSearch,
	sessionSearchSchema,
} from "./model/session-search";
export {
	SessionPlayerRouteView,
	type SessionPlayerRouteViewProps,
} from "./ui/session-player-route-view";
export { VodsIdSessionRouteComponent } from "./ui/vods-id-session-route";
