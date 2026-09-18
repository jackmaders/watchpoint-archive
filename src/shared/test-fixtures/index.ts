/**
 * Public test-fixture API for reusable infrastructure doubles shared across media and session-player tests.
 *
 * Keeps the mock implementation in one place while allowing tests to consume it through a stable Shared-layer
 * public API without importing another segment's internal `__mocks__` directory.
 */

export {
	createYouTubeMock,
	installMockFrames,
	MockFrameController,
	type MockYouTubePlayer,
	setDocumentVisibility,
	setYouTubeNamespace,
	type YouTubeMock,
	YouTubePlayerState,
} from "./youtube";
