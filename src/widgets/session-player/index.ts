/**
 * Public API for the interactive VOD training session player widget.
 *
 * Exposes reusable session playback components, state coordinator hooks, scenario overlay engines,
 * and performance summary modals conforming to Feature-Sliced Design (FSD).
 */
export {
	calculateBackoffDelay,
	executeRecordAttempt,
	isRetryableAttemptError,
	MAX_ATTEMPT_DELIVERY_ATTEMPTS,
	useRecordAttemptMutation,
} from "./api/use-record-attempt";
export {
	type AttemptOutcome,
	type RecordAttemptInput,
	RecordAttemptInputSchema,
	type RecordAttemptResult,
} from "./model/attempt";
export {
	normalizeScenario,
	normalizeScenarioInput,
	type ScenarioAnswerSemantics,
	type ScenarioData,
	type ScenarioInput,
	type ScenarioInputType,
	type ScenarioOption,
	type ScenarioOverlayState,
	toScenarioOverlayData,
} from "./model/session-contract";
export {
	createSessionPlaythroughState,
	getScenarioLimitMs,
	initialSessionPlayerSession,
	type MediaHealth,
	resolveNewStatusState,
	type SessionAttemptOutcome,
	type SessionPlayerSession,
	type SessionPlayerState as PlaythroughPlayerState,
	type SessionPlaythroughAction,
	type SessionPlaythroughEffect,
	type SessionPlaythroughState,
	type SessionScenario,
	sessionPlaythroughReducer,
} from "./model/session-playthrough-coordinator";
export {
	calculateSessionSummary,
	type ModuleSummaryReport,
	type SessionAttempt,
	type SessionSummaryReport,
} from "./model/summary";
export {
	type ManifestVod,
	type ScenarioItem,
	type SessionPlayerState,
	useSessionPlayer,
} from "./model/use-session-player";
export {
	InteractiveOverlayEngine,
	type InteractiveOverlayEngineProps,
} from "./ui/interactive-overlay-engine";
export {
	ScenarioOverlay,
	type ScenarioOverlayProps,
} from "./ui/scenario-overlay";
export {
	SessionPlayerClient,
	type SessionPlayerClientProps,
	SessionPlayerViewport,
} from "./ui/session-player-client";
export {
	type MediaRecoveryPrototypeVariant,
	SessionPlayerMediaRecoveryPrototype,
	type SessionPlayerMediaRecoveryPrototypeProps,
} from "./ui/session-player-media-recovery-prototype";
export {
	SessionPlayerPage,
	type SessionPlayerPageProps,
} from "./ui/session-player-page";
export {
	SessionSummaryPanel,
	type SessionSummaryPanelProps,
} from "./ui/session-summary-panel";
