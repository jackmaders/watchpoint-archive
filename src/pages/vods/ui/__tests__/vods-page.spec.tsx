import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { formatDuration, VodsPage } from "../vods-page";

vi.mock("@tanstack/react-router");
vi.mock("@/shared/auth");
vi.mock("@/features/authentication");

describe("VodsPage catalog component", () => {
	it("renders empty state message when no VODs are provided", () => {
		// Arrange & Act
		render(<VodsPage />);

		// Assert
		expect(
			screen.getByText(/no training vods currently available/i),
		).toBeDefined();
		expect(screen.getByRole("main")).toBeDefined();
	});

	it("renders VOD cards with map name, hero name, rank tier, duration, and Start Training action", () => {
		// Arrange
		const mockVods = [
			{
				createdAt: new Date("2026-08-06T10:00:00Z"),
				durationSeconds: 1080,
				heroName: "Ana",
				id: "vod_1",
				isDemo: false,
				isPublished: true,
				mapName: "King's Row",
				rankTier: "Grandmaster",
				role: "SUPPORT" as const,
				scenarios: [
					{ id: "1" },
					{ id: "2" },
					{ id: "3" },
					{ id: "4" },
					{ id: "5" },
				],
				title: "GM Ana VOD — King's Row Defense & Attack",
				youtubeVideoId: "dQw4w9WgXcQ",
			},
		];

		// Act
		render(<VodsPage vods={mockVods} />);

		// Assert
		expect(
			screen.getByText("GM Ana VOD — King's Row Defense & Attack"),
		).toBeDefined();
		expect(screen.getAllByText("King's Row").length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText("Ana").length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText("Grandmaster").length).toBeGreaterThanOrEqual(1);
		expect(screen.getByText(/18m 00s/)).toBeDefined();
		expect(screen.getByText(/5 Scenarios/)).toBeDefined();
		expect(screen.queryByText(/interactive training engine/i)).toBeNull();

		const startButton = screen.getByRole("link", { name: /start training/i });
		expect(startButton).toBeDefined();
		expect(startButton.getAttribute("href")).toBe("/vods/vod_1");
		expect(startButton.className).toContain("bg-primary");
		expect(startButton.className).toContain("text-primary-foreground");
		expect(startButton.className).toContain("focus-visible:ring-ring");
	});

	it("triggers filter callbacks when Map, Hero, Level of Play, and Player change", () => {
		// Arrange
		const onFilterChange = vi.fn();
		const mockVods = [
			{
				createdAt: new Date("2026-08-06T10:00:00Z"),
				durationSeconds: 1080,
				heroName: "Ana",
				id: "vod_1",
				isDemo: false,
				isPublished: true,
				mapName: "King's Row",
				rankTier: "Grandmaster",
				role: "SUPPORT" as const,
				scenarios: [{ id: "1" }],
				title: "GM Ana VOD — King's Row Defense & Attack",
				youtubeVideoId: "dQw4w9WgXcQ",
			},
		];

		// Act
		render(<VodsPage onFilterChange={onFilterChange} vods={mockVods} />);

		// Map change
		const mapSelect = screen.getByRole("combobox", { name: /filter by map/i });
		fireEvent.change(mapSelect, { target: { value: "King's Row" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ map: "King's Row" }),
		);

		// Hero change
		const heroSelect = screen.getByRole("combobox", {
			name: /filter by hero/i,
		});
		fireEvent.change(heroSelect, { target: { value: "Ana" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ hero: "Ana" }),
		);

		// Level of Play change
		const levelSelect = screen.getByRole("combobox", {
			name: /filter by level of play/i,
		});
		fireEvent.change(levelSelect, { target: { value: "Grandmaster" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ levelOfPlay: "Grandmaster" }),
		);

		// Player input change
		const playerInput = screen.getByRole("textbox", {
			name: /filter by player/i,
		});
		fireEvent.change(playerInput, { target: { value: "Proper" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ player: "Proper" }),
		);
	});

	it("handles clearing individual Map, Hero, Level of Play, and Player filters", () => {
		// Arrange
		const onFilterChange = vi.fn();
		const mockVods = [
			{
				createdAt: new Date("2026-08-06T10:00:00Z"),
				durationSeconds: 1080,
				heroName: "Ana",
				id: "vod_1",
				isDemo: false,
				isPublished: true,
				mapName: "King's Row",
				rankTier: "Grandmaster",
				role: "SUPPORT" as const,
				scenarios: [{ id: "1" }],
				title: "GM Ana VOD — King's Row Defense & Attack",
				youtubeVideoId: "dQw4w9WgXcQ",
			},
		];

		// Act
		render(
			<VodsPage
				onFilterChange={onFilterChange}
				searchParams={{
					hero: "Ana",
					levelOfPlay: "Grandmaster",
					map: "King's Row",
					player: "Proper",
				}}
				vods={mockVods}
			/>,
		);

		// Clear Map
		const mapSelect = screen.getByRole("combobox", { name: /filter by map/i });
		fireEvent.change(mapSelect, { target: { value: "" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ map: undefined }),
		);

		// Clear Hero
		const heroSelect = screen.getByRole("combobox", {
			name: /filter by hero/i,
		});
		fireEvent.change(heroSelect, { target: { value: "" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ hero: undefined }),
		);

		// Clear Level of Play
		const levelSelect = screen.getByRole("combobox", {
			name: /filter by level of play/i,
		});
		fireEvent.change(levelSelect, { target: { value: "" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ levelOfPlay: undefined }),
		);

		// Clear Player
		const playerInput = screen.getByRole("textbox", {
			name: /filter by player/i,
		});
		fireEvent.change(playerInput, { target: { value: "" } });
		expect(onFilterChange).toHaveBeenCalledWith(
			expect.objectContaining({ player: undefined }),
		);
	});

	it("renders Clear Filters button and handles clear when filters are active", () => {
		// Arrange
		const onFilterChange = vi.fn();

		// Act
		render(
			<VodsPage
				onFilterChange={onFilterChange}
				searchParams={{ hero: "Ana", map: "King's Row" }}
				vods={[]}
			/>,
		);

		// Assert
		expect(
			screen.getByText(/no training vods match the selected filters/i),
		).toBeDefined();

		const clearButtons = screen.getAllByRole("button", {
			name: /clear filters/i,
		});
		expect(clearButtons.length).toBeGreaterThanOrEqual(1);

		fireEvent.click(clearButtons[0]);
		expect(onFilterChange).toHaveBeenCalledWith({});
	});

	it("formats duration correctly when under 1 minute or with remaining seconds", () => {
		// Arrange
		const mockVods = [
			{
				createdAt: new Date("2026-08-06T10:00:00Z"),
				durationSeconds: 45,
				heroName: "Reinhardt",
				id: "vod_short",
				isDemo: false,
				isPublished: true,
				mapName: "Eichenwalde",
				rankTier: "Master",
				role: "TANK" as const,
				scenarios: [{ id: "1" }, { id: "2" }],
				title: "Short VOD",
				youtubeVideoId: "abc12345",
			},
		];

		// Act
		render(<VodsPage vods={mockVods} />);

		// Assert
		expect(screen.getByText(/0m 45s/)).toBeDefined();
	});

	describe("formatDuration helper", () => {
		it("handles negative, fractional, and NaN duration inputs safely", () => {
			// Arrange & Act & Assert
			expect(formatDuration(-10)).toBe("0m 00s");
			expect(formatDuration(NaN)).toBe("0m 00s");
			expect(formatDuration(125.7)).toBe("2m 05s");
		});
	});
});
