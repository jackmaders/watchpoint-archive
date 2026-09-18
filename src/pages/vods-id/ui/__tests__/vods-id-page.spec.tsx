import { useNavigate } from "@tanstack/react-router";
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authClient } from "@/shared/auth";
import type { SessionManifest } from "@/widgets/admin-vod-editor";
import { VodsIdPage } from "../vods-id-page";

vi.mock("@tanstack/react-router");
vi.mock("@/shared/auth");

describe("VodsIdPage", () => {
	const navigate = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useNavigate).mockReturnValue(navigate);
	});

	const mockVod: SessionManifest = {
		createdAt: new Date("2026-08-06T10:00:00Z"),
		durationSeconds: 1080,
		heroName: "Ana",
		id: "vod_1",
		isDemo: false,
		isPublished: true,
		mapName: "King's Row",
		rankTier: "Grandmaster",
		role: "SUPPORT",
		scenarios: [
			{
				explanationText: "Strategy explanation",
				id: "sc_1",
				imageUrl: null,
				inputConfig: {},
				inputType: "MULTIPLE_CHOICE",
				moduleType: "STRATEGY",
				promptText: "Pre-fight strategy",
				timeLimitSeconds: null,
				timestampSeconds: 30,
				vodId: "vod_1",
			},
			{
				explanationText: "Tactics explanation",
				id: "sc_2",
				imageUrl: null,
				inputConfig: {},
				inputType: "MULTIPLE_CHOICE",
				moduleType: "TACTICS",
				promptText: "Mid-fight tactics",
				timeLimitSeconds: null,
				timestampSeconds: 60,
				vodId: "vod_1",
			},
			{
				explanationText: "Ult explanation",
				id: "sc_3",
				imageUrl: null,
				inputConfig: {},
				inputType: "MULTIPLE_CHOICE",
				moduleType: "TRACKING",
				promptText: "Tracking prompt",
				timeLimitSeconds: null,
				timestampSeconds: 90,
				vodId: "vod_1",
			},
			{
				explanationText: "Cooldown explanation",
				id: "sc_4",
				imageUrl: null,
				inputConfig: {},
				inputType: "MULTIPLE_CHOICE",
				moduleType: "TRACKING",
				promptText: "Tracking prompt 2",
				timeLimitSeconds: null,
				timestampSeconds: 120,
				vodId: "vod_1",
			},
			{
				explanationText: "Spatial explanation",
				id: "sc_5",
				imageUrl: null,
				inputConfig: {},
				inputType: "MULTIPLE_CHOICE",
				moduleType: "SPATIAL",
				promptText: "Spatial awareness",
				timeLimitSeconds: null,
				timestampSeconds: 150,
				vodId: "vod_1",
			},
		],
		title: "Grandmaster Ana VOD - King's Row",
		youtubeVideoId: "dQw4w9WgXcQ",
	};

	it("renders VOD detail header with map name, rank tier, hero badge, duration, and title", () => {
		// Arrange & Act
		render(<VodsIdPage vod={mockVod} />);

		// Assert
		expect(screen.getByText("Grandmaster Ana VOD - King's Row")).toBeDefined();
		expect(screen.getByText("King's Row")).toBeDefined();
		expect(screen.getByText("Grandmaster")).toBeDefined();
		expect(screen.getByText("Ana")).toBeDefined();
		expect(screen.queryByText(/Hero:/)).toBeNull();
		expect(screen.getByText("Duration: 18m 00s")).toBeDefined();
		expect(screen.getByText("Total Scenarios: 5")).toBeDefined();
	});

	it("renders without hero badge when title has no matching hero", () => {
		// Arrange
		const vodWithoutHero = {
			...mockVod,
			title: "Overwatch Ranked Match",
		};

		// Act
		render(<VodsIdPage vod={vodWithoutHero} />);

		// Assert
		expect(screen.queryByText(/Hero:/)).toBeNull();
	});

	it("opens the authentication modal before anonymous training starts", () => {
		// Arrange
		render(<VodsIdPage vod={mockVod} />);

		// Act
		fireEvent.click(
			screen.getByRole("link", { name: "Start Training Session" }),
		);

		// Assert
		expect(screen.getByRole("dialog")).toBeDefined();
		expect(screen.getByRole("tab", { name: "Sign in" })).toBeDefined();
	});

	it("returns an authenticated player to the requested training destination", async () => {
		// Arrange
		render(<VodsIdPage vod={mockVod} />);
		fireEvent.click(
			screen.getByRole("link", { name: "Start Training Session" }),
		);

		// Act
		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "player@example.com" },
		});
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "correct-password" },
		});
		fireEvent.submit(
			screen
				.getByRole("button", { name: "Sign in" })
				.closest("form") as HTMLFormElement,
		);

		// Assert
		await waitFor(() =>
			expect(navigate).toHaveBeenCalledWith({
				params: { id: "vod_1" },
				search: {
					modules: "STRATEGY,TACTICS,TRACKING,SPATIAL",
				},
				to: "/vods/$id/session",
			}),
		);
	});

	it("allows an authenticated player to start training with selected modules", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: { user: { id: "user-1" } },
		} as never);
		render(<VodsIdPage vod={mockVod} />);

		// Act
		const startLink = screen.getByRole("link", {
			name: "Start Training Session",
		});
		fireEvent.click(startLink);

		// Assert
		expect(screen.queryByRole("dialog")).toBeNull();
		expect(startLink.getAttribute("href")).toContain("/vods/vod_1/session");
		expect(startLink.getAttribute("href")).toContain(
			"modules=STRATEGY%2CTACTICS%2CTRACKING%2CSPATIAL",
		);
	});

	it("displays 5 / 5 active scenarios count when all 4 modules are selected", () => {
		// Arrange & Act
		render(<VodsIdPage vod={mockVod} />);

		// Assert
		expect(screen.getByText("5 / 5")).toBeDefined();
		expect(screen.getByText("4 of 4 modules active")).toBeDefined();
	});

	it("dynamically updates active scenarios count when modules are toggled", async () => {
		// Arrange
		render(<VodsIdPage vod={mockVod} />);

		// Act: Disable Tracking (which has 2 scenarios: sc_3 and sc_4)
		const trackingBtn = screen.getByRole("button", { name: /^tracking/i });
		await act(async () => {
			fireEvent.click(trackingBtn);
		});

		// Assert: Active Scenarios should now be 3 / 5 (STRATEGY, TACTICS, SPATIAL)
		expect(screen.getByText("3 / 5")).toBeDefined();
		expect(screen.getByText("3 of 4 modules active")).toBeDefined();

		// Act: Disable Strategy (1 scenario: sc_1)
		const strategyBtn = screen.getByRole("button", { name: /^strategy/i });
		await act(async () => {
			fireEvent.click(strategyBtn);
		});

		// Assert: Active Scenarios should now be 2 / 5 (TACTICS, SPATIAL)
		expect(screen.getByText("2 / 5")).toBeDefined();
		expect(screen.getByText("2 of 4 modules active")).toBeDefined();
	});

	it("renders module filter controls for all 4 modules (STRATEGY, TACTICS, TRACKING, SPATIAL)", () => {
		// Arrange & Act
		render(<VodsIdPage vod={mockVod} />);

		// Assert
		expect(screen.getByRole("button", { name: /^strategy/i })).toBeDefined();
		expect(screen.getByRole("button", { name: /^tactics/i })).toBeDefined();
		expect(screen.getByRole("button", { name: /^tracking/i })).toBeDefined();
		expect(screen.getByRole("button", { name: /^awareness/i })).toBeDefined();
	});

	it("updates session launcher href when a module filter is toggled off", async () => {
		// Arrange
		render(<VodsIdPage vod={mockVod} />);
		const strategyBtn = screen.getByRole("button", { name: /^strategy/i });

		// Act
		await act(async () => {
			fireEvent.click(strategyBtn);
		});

		// Assert
		const startLink = screen.getByRole("link", { name: /start training/i });
		expect(startLink.getAttribute("href")).not.toContain("STRATEGY");
	});

	it("re-enables a module filter when toggled back on", async () => {
		// Arrange
		render(<VodsIdPage vod={mockVod} />);
		const strategyBtn = screen.getByRole("button", { name: /^strategy/i });

		// Act
		await act(async () => {
			fireEvent.click(strategyBtn);
		});
		await act(async () => {
			fireEvent.click(strategyBtn);
		});

		// Assert
		const startLink = screen.getByRole("link", { name: /start training/i });
		expect(startLink.getAttribute("href")).toContain("STRATEGY");
	});

	it("displays '1 module selected' when exactly 1 module remains selected", async () => {
		// Arrange
		render(<VodsIdPage vod={mockVod} />);
		const moduleNamesToDisable = [/^strategy/i, /^tactics/i, /^tracking/i];

		// Act
		for (const modName of moduleNamesToDisable) {
			await act(async () => {
				fireEvent.click(screen.getByRole("button", { name: modName }));
			});
		}

		// Assert
		expect(screen.getByText("1 module selected")).toBeDefined();
	});

	it("handles deselecting all modules by showing warning and disabling start link", async () => {
		// Arrange
		render(<VodsIdPage vod={mockVod} />);
		const deselectAllBtn = screen.getByRole("button", {
			name: /^deselect all$/i,
		});

		// Act
		await act(async () => {
			fireEvent.click(deselectAllBtn);
		});

		// Assert
		expect(
			screen.getByText(/select at least one module to start training/i),
		).toBeDefined();
		const startLink = screen.getByRole("link", { name: /start training/i });
		expect(startLink.getAttribute("href")).toBeNull();
		expect(startLink.getAttribute("aria-disabled")).toBe("true");

		fireEvent.click(startLink);
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("does not render the removed Pre-Session Setup eyebrow badge", () => {
		// Arrange & Act
		render(<VodsIdPage vod={mockVod} />);

		// Assert
		expect(screen.queryByText("Pre-Session Setup")).toBeNull();
	});

	it("renders sticky CTA footer container for half-width viewport accessibility", () => {
		// Arrange & Act
		const { container } = render(<VodsIdPage vod={mockVod} />);

		// Assert
		const stickyContainer = container.querySelector(".sticky.bottom-0");
		expect(stickyContainer).not.toBeNull();
	});

	it("renders canonical module descriptions for training pillars", () => {
		// Arrange & Act
		render(<VodsIdPage vod={mockVod} />);

		// Assert
		expect(
			screen.getByText(
				"Pre-fight positioning, win-conditions, and lose-conditions",
			),
		).toBeDefined();
		expect(
			screen.getByText("Mid-fight opportunities and cooldown usage"),
		).toBeDefined();
		expect(
			screen.getAllByText("Ultimate and ability tracking").length,
		).toBeGreaterThanOrEqual(1);
		expect(
			screen.getByText("Spatial awareness and positional tracking"),
		).toBeDefined();
	});

	it("renders VOD Not Found UI when vod is not found", () => {
		// Arrange & Act
		render(<VodsIdPage vod={null} />);

		// Assert
		expect(screen.getByText("VOD Not Found")).toBeDefined();
	});
});
