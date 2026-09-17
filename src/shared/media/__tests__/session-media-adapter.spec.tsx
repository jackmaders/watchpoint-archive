import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	createYouTubeMock,
	installMockFrames,
	setDocumentVisibility,
	setYouTubeNamespace,
} from "../__mocks__/youtube";
import {
	executeSessionMediaCommand,
	useSessionMediaAdapter,
} from "../session-media-adapter";
import type { VodPlayerResult } from "../types";
import { PlaybackStatus } from "../types";
import { YouTubePlayerState } from "../youtube-adapter";

describe("session media adapter", () => {
	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
		setYouTubeNamespace(undefined);
		setDocumentVisibility("visible");
		document.head.replaceChildren();
		delete window.onYouTubeIframeAPIReady;
	});

	it("translates semantic commands into media controls", () => {
		// Arrange
		const controls: Pick<
			VodPlayerResult,
			| "mute"
			| "pause"
			| "play"
			| "seekTo"
			| "setPlaybackRate"
			| "setVolume"
			| "toggleMute"
			| "unMute"
		> = {
			mute: vi.fn(),
			pause: vi.fn(),
			play: vi.fn(),
			seekTo: vi.fn(),
			setPlaybackRate: vi.fn(),
			setVolume: vi.fn(),
			toggleMute: vi.fn(),
			unMute: vi.fn(),
		};

		// Act
		executeSessionMediaCommand({ type: "PAUSE" }, controls);
		executeSessionMediaCommand({ autoplay: true, type: "RECOVER" }, controls);
		executeSessionMediaCommand({ type: "PLAY" }, controls);
		executeSessionMediaCommand(
			{ timestampSeconds: 5, type: "REPLAY_CONTEXT" },
			controls,
		);
		executeSessionMediaCommand(
			{ timestampSeconds: 40, type: "REPLAY_CONTEXT" },
			controls,
		);
		executeSessionMediaCommand({ autoplay: false, type: "RESTART" }, controls);
		executeSessionMediaCommand({ autoplay: true, type: "RESTART" }, controls);
		executeSessionMediaCommand(
			{ rate: 1.5, type: "SET_PLAYBACK_RATE" },
			controls,
		);
		executeSessionMediaCommand({ type: "SET_VOLUME", volume: 80 }, controls);
		executeSessionMediaCommand({ type: "MUTE" }, controls);
		executeSessionMediaCommand({ type: "UNMUTE" }, controls);
		executeSessionMediaCommand({ type: "TOGGLE_MUTE" }, controls);

		// Assert
		expect(controls.pause).toHaveBeenCalledTimes(1);
		expect(controls.play).toHaveBeenCalledTimes(4);
		expect(controls.seekTo).toHaveBeenNthCalledWith(1, 0, true);
		expect(controls.seekTo).toHaveBeenNthCalledWith(2, 30, true);
		expect(controls.seekTo).toHaveBeenNthCalledWith(3, 0, true);
		expect(controls.seekTo).toHaveBeenNthCalledWith(4, 0, true);
		expect(controls.seekTo).toHaveBeenCalledTimes(4);
		expect(controls.setPlaybackRate).toHaveBeenCalledWith(1.5);
		expect(controls.setVolume).toHaveBeenCalledWith(80);
		expect(controls.mute).toHaveBeenCalledTimes(1);
		expect(controls.unMute).toHaveBeenCalledTimes(1);
		expect(controls.toggleMute).toHaveBeenCalledTimes(1);
	});

	it("delivers normalized readiness, status, and time events", async () => {
		// Arrange
		const frameController = installMockFrames();
		const youtube = createYouTubeMock(142);
		setYouTubeNamespace(youtube.namespace);
		const onEvent = vi.fn();
		const container = document.createElement("div");
		const { result } = renderHook(() =>
			useSessionMediaAdapter({ onEvent, videoId: "semantic-video" }),
		);

		// Act
		act(() => result.current.containerRef(container));
		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
		});
		const player = youtube.players[0];
		player.getCurrentTime = vi.fn(() => 18.5);
		act(() => {
			player.triggerReady();
			player.triggerStateChange(YouTubePlayerState.PLAYING);
			frameController.flush();
		});

		// Assert
		expect(onEvent).toHaveBeenNthCalledWith(1, {
			duration: 142,
			type: "READY",
		});
		expect(onEvent).toHaveBeenNthCalledWith(2, {
			time: 18.5,
			type: "TIME_UPDATED",
		});
		expect(onEvent).toHaveBeenNthCalledWith(3, {
			status: PlaybackStatus.PLAYING,
			type: "PLAYBACK_STATUS_CHANGED",
		});
		expect(result.current.currentTime).toBe(18.5);
	});

	it("manages volume and mute controls through adapter result", async () => {
		// Arrange
		const youtube = createYouTubeMock(142);
		setYouTubeNamespace(youtube.namespace);
		const container = document.createElement("div");
		const { result } = renderHook(() =>
			useSessionMediaAdapter({ videoId: "volume-mute-video" }),
		);
		act(() => result.current.containerRef(container));
		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
		});
		const player = youtube.players[0];
		act(() => {
			player.triggerReady();
		});

		// Act
		const initialVolume = result.current.volume;
		const initialMuted = result.current.isMuted;
		act(() => {
			result.current.setVolume(60);
			result.current.mute();
		});
		const mutedVolume = result.current.volume;
		const mutedState = result.current.isMuted;
		act(() => {
			result.current.unMute();
		});
		const unmutedState = result.current.isMuted;
		act(() => {
			result.current.toggleMute();
		});
		const toggledState = result.current.isMuted;

		// Assert
		expect(initialVolume).toBe(100);
		expect(initialMuted).toBe(false);
		expect(mutedVolume).toBe(60);
		expect(mutedState).toBe(true);
		expect(unmutedState).toBe(false);
		expect(toggledState).toBe(true);
		expect(player.setVolume).toHaveBeenCalledWith(60);
		expect(player.mute).toHaveBeenCalledTimes(2);
		expect(player.unMute).toHaveBeenCalledTimes(1);
	});

	it("ignores stale lifecycle events after the VOD changes", async () => {
		// Arrange
		const youtube = createYouTubeMock();
		setYouTubeNamespace(youtube.namespace);
		const onEvent = vi.fn();
		const container = document.createElement("div");
		const { result, rerender } = renderHook(
			({ videoId }: { videoId: string }) =>
				useSessionMediaAdapter({ onEvent, videoId }),
			{ initialProps: { videoId: "first-video" } },
		);

		act(() => result.current.containerRef(container));
		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
		});
		const firstPlayer = youtube.players[0];

		// Act
		rerender({ videoId: "second-video" });
		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
		});
		const secondPlayer = youtube.players[1];
		act(() => {
			firstPlayer.triggerReady();
			secondPlayer.triggerReady();
		});

		// Assert
		expect(firstPlayer.destroy).toHaveBeenCalledTimes(1);
		expect(onEvent).toHaveBeenCalledTimes(1);
		expect(onEvent).toHaveBeenCalledWith({
			duration: 142,
			type: "READY",
		});
	});

	it("pauses on hidden visibility and removes the listener on cleanup", async () => {
		// Arrange
		const youtube = createYouTubeMock();
		setYouTubeNamespace(youtube.namespace);
		const container = document.createElement("div");
		const { result, unmount } = renderHook(() =>
			useSessionMediaAdapter({ videoId: "visibility-video" }),
		);

		act(() => result.current.containerRef(container));
		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
		});
		const player = youtube.players[0];

		// Act
		setDocumentVisibility("hidden");
		unmount();
		setDocumentVisibility("hidden");

		// Assert
		expect(player.pauseVideo).toHaveBeenCalledTimes(1);
	});

	it("recreates a player for recovery and emits sanitized diagnostics", async () => {
		// Arrange
		vi.useFakeTimers();
		const frameController = installMockFrames();
		const youtube = createYouTubeMock(142);
		setYouTubeNamespace(youtube.namespace);
		const onEvent = vi.fn();
		const onDiagnostics = vi.fn();
		const container = document.createElement("div");
		const { result } = renderHook(() =>
			useSessionMediaAdapter({
				generation: 4,
				onDiagnostics,
				onEvent,
				videoId: "recovery-video",
			}),
		);
		act(() => result.current.containerRef(container));
		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
		});
		const firstPlayer = youtube.players[0];
		act(() => firstPlayer.triggerReady());
		act(() => firstPlayer.triggerStateChange(YouTubePlayerState.BUFFERING));
		act(() => firstPlayer.triggerStateChange(YouTubePlayerState.BUFFERING));
		act(() => vi.advanceTimersByTime(5000));

		// Act
		act(() => result.current.execute({ autoplay: true, type: "RECOVER" }));
		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
		});
		const recoveredPlayer = youtube.players[1];
		act(() => recoveredPlayer.triggerReady());
		recoveredPlayer.getCurrentTime = vi.fn(() => 1);
		act(() => {
			recoveredPlayer.triggerStateChange(YouTubePlayerState.PLAYING);
			frameController.flush();
		});

		// Assert
		expect(firstPlayer.destroy).toHaveBeenCalledTimes(1);
		expect(recoveredPlayer.seekTo).toHaveBeenCalledWith(0, true);
		expect(recoveredPlayer.playVideo).toHaveBeenCalled();
		expect(onEvent).toHaveBeenCalledWith({
			generation: 4,
			retryCount: 1,
			type: "RECOVERY_SUCCEEDED",
		});
		expect(onDiagnostics).toHaveBeenCalledWith(
			expect.objectContaining({
				eventType: "recovery",
				generation: 4,
				outcome: "recovered",
				videoId: "recovery-video",
			}),
		);
		expect(onDiagnostics).toHaveBeenCalledWith(
			expect.objectContaining({
				eventType: "failure",
				failureCategory: "buffering",
			}),
		);
	});
});
