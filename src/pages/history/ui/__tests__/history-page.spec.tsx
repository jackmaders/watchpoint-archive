import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type {
	PlayerHistoryItem,
	PlayerHistoryResult,
	PublishedVodItem,
} from "../../model/types";
import { HistoryPage } from "../history-page";

vi.mock("@tanstack/react-router");
vi.mock("@/shared/auth");

const mockVod: PublishedVodItem = {
	createdAt: new Date("2026-01-01"),
	durationSeconds: 1200,
	heroName: "Ana",
	id: "vod_1",
	isDemo: false,
	isPublished: true,
	mapName: "King's Row",
	rankTier: "Grandmaster",
	role: "SUPPORT",
	title: "GM Ana Gameplay",
	youtubeVideoId: "yt123",
};

const mockCompletedPlaythrough: PlayerHistoryItem = {
	accuracy: 75,
	attempts: [
		{
			id: "a1",
			inputValue: null,
			isCorrect: true,
			isTimedOut: false,
			responseTimeMs: 1200,
			scenarioSnapshotId: "s1",
			selectedOptionId: "opt_1",
		},
		{
			id: "a2",
			inputValue: null,
			isCorrect: false,
			isTimedOut: false,
			responseTimeMs: 1600,
			scenarioSnapshotId: "s2",
			selectedOptionId: "opt_2",
		},
	],
	completedAt: new Date("2026-01-15T14:30:00.000Z"),
	completion: {
		completedAt: new Date("2026-01-15T14:30:00.000Z"),
		id: "comp_1",
	},
	createdAt: new Date("2026-01-15T14:00:00.000Z"),
	id: "playthrough_comp_1",
	medianLatencyMs: 1400,
	moduleSelections: [{ moduleType: "STRATEGY" }, { moduleType: "TACTICS" }],
	scenarioSnapshots: [
		{
			explanationText: "Take high ground",
			id: "s1",
			imageUrl: null,
			inputConfig: {},
			inputType: "MULTIPLE_CHOICE",
			moduleType: "STRATEGY",
			position: 0,
			promptText: "Positioning question",
			scenarioId: "scen_1",
			timeLimitSeconds: 15,
			timestampSeconds: 60,
		},
		{
			explanationText: "Track cooldown",
			id: "s2",
			imageUrl: null,
			inputConfig: {},
			inputType: "MULTIPLE_CHOICE",
			moduleType: "TACTICS",
			position: 1,
			promptText: "Tactics question",
			scenarioId: "scen_2",
			timeLimitSeconds: 3,
			timestampSeconds: 120,
		},
	],
	status: "COMPLETED",
	userId: "player_1",
	vod: {
		durationSeconds: 1200,
		id: "vod_1",
		mapName: "King's Row",
		rankTier: "Grandmaster",
		title: "GM Ana Gameplay",
		youtubeVideoId: "yt123",
	},
	vodId: "vod_1",
};

describe("HistoryPage component", () => {
	it("renders heading, navigation header, and account controls", () => {
		// Arrange & Act
		render(
			<HistoryPage
				data={{
					items: [],
					page: 1,
					pageSize: 10,
					total: 0,
					totalPages: 1,
				}}
				vods={[mockVod]}
			/>,
		);

		// Assert
		expect(
			screen.getByRole("heading", { name: "Training History" }),
		).toBeDefined();
		expect(screen.queryByText("Performance History")).toBeNull();
		expect(screen.getByRole("button", { name: "Log In" })).toBeDefined();
		expect(screen.getByRole("button", { name: "Sign Up" })).toBeDefined();
	});

	it("renders populated completed playthrough items with metrics and review link", () => {
		// Arrange
		const data: PlayerHistoryResult = {
			items: [mockCompletedPlaythrough],
			page: 1,
			pageSize: 10,
			total: 1,
			totalPages: 1,
		};

		// Act
		render(<HistoryPage data={data} vods={[mockVod]} />);

		// Assert
		expect(screen.getByText("GM Ana Gameplay")).toBeDefined();
		expect(screen.getAllByText("King's Row").length).toBeGreaterThanOrEqual(1);
		expect(screen.getByText("75%")).toBeDefined();
		expect(screen.getByText("1,400 ms")).toBeDefined();
		expect(screen.getAllByText("Strategy").length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText("Tactics").length).toBeGreaterThanOrEqual(1);
		expect(screen.getByRole("link", { name: /review details/i })).toBeDefined();
	});

	it("renders completed playthrough falling back to createdAt when completedAt is null", () => {
		// Arrange
		const itemWithoutCompletedAt: PlayerHistoryItem = {
			...mockCompletedPlaythrough,
			completedAt: null,
			createdAt: new Date("2026-02-01T12:00:00.000Z"),
		};
		const data: PlayerHistoryResult = {
			items: [itemWithoutCompletedAt],
			page: 1,
			pageSize: 10,
			total: 1,
			totalPages: 1,
		};

		// Act
		render(<HistoryPage data={data} vods={[mockVod]} />);

		// Assert
		expect(
			screen.getByText(
				`Completed: ${new Date("2026-02-01T12:00:00.000Z").toLocaleDateString()}`,
			),
		).toBeDefined();
	});

	it("renders empty state when no history exists", () => {
		// Arrange
		const data: PlayerHistoryResult = {
			items: [],
			page: 1,
			pageSize: 10,
			total: 0,
			totalPages: 1,
		};

		// Act
		render(<HistoryPage data={data} vods={[]} />);

		// Assert
		expect(
			screen.getByText(/no completed training sessions yet/i),
		).toBeDefined();
		expect(
			screen.getByRole("link", { name: /browse training vods/i }),
		).toBeDefined();
	});

	it("triggers filter changes when filter or module chip is clicked", () => {
		// Arrange
		const onFilterChange = vi.fn();
		const data: PlayerHistoryResult = {
			items: [],
			page: 1,
			pageSize: 10,
			total: 0,
			totalPages: 1,
		};

		// Act
		render(
			<HistoryPage
				data={data}
				onFilterChange={onFilterChange}
				vods={[mockVod]}
			/>,
		);

		// Select Map Filter
		const mapSelect = screen.getByRole("combobox", { name: /filter by map/i });
		fireEvent.change(mapSelect, { target: { value: "King's Row" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ map: "King's Row", page: 1 }),
		);

		// Select Hero Filter
		const heroSelect = screen.getByRole("combobox", {
			name: /filter by hero/i,
		});
		fireEvent.change(heroSelect, { target: { value: "Ana" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ hero: "Ana", page: 1 }),
		);

		// Select Level of Play Filter
		const levelSelect = screen.getByRole("combobox", {
			name: /filter by level of play/i,
		});
		fireEvent.change(levelSelect, { target: { value: "Grandmaster" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ levelOfPlay: "Grandmaster", page: 1 }),
		);

		// Player Input Filter
		const playerInput = screen.getByRole("textbox", {
			name: /filter by player/i,
		});
		fireEvent.change(playerInput, { target: { value: "Proper" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ page: 1, player: "Proper" }),
		);

		// Toggle Module Chip (Select)
		fireEvent.click(screen.getByRole("button", { name: /toggle strategy/i }));
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ modules: ["STRATEGY"], page: 1 }),
		);
	});

	it("handles deselecting an active module chip", () => {
		// Arrange
		const onFilterChange = vi.fn();
		const data: PlayerHistoryResult = {
			items: [],
			page: 1,
			pageSize: 10,
			total: 0,
			totalPages: 1,
		};

		// Act
		render(
			<HistoryPage
				data={data}
				onFilterChange={onFilterChange}
				searchParams={{ modules: ["STRATEGY", "TACTICS"] }}
				vods={[mockVod]}
			/>,
		);

		// Deselect Strategy
		fireEvent.click(screen.getByRole("button", { name: /toggle strategy/i }));
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ modules: ["TACTICS"], page: 1 }),
		);

		// Deselect sole remaining module to set modules to undefined
		const { unmount } = render(
			<HistoryPage
				data={data}
				onFilterChange={onFilterChange}
				searchParams={{ modules: ["STRATEGY"] }}
				vods={[mockVod]}
			/>,
		);
		fireEvent.click(
			screen.getAllByRole("button", { name: /toggle strategy/i })[1],
		);
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ modules: undefined, page: 1 }),
		);
		unmount();
	});

	it("handles clicking 'All Scenarios' to reset active module filters", () => {
		// Arrange
		const onFilterChange = vi.fn();
		const data: PlayerHistoryResult = {
			items: [],
			page: 1,
			pageSize: 10,
			total: 0,
			totalPages: 1,
		};

		// Act
		render(
			<HistoryPage
				data={data}
				onFilterChange={onFilterChange}
				searchParams={{ modules: ["STRATEGY", "TRACKING"] }}
				vods={[mockVod]}
			/>,
		);

		fireEvent.click(
			screen.getByRole("button", { name: /toggle all scenarios/i }),
		);

		// Assert
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ modules: undefined, page: 1 }),
		);
	});

	it("handles clearing Map, Hero, Level of Play, and Player filters", () => {
		// Arrange
		const onFilterChange = vi.fn();
		const data: PlayerHistoryResult = {
			items: [],
			page: 1,
			pageSize: 10,
			total: 0,
			totalPages: 1,
		};

		// Act
		render(
			<HistoryPage
				data={data}
				onFilterChange={onFilterChange}
				searchParams={{
					hero: "Ana",
					levelOfPlay: "Grandmaster",
					map: "King's Row",
					player: "Proper",
				}}
				vods={[mockVod]}
			/>,
		);

		// Clear Map
		const mapSelect = screen.getByRole("combobox", { name: /filter by map/i });
		fireEvent.change(mapSelect, { target: { value: "" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ map: undefined, page: 1 }),
		);

		// Clear Hero
		const heroSelect = screen.getByRole("combobox", {
			name: /filter by hero/i,
		});
		fireEvent.change(heroSelect, { target: { value: "" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ hero: undefined, page: 1 }),
		);

		// Clear Level of Play
		const levelSelect = screen.getByRole("combobox", {
			name: /filter by level of play/i,
		});
		fireEvent.change(levelSelect, { target: { value: "" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ levelOfPlay: undefined, page: 1 }),
		);

		// Clear Player
		const playerInput = screen.getByRole("textbox", {
			name: /filter by player/i,
		});
		fireEvent.change(playerInput, { target: { value: "" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ page: 1, player: undefined }),
		);
	});

	it("handles pagination next and previous clicks", () => {
		// Arrange
		const onFilterChange = vi.fn();
		const data: PlayerHistoryResult = {
			items: [mockCompletedPlaythrough],
			page: 2,
			pageSize: 10,
			total: 25,
			totalPages: 3,
		};

		// Act
		render(
			<HistoryPage
				data={data}
				onFilterChange={onFilterChange}
				searchParams={{ page: 2 }}
				vods={[mockVod]}
			/>,
		);

		// Click Previous
		fireEvent.click(screen.getByRole("button", { name: /previous/i }));
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ page: 1 }),
		);

		// Click Next
		fireEvent.click(screen.getByRole("button", { name: /next/i }));
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ page: 3 }),
		);
	});

	it("renders loading skeletons when isLoading is true", () => {
		// Arrange & Act
		render(<HistoryPage isLoading={true} />);

		// Assert
		expect(screen.getByLabelText("Loading training history")).toBeDefined();
	});

	it("renders error state with retry button", () => {
		// Arrange
		const onRetry = vi.fn();

		// Act
		render(<HistoryPage error="Network error" onRetry={onRetry} />);

		// Assert
		expect(screen.getByText("Network error")).toBeDefined();
		fireEvent.click(screen.getByRole("button", { name: /retry/i }));
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it("renders error state without retry button when onRetry is omitted", () => {
		// Arrange & Act
		render(<HistoryPage error="Fatal network failure" />);

		// Assert
		expect(screen.getByText("Fatal network failure")).toBeDefined();
		expect(screen.queryByRole("button", { name: /retry/i })).toBeNull();
	});

	it("renders playthrough card with fallback labels when vod metadata is undefined", () => {
		// Arrange
		const itemWithoutVod: PlayerHistoryItem = {
			...mockCompletedPlaythrough,
			vod: undefined,
		};
		const data: PlayerHistoryResult = {
			items: [itemWithoutVod],
			page: 1,
			pageSize: 10,
			total: 1,
			totalPages: 1,
		};

		// Act
		render(<HistoryPage data={data} vods={[]} />);

		// Assert
		expect(screen.getByText("Unknown Map")).toBeDefined();
		expect(screen.getByText("Rank")).toBeDefined();
		expect(screen.getByText("VOD Training Session")).toBeDefined();
	});

	it("renders default empty view when props are undefined", () => {
		// Arrange & Act
		render(<HistoryPage registrationEnabled={false} />);

		// Assert
		expect(
			screen.getByText(/no completed training sessions yet/i),
		).toBeDefined();
	});
});
