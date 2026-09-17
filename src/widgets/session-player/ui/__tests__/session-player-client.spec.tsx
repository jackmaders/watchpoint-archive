import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as serverFns from "@/entities/vod";
import {
	createYouTubeMock,
	installMockFrames,
	setYouTubeNamespace,
	YouTubePlayerState,
} from "@/shared/lib/testing";
import {
	SessionPlayerClient,
	SessionPlayerViewport,
} from "../session-player-client";

vi.mock("@tanstack/react-router");

describe("SessionPlayerClient", () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				mutations: { retry: false },
				queries: { retry: false },
			},
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	const renderWithClient = (ui: React.ReactElement) => {
		return render(
			<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
		);
	};

	const mockVod = {
		createdAt: new Date(),
		durationSeconds: 0,
		heroName: "Ana",
		id: "vod_zero_duration",
		isDemo: false,
		isPublished: true,
		mapName: "Oasis",
		rankTier: "Diamond",
		role: "SUPPORT" as const,
		scenarios: [
			{
				explanationText: "No options scenario",
				id: "sc_no_opt",
				imageUrl: null,
				inputConfig: {},
				inputType: "MULTIPLE_CHOICE" as const,
				moduleType: "STRATEGY" as const,
				promptText: "Where to go?",
				timeLimitSeconds: null,
				timestampSeconds: 0,
				vodId: "vod_zero_duration",
			},
		],
		title: "Diamond Oasis Playthrough",
		updatedAt: new Date(),
		userId: "u1",
		youtubeVideoId: "oasis_vid",
	};

	it("renders controls and timeline markers correctly when duration is zero", async () => {
		// Arrange
		const youtube = createYouTubeMock(0);
		setYouTubeNamespace(youtube.namespace);

		// Act
		renderWithClient(<SessionPlayerClient vod={mockVod} />);
		await act(async () => {
			await Promise.resolve();
		});

		// Assert controls and zero progress
		expect(screen.getByRole("button", { name: /play video/i })).toBeDefined();
		expect(screen.getByRole("button", { name: /replay 10s/i })).toBeDefined();
		expect(screen.getByText("0m 00s / 0m 00s")).toBeDefined();

		// Act: click Play button
		act(() => {
			fireEvent.click(screen.getByRole("button", { name: /play video/i }));
		});

		// Act: click Replay button
		act(() => {
			fireEvent.click(screen.getByRole("button", { name: /replay 10s/i }));
		});
	});

	it("initializes in paused state by default once ready, displaying the Play button", async () => {
		// Arrange
		const youtube = createYouTubeMock(600);
		setYouTubeNamespace(youtube.namespace);

		// Act
		renderWithClient(<SessionPlayerClient vod={mockVod} />);
		await act(async () => {
			await Promise.resolve();
		});
		const player = youtube.players[0];
		act(() => {
			player.triggerReady();
		});

		// Assert
		const playBtn = screen.getByRole("button", { name: /play video/i });
		expect(playBtn.textContent).toContain("Play");
	});

	it("starts playback when user clicks the initial Play button in paused state", async () => {
		// Arrange
		const youtube = createYouTubeMock(600);
		setYouTubeNamespace(youtube.namespace);
		renderWithClient(<SessionPlayerClient vod={mockVod} />);
		await act(async () => {
			await Promise.resolve();
		});
		const player = youtube.players[0];
		act(() => {
			player.triggerReady();
		});
		const playBtn = screen.getByRole("button", { name: /play video/i });

		// Act
		act(() => {
			fireEvent.click(playBtn);
		});

		// Assert
		expect(player.playVideo).toHaveBeenCalledTimes(1);
	});

	it("handles interactive play and pause toggle buttons", async () => {
		// Arrange
		const youtube = createYouTubeMock(600);
		setYouTubeNamespace(youtube.namespace);
		const activeVod = {
			...mockVod,
			durationSeconds: 600,
			title: "Grandmaster [Ana] Oasis",
		};

		// Act
		renderWithClient(<SessionPlayerClient vod={activeVod} />);
		await act(async () => {
			await Promise.resolve();
		});

		const player = youtube.players[0];
		act(() => {
			player.triggerReady();
			player.triggerStateChange(YouTubePlayerState.PLAYING);
		});

		// Assert pause button is visible when playing
		const pauseBtn = screen.getByRole("button", { name: /pause video/i });
		expect(pauseBtn.textContent).toContain("Pause");

		// Act: click Pause
		act(() => {
			fireEvent.click(pauseBtn);
		});

		// Assert play button is visible when paused
		const playBtn = screen.getByRole("button", { name: /play video/i });
		expect(playBtn.textContent).toContain("Play");

		// Act: click Play
		act(() => {
			fireEvent.click(playBtn);
		});
	});

	it("rewinds 10 seconds on clicking replay 10s button during active playback", async () => {
		// Arrange
		const frameController = installMockFrames();
		const youtube = createYouTubeMock(600);
		setYouTubeNamespace(youtube.namespace);
		const activeVod = {
			...mockVod,
			durationSeconds: 600,
			scenarios: [
				{
					...mockVod.scenarios[0],
					timestampSeconds: 100,
				},
			],
			title: "Grandmaster [Ana] Oasis",
		};

		// Act
		renderWithClient(<SessionPlayerClient vod={activeVod} />);
		await act(async () => {
			await Promise.resolve();
		});

		const player = youtube.players[0];
		act(() => {
			player.triggerReady();
			player.triggerStateChange(YouTubePlayerState.PLAYING);
		});

		player.getCurrentTime = vi.fn(() => 45);
		act(() => {
			frameController.flush();
		});

		const replayBtn = screen.getByRole("button", { name: /replay 10s/i });
		act(() => {
			fireEvent.click(replayBtn);
		});

		// Assert
		expect(player.seekTo).toHaveBeenCalledWith(35, true);
	});

	it("rewinds 10 seconds on clicking replay 10s button while paused", async () => {
		// Arrange
		const frameController = installMockFrames();
		const youtube = createYouTubeMock(600);
		setYouTubeNamespace(youtube.namespace);
		const activeVod = {
			...mockVod,
			durationSeconds: 600,
			scenarios: [
				{
					...mockVod.scenarios[0],
					timestampSeconds: 100,
				},
			],
			title: "Grandmaster [Ana] Oasis",
		};

		// Act
		renderWithClient(<SessionPlayerClient vod={activeVod} />);
		await act(async () => {
			await Promise.resolve();
		});

		const player = youtube.players[0];
		act(() => {
			player.triggerReady();
			player.triggerStateChange(YouTubePlayerState.PLAYING);
		});

		player.getCurrentTime = vi.fn(() => 20);
		act(() => {
			frameController.flush();
		});

		act(() => {
			fireEvent.click(screen.getByRole("button", { name: /pause video/i }));
		});

		const replayBtn = screen.getByRole("button", { name: /replay 10s/i });
		act(() => {
			fireEvent.click(replayBtn);
		});

		// Assert
		expect(player.seekTo).toHaveBeenCalledWith(10, true);
	});

	it("renders correctly when vod has no scenarios", async () => {
		// Arrange
		const emptyVod = { ...mockVod, scenarios: [] };
		renderWithClient(<SessionPlayerClient vod={emptyVod} />);
		await act(async () => {
			await Promise.resolve();
		});

		// Assert
		expect(screen.getByText("Scenario: 0/0")).toBeDefined();
	});

	it("persists terminal completion for the authenticated playthrough", async () => {
		// Arrange
		const complete = vi
			.spyOn(serverFns, "completePlaythrough")
			.mockResolvedValueOnce({ success: true } as never);
		const youtube = createYouTubeMock(600);
		setYouTubeNamespace(youtube.namespace);

		// Act
		renderWithClient(
			<SessionPlayerClient playthroughId="playthrough_1" vod={mockVod} />,
		);
		await act(async () => {
			await Promise.resolve();
		});
		act(() => {
			youtube.players[0]?.triggerReady();
			youtube.players[0]?.triggerStateChange(YouTubePlayerState.PLAYING);
			youtube.players[0]?.triggerStateChange(YouTubePlayerState.ENDED);
		});

		// Assert
		expect(complete).toHaveBeenCalledWith({
			data: { playthroughId: "playthrough_1" },
		});
	});

	it("renders playback speed controls and updates playback rate", async () => {
		// Arrange
		const youtube = createYouTubeMock(600);
		setYouTubeNamespace(youtube.namespace);

		// Act
		renderWithClient(<SessionPlayerClient vod={mockVod} />);
		await act(async () => {
			await Promise.resolve();
		});

		const player = youtube.players[0];
		act(() => {
			player.triggerReady();
			player.triggerStateChange(YouTubePlayerState.PLAYING);
		});

		// Assert speed controls exist
		const speedGroup = screen.getByRole("group", { name: /playback speed/i });
		expect(speedGroup).toBeDefined();

		const btn1x = screen.getByRole("button", { name: "1x" });
		const btn125x = screen.getByRole("button", { name: "1.25x" });
		const btn15x = screen.getByRole("button", { name: "1.5x" });
		const btn2x = screen.getByRole("button", { name: "2x" });

		expect(btn1x.getAttribute("aria-pressed")).toBe("true");
		expect(btn15x.getAttribute("aria-pressed")).toBe("false");

		// Act: click 1.5x
		act(() => {
			fireEvent.click(btn15x);
		});

		// Assert 1.5x is active and called setPlaybackRate
		expect(btn15x.getAttribute("aria-pressed")).toBe("true");
		expect(btn1x.getAttribute("aria-pressed")).toBe("false");
		expect(player.setPlaybackRate).toHaveBeenCalledWith(1.5);

		// Act: click 2x
		act(() => {
			fireEvent.click(btn2x);
		});
		expect(player.setPlaybackRate).toHaveBeenCalledWith(2);

		// Act: click 1.25x
		act(() => {
			fireEvent.click(btn125x);
		});
		expect(player.setPlaybackRate).toHaveBeenCalledWith(1.25);
	});

	it("shows non-blocking buffering and blocking recovery actions", () => {
		// Arrange
		const onRetryMedia = vi.fn();
		const onRestartSession = vi.fn();
		const baseProps = {
			containerRef: vi.fn(),
			isCompleted: false,
			isLoading: false,
			isOverlayVisible: false,
			onReplayContext: vi.fn(),
			onRestartSession,
			onResume: vi.fn(),
			onRetryMedia,
			onSelectOption: vi.fn(),
			onSkipUnsupportedInput: vi.fn(),
			overlayScenarioData: null,
			overlayState: null,
		};

		// Act
		const { rerender } = render(
			<SessionPlayerViewport {...baseProps} mediaHealth="buffering" />,
		);
		expect(screen.getByRole("status").textContent).toContain("Buffering");
		rerender(<SessionPlayerViewport {...baseProps} mediaHealth="recovering" />);

		// Assert
		expect(screen.getByRole("alert").textContent).toContain("Recovering video");

		// Act
		rerender(<SessionPlayerViewport {...baseProps} mediaHealth="failed" />);
		fireEvent.click(screen.getByRole("button", { name: "Try again" }));
		fireEvent.click(screen.getByRole("button", { name: "Restart session" }));

		// Assert
		expect(onRetryMedia).toHaveBeenCalledTimes(1);
		expect(onRestartSession).toHaveBeenCalledTimes(1);
	});

	it("names the player, moves focus into terminal recovery, and applies pointer-events-none to container", () => {
		// Arrange
		const containerRef = vi.fn();
		const baseProps = {
			containerRef,
			isCompleted: false,
			isLoading: false,
			isOverlayVisible: false,
			onReplayContext: vi.fn(),
			onRestartSession: vi.fn(),
			onResume: vi.fn(),
			onRetryMedia: vi.fn(),
			onSelectOption: vi.fn(),
			onSkipUnsupportedInput: vi.fn(),
			overlayScenarioData: null,
			overlayState: null,
		};

		// Act
		const { container, rerender } = render(
			<SessionPlayerViewport {...baseProps} mediaHealth="ready" />,
		);
		const videoContainer = container.querySelector(".pointer-events-none");
		expect(videoContainer).toBeDefined();

		rerender(<SessionPlayerViewport {...baseProps} mediaHealth="failed" />);

		// Assert
		expect(
			screen.getByRole("region", { name: "Session media player" }),
		).toBeDefined();
		expect(document.activeElement).toBe(
			screen.getByRole("heading", { name: "Video playback is unavailable" }),
		);
	});

	it("announces playback recovery after a blocking state", () => {
		// Arrange
		const baseProps = {
			containerRef: vi.fn(),
			isCompleted: false,
			isLoading: false,
			isOverlayVisible: false,
			onReplayContext: vi.fn(),
			onRestartSession: vi.fn(),
			onResume: vi.fn(),
			onRetryMedia: vi.fn(),
			onSelectOption: vi.fn(),
			onSkipUnsupportedInput: vi.fn(),
			overlayScenarioData: null,
			overlayState: null,
		};

		// Act
		const { rerender } = render(
			<SessionPlayerViewport {...baseProps} mediaHealth="recovering" />,
		);
		rerender(<SessionPlayerViewport {...baseProps} mediaHealth="ready" />);

		// Assert
		expect(screen.getByRole("status").textContent).toContain(
			"Playback resumed",
		);
	});

	it("renders refined header title strictly as Interactive Demo, clean badges, and back to home link in demo mode", async () => {
		// Arrange
		const youtube = createYouTubeMock(300);
		setYouTubeNamespace(youtube.namespace);

		// Act
		renderWithClient(<SessionPlayerClient isDemo vod={mockVod} />);
		await act(async () => {
			await Promise.resolve();
		});

		// Assert header title is strictly Interactive Demo
		const heading = screen.getByRole("heading", { name: "Interactive Demo" });
		expect(heading).toBeDefined();
		expect(heading.textContent).toBe("Interactive Demo");

		// Assert clean badges: Oasis, Diamond, Ana (no "Hero:" prefix)
		expect(screen.getByText("Oasis")).toBeDefined();
		expect(screen.getByText("Diamond")).toBeDefined();
		expect(screen.getByText("Ana")).toBeDefined();
		expect(screen.queryByText(/Hero:/)).toBeNull();

		// Assert progress counter is Scenario: 1/1
		expect(screen.getByText("Scenario: 1/1")).toBeDefined();

		// Assert link back to home
		expect(screen.getByRole("link", { name: /← back to home/i })).toBeDefined();
	});

	it("renders cleanly when VOD has no extractable hero in title or heroName", async () => {
		// Arrange
		const youtube = createYouTubeMock(300);
		setYouTubeNamespace(youtube.namespace);
		const vodWithoutHero = {
			...mockVod,
			heroName: "",
			title: "Overwatch 2 Map Guide",
		};

		// Act
		renderWithClient(<SessionPlayerClient vod={vodWithoutHero} />);
		await act(async () => {
			await Promise.resolve();
		});

		// Assert title and no hero badge
		expect(screen.getByText("Overwatch 2 Map Guide")).toBeDefined();
		expect(screen.queryByText("Ana")).toBeNull();
	});
});
