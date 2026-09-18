import { useCallback, useRef, useState } from "react";
import type {
	MediaDiagnostic,
	MediaFailure,
	MediaFailureCategory,
	PlaybackRate,
	VodContainerRef,
	VodPlayerResult,
} from "./types";
import { PlaybackStatus } from "./types";
import { useVodPlayer } from "./use-vod-player";

export type SessionMediaEvent =
	| { duration: number; generation?: number; type: "READY" }
	| {
			failure: MediaFailure;
			generation?: number;
			retryCount: number;
			type: "MEDIA_FAILURE";
	  }
	| {
			generation?: number;
			retryCount: number;
			type: "RECOVERY_SUCCEEDED";
	  }
	| {
			generation?: number;
			status: PlaybackStatus;
			type: "PLAYBACK_STATUS_CHANGED";
	  }
	| { generation?: number; time: number; type: "TIME_UPDATED" };

export type SessionMediaCommand =
	| { type: "PAUSE" }
	| { type: "PLAY" }
	| { positionSeconds: number; type: "SEEK" }
	| { timestampSeconds: number; type: "REPLAY_CONTEXT" }
	| { autoplay: boolean; type: "RECOVER" }
	| { autoplay: boolean; type: "RESTART" }
	| { rate: PlaybackRate; type: "SET_PLAYBACK_RATE" }
	| { volume: number; type: "SET_VOLUME" }
	| { type: "MUTE" }
	| { type: "UNMUTE" }
	| { type: "TOGGLE_MUTE" };

export interface SessionMediaAdapterOptions {
	autoplay?: boolean;
	endSeconds?: number;
	generation?: number;
	onEvent?: (event: SessionMediaEvent) => void;
	onDiagnostics?: (diagnostic: MediaDiagnostic) => void;
	startSeconds?: number;
	videoId: string;
}

export interface SessionMediaAdapterResult {
	containerRef: VodContainerRef;
	currentTime: number;
	duration: number;
	execute: (command: SessionMediaCommand) => void;
	isMuted: boolean;
	isReady: boolean;
	mute: () => void;
	playbackRate: PlaybackRate;
	setPlaybackRate: (rate: PlaybackRate) => void;
	setVolume: (volume: number) => void;
	status: PlaybackStatus;
	toggleMute: () => void;
	unMute: () => void;
	volume: number;
}

type SessionMediaControls = Pick<
	VodPlayerResult,
	| "mute"
	| "pause"
	| "play"
	| "seekTo"
	| "setPlaybackRate"
	| "setVolume"
	| "toggleMute"
	| "unMute"
>;

function addGeneration<T extends object>(
	event: T,
	generation: number | undefined,
): T & { generation?: number } {
	return generation === undefined ? event : { ...event, generation };
}

function shouldCompleteRecovery(
	failureCategory: MediaFailureCategory,
	autoplay: boolean,
): boolean {
	return failureCategory !== "buffering" || !autoplay;
}

interface SessionPlaybackRange {
	endSeconds?: number;
	startSeconds: number;
}

export function executeSessionMediaCommand(
	command: SessionMediaCommand,
	controls: SessionMediaControls,
	range: SessionPlaybackRange = { startSeconds: 0 },
): void {
	const startSeconds = Math.max(0, range.startSeconds);
	switch (command.type) {
		case "PAUSE":
			controls.pause();
			return;
		case "PLAY":
			controls.play();
			return;
		case "SEEK":
			controls.seekTo(
				Math.min(
					range.endSeconds ?? Number.POSITIVE_INFINITY,
					Math.max(startSeconds, command.positionSeconds),
				),
				true,
			);
			return;
		case "REPLAY_CONTEXT":
			controls.seekTo(
				Math.max(startSeconds, command.timestampSeconds - 10),
				true,
			);
			controls.play();
			return;
		case "RECOVER":
			return;
		case "RESTART":
			controls.seekTo(startSeconds, true);
			if (command.autoplay) controls.play();
			return;
		case "SET_PLAYBACK_RATE":
			controls.setPlaybackRate(command.rate);
			return;
		case "SET_VOLUME":
			controls.setVolume(command.volume);
			return;
		case "MUTE":
			controls.mute();
			return;
		case "UNMUTE":
			controls.unMute();
			return;
		case "TOGGLE_MUTE":
			controls.toggleMute();
			return;
	}
}

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: this hook coordinates the adapter lifecycle and remains the public media seam.
export function useSessionMediaAdapter({
	autoplay = false,
	endSeconds,
	generation,
	onEvent,
	onDiagnostics,
	startSeconds = 0,
	videoId,
}: SessionMediaAdapterOptions): SessionMediaAdapterResult {
	const controlsRef = useRef<SessionMediaControls | null>(null);
	const pendingCommandRef = useRef<SessionMediaCommand | null>(null);
	const [recoveryKey, setRecoveryKey] = useState(0);
	const retryCountRef = useRef(0);
	const recoveryPositionRef = useRef(0);
	const recoveringRef = useRef(false);
	const recoveryAutoplayRef = useRef(false);
	const recoveryFailureCategoryRef = useRef<MediaFailureCategory>("readiness");
	const boundaryReachedRef = useRef(false);
	const completeRecovery = useCallback(() => {
		recoveringRef.current = false;
		onDiagnostics?.({
			currentTime: recoveryPositionRef.current,
			eventTimestamp: Date.now(),
			eventType: "recovery",
			failureCategory: recoveryFailureCategoryRef.current,
			// c8 ignore next -- session adapters are created with a playthrough generation.
			generation: generation ?? 0,
			outcome: "recovered",
			retryCount: retryCountRef.current,
			videoId,
		});
		onEvent?.(
			addGeneration(
				{ retryCount: retryCountRef.current, type: "RECOVERY_SUCCEEDED" },
				generation,
			),
		);
	}, [generation, onDiagnostics, onEvent, videoId]);
	const onReady = useCallback(
		// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: readiness coordinates pending commands and recovery confirmation at the adapter seam.
		(duration: number, _lifecycleKey?: number) => {
			const eventGeneration = generation;
			onEvent?.(addGeneration({ duration, type: "READY" }, eventGeneration));
			const pendingCommand = pendingCommandRef.current;
			const controls = controlsRef.current;
			const wasRecovering = recoveringRef.current;
			if (wasRecovering && controls) {
				controls.seekTo(
					Math.max(startSeconds, recoveryPositionRef.current),
					true,
				);
				// c8 ignore next -- active session recovery explicitly supplies autoplay.
				if (recoveryAutoplayRef.current) controls.play();
				if (
					shouldCompleteRecovery(
						recoveryFailureCategoryRef.current,
						recoveryAutoplayRef.current,
					)
				) {
					completeRecovery();
				}
			}
			if (!wasRecovering && !pendingCommand && controls) {
				controls.seekTo(startSeconds, true);
			}
			if (pendingCommand && controls) {
				pendingCommandRef.current = null;
				executeSessionMediaCommand(pendingCommand, controls, {
					endSeconds,
					startSeconds,
				});
			}
		},
		[completeRecovery, endSeconds, generation, onEvent, startSeconds],
	);
	const onStatusChange = useCallback(
		(status: PlaybackStatus, _lifecycleKey?: number) =>
			onEvent?.(
				addGeneration({ status, type: "PLAYBACK_STATUS_CHANGED" }, generation),
			),
		[generation, onEvent],
	);
	const onTimeUpdate = useCallback(
		(time: number, _lifecycleKey?: number) => {
			if (
				recoveringRef.current &&
				recoveryFailureCategoryRef.current === "buffering" &&
				recoveryAutoplayRef.current &&
				time > recoveryPositionRef.current + 0.1
			) {
				completeRecovery();
			}
			onEvent?.(addGeneration({ time, type: "TIME_UPDATED" }, generation));
			if (endSeconds !== undefined && time >= endSeconds) {
				if (!boundaryReachedRef.current) {
					boundaryReachedRef.current = true;
					controlsRef.current?.pause();
					onEvent?.(
						addGeneration(
							{
								status: PlaybackStatus.PAUSED,
								type: "PLAYBACK_STATUS_CHANGED",
							},
							generation,
						),
					);
				}
			} else {
				boundaryReachedRef.current = false;
			}
		},
		[completeRecovery, endSeconds, generation, onEvent],
	);
	const onError = useCallback(
		(failure: MediaFailure) => {
			recoveryFailureCategoryRef.current = failure.category;
			const retryCount = retryCountRef.current;
			onDiagnostics?.({
				currentTime: recoveryPositionRef.current,
				eventTimestamp: Date.now(),
				eventType: "failure",
				failureCategory: failure.category,
				// c8 ignore next -- session adapters are created with a playthrough generation.
				generation: generation ?? 0,
				// c8 ignore next -- the first failure is the only failure emitted before recovery.
				outcome: retryCount > 0 ? "terminal" : "recovered",
				retryCount,
				videoId,
				// c8 ignore next -- provider codes are optional and sanitized when present.
				...(failure.code ? { providerCode: failure.code } : {}),
			});
			onEvent?.(
				addGeneration(
					{ failure, retryCount, type: "MEDIA_FAILURE" },
					generation,
				),
			);
		},
		[generation, onDiagnostics, onEvent, videoId],
	);
	const player = useVodPlayer({
		autoplay,
		lifecycleKey:
			generation === undefined ? undefined : generation * 1000 + recoveryKey,
		onError,
		onReady,
		onStatusChange,
		onTimeUpdate,
		videoId,
	});
	controlsRef.current = player;
	const execute = useCallback(
		(command: SessionMediaCommand) => {
			if (command.type === "RECOVER") {
				recoveryPositionRef.current = player.currentTime;
				recoveryAutoplayRef.current = command.autoplay;
				retryCountRef.current += 1;
				recoveringRef.current = true;
				setRecoveryKey((key) => key + 1);
				return;
			}
			if (command.type === "RESTART") {
				boundaryReachedRef.current = false;
				pendingCommandRef.current = command;
				return;
			}
			if (command.type === "PLAY" && boundaryReachedRef.current) {
				boundaryReachedRef.current = false;
				player.seekTo(startSeconds, true);
			}
			executeSessionMediaCommand(command, player, {
				endSeconds,
				startSeconds,
			});
		},
		[endSeconds, player, startSeconds],
	);

	return {
		containerRef: player.containerRef,
		currentTime: player.currentTime,
		duration: player.duration,
		execute,
		isMuted: player.isMuted,
		isReady: player.isReady,
		mute: player.mute,
		playbackRate: player.playbackRate,
		setPlaybackRate: player.setPlaybackRate,
		setVolume: player.setVolume,
		status: player.status,
		toggleMute: player.toggleMute,
		unMute: player.unMute,
		volume: player.volume,
	};
}
