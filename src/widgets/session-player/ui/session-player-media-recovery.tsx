/**
 * Canonical media recovery presentation component and status messaging for interactive VOD playback.
 *
 * Provides resilient visual feedback and recovery actions during video stream disruptions, buffering stalls,
 * and media failures, ensuring user training progress and scenario states remain intact.
 *
 * Implements `SessionPlayerMediaRecovery` and `RecoveryMessage` within the `src/widgets/session-player/` slice.
 * Monitors media health status transitions, surfaces non-blocking buffering indicators, renders accessible
 * alert overlays with retry and restart controls, and dispatches assistive screen reader announcements.
 */
"use client";

import type { Ref } from "react";
import { useEffect, useRef, useState } from "react";
import type { MediaHealth } from "../model/session-playthrough-coordinator";

export type RecoveryState =
	| "buffering"
	| "stalled"
	| "recovering"
	| "failed"
	| "recovered";

export interface RecoveryMessageProps {
	headingRef?: Ref<HTMLHeadingElement>;
	onRestart?: () => void;
	onRetry?: () => void;
	state: RecoveryState;
}

export interface SessionPlayerMediaRecoveryProps {
	mediaHealth: MediaHealth;
	onRestart?: () => void;
	onRestartSession?: () => void;
	onRetry?: () => void;
	onRetryMedia?: () => void;
}

interface ActionButtonsProps {
	onRestart?: () => void;
	onRetry?: () => void;
}

function ActionButtons({ onRestart, onRetry }: ActionButtonsProps) {
	return (
		<div className="flex flex-wrap justify-center gap-3">
			{onRetry ? (
				<button
					className="rounded-md bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					onClick={onRetry}
					type="button"
				>
					Try again
				</button>
			) : null}
			{onRestart ? (
				<button
					className="rounded-md border border-input px-4 py-2 text-xs font-bold text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					onClick={onRestart}
					type="button"
				>
					Restart session
				</button>
			) : null}
		</div>
	);
}

function BufferingMessage() {
	return (
		<div
			className="flex items-center gap-2 rounded-md bg-background/85 px-3 py-2 text-xs font-semibold text-foreground shadow-sm backdrop-blur"
			role="status"
		>
			<span
				aria-hidden="true"
				className="h-2 w-2 animate-pulse rounded-full bg-primary"
			/>
			<span>Buffering… Finding the next moment</span>
		</div>
	);
}

interface RecoveryCardProps {
	accentClassName: string;
	badgeText: string;
	borderClassName: string;
	description: string;
	headingRef?: Ref<HTMLHeadingElement>;
	onRestart?: () => void;
	onRetry?: () => void;
	title: string;
}

function RecoveryCard({
	accentClassName,
	badgeText,
	borderClassName,
	description,
	headingRef,
	onRestart,
	onRetry,
	title,
}: RecoveryCardProps) {
	return (
		<div
			className={`max-w-sm space-y-4 rounded-xl border ${borderClassName} bg-background/95 p-6 text-center shadow-xl`}
		>
			<p
				className={`text-xs font-bold uppercase tracking-[0.18em] ${accentClassName}`}
			>
				{badgeText}
			</p>
			<h2
				className="text-lg font-bold text-foreground"
				ref={headingRef}
				tabIndex={-1}
			>
				{title}
			</h2>
			<p className="text-sm text-muted-foreground">{description}</p>
			<ActionButtons onRestart={onRestart} onRetry={onRetry} />
		</div>
	);
}

function StalledMessage({
	headingRef,
	onRestart,
	onRetry,
}: {
	headingRef?: Ref<HTMLHeadingElement>;
	onRestart?: () => void;
	onRetry?: () => void;
}) {
	return (
		<RecoveryCard
			accentClassName="text-primary"
			badgeText="Still working"
			borderClassName="border-primary/50"
			description="Your session and scenario progress are preserved. We’ll keep trying without blocking the rest of the session."
			headingRef={headingRef}
			onRestart={onRestart}
			onRetry={onRetry}
			title="Recovering video…"
		/>
	);
}

function FailedMessage({
	headingRef,
	onRestart,
	onRetry,
}: {
	headingRef?: Ref<HTMLHeadingElement>;
	onRestart?: () => void;
	onRetry?: () => void;
}) {
	return (
		<RecoveryCard
			accentClassName="text-destructive"
			badgeText="Playback unavailable"
			borderClassName="border-destructive/60"
			description="Playback could not continue, but your training context is preserved. Try reconnecting or restart the session."
			headingRef={headingRef}
			onRestart={onRestart}
			onRetry={onRetry}
			title="Video playback is unavailable"
		/>
	);
}

function RecoveredMessage() {
	return (
		<p className="rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-bold text-emerald-300">
			Playback resumed · your place is saved
		</p>
	);
}

export function RecoveryMessage({
	headingRef,
	onRestart,
	onRetry,
	state,
}: RecoveryMessageProps) {
	if (state === "buffering") {
		return <BufferingMessage />;
	}
	if (state === "stalled" || state === "recovering") {
		return (
			<StalledMessage
				headingRef={headingRef}
				onRestart={onRestart}
				onRetry={onRetry}
			/>
		);
	}
	if (state === "failed") {
		return (
			<FailedMessage
				headingRef={headingRef}
				onRestart={onRestart}
				onRetry={onRetry}
			/>
		);
	}
	return <RecoveredMessage />;
}

export function SessionPlayerMediaRecovery({
	mediaHealth,
	onRestart,
	onRestartSession,
	onRetry,
	onRetryMedia,
}: SessionPlayerMediaRecoveryProps) {
	const handleRestart = onRestartSession ?? onRestart;
	const handleRetry = onRetryMedia ?? onRetry;
	const recoveryHeadingRef = useRef<HTMLHeadingElement>(null);
	const previousMediaHealthRef = useRef<MediaHealth | undefined>(undefined);
	const [announcement, setAnnouncement] = useState("");
	const isBlockingRecovery =
		mediaHealth === "recovering" || mediaHealth === "failed";

	useEffect(() => {
		if (isBlockingRecovery && previousMediaHealthRef.current !== mediaHealth) {
			recoveryHeadingRef.current?.focus();
		}
		if (
			previousMediaHealthRef.current === "recovering" &&
			mediaHealth === "ready"
		) {
			setAnnouncement("Playback resumed. Your session progress is preserved.");
		} else if (mediaHealth !== "ready") {
			setAnnouncement("");
		}
		previousMediaHealthRef.current = mediaHealth;
	}, [isBlockingRecovery, mediaHealth]);

	if (announcement) {
		return (
			<div className="sr-only" role="status">
				{announcement}
			</div>
		);
	}

	if (mediaHealth === "buffering") {
		return (
			<div className="absolute left-3 top-3 z-20">
				<RecoveryMessage state="buffering" />
			</div>
		);
	}

	if (isBlockingRecovery) {
		return (
			<div
				aria-live="assertive"
				className="absolute inset-0 z-40 flex items-center justify-center bg-background/95 p-6 backdrop-blur"
				role="alert"
			>
				<RecoveryMessage
					headingRef={recoveryHeadingRef}
					onRestart={handleRestart}
					onRetry={handleRetry}
					state={mediaHealth}
				/>
			</div>
		);
	}

	return null;
}
