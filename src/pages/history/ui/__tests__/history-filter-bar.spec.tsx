import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { PublishedVodItem } from "../../model/types";
import { HistoryFilterBar } from "../history-filter-bar";

const mockVods: PublishedVodItem[] = [
	{
		createdAt: new Date("2026-01-01"),
		durationSeconds: 1200,
		heroName: "Ana",
		id: "vod_1",
		isPublished: true,
		mapName: "King's Row",
		rankTier: "Grandmaster",
		role: "SUPPORT",
		title: "GM Ana Gameplay",
		youtubeVideoId: "yt123",
	},
	{
		createdAt: new Date("2026-01-02"),
		durationSeconds: 1500,
		heroName: "Tracer",
		id: "vod_2",
		isPublished: true,
		mapName: "Lijiang Tower",
		rankTier: "Champion",
		role: "DAMAGE",
		title: "Champion Tracer Review",
		youtubeVideoId: "yt456",
	},
];

describe("HistoryFilterBar component", () => {
	it("renders Map, Hero, Level of Play, and Player filters without VOD dropdown", () => {
		// Arrange & Act
		render(
			<HistoryFilterBar
				onModuleToggle={vi.fn()}
				selectedModules={[]}
				vods={mockVods}
			/>,
		);

		// Assert dropdowns and inputs exist
		expect(
			screen.getByRole("combobox", { name: /filter by map/i }),
		).toBeDefined();
		expect(
			screen.getByRole("combobox", { name: /filter by hero/i }),
		).toBeDefined();
		expect(
			screen.getByRole("combobox", { name: /filter by level of play/i }),
		).toBeDefined();
		expect(
			screen.getByRole("textbox", { name: /filter by player/i }),
		).toBeDefined();

		// Assert VOD dropdown is NOT rendered
		expect(
			screen.queryByRole("combobox", { name: /filter by vod/i }),
		).toBeNull();
	});

	it("uses 4-column responsive grid layout for advanced inputs", () => {
		// Arrange & Act
		const { container } = render(
			<HistoryFilterBar
				onModuleToggle={vi.fn()}
				selectedModules={[]}
				vods={mockVods}
			/>,
		);

		// Assert grid container classes
		const gridContainer = container.querySelector(".lg\\:grid-cols-4");
		expect(gridContainer).not.toBeNull();
		expect(gridContainer?.className).toContain("sm:grid-cols-2");
		expect(gridContainer?.className).toContain("lg:grid-cols-4");
		expect(gridContainer?.className).not.toContain("lg:grid-cols-5");
	});

	it("wires filter changes for Map, Hero, Level of Play, and Player inputs", () => {
		// Arrange
		const onMapChange = vi.fn();
		const onHeroChange = vi.fn();
		const onLevelOfPlayChange = vi.fn();
		const onPlayerChange = vi.fn();
		const onModuleToggle = vi.fn();

		// Act
		render(
			<HistoryFilterBar
				onHeroChange={onHeroChange}
				onLevelOfPlayChange={onLevelOfPlayChange}
				onMapChange={onMapChange}
				onModuleToggle={onModuleToggle}
				onPlayerChange={onPlayerChange}
				selectedHero="Ana"
				selectedLevelOfPlay="Grandmaster"
				selectedMap="King's Row"
				selectedModules={["STRATEGY"]}
				selectedPlayer="Proper"
				vods={mockVods}
			/>,
		);

		// Trigger Map change
		fireEvent.change(screen.getByRole("combobox", { name: /filter by map/i }), {
			target: { value: "Lijiang Tower" },
		});
		expect(onMapChange).toHaveBeenCalledWith("Lijiang Tower");

		// Trigger Hero change
		fireEvent.change(
			screen.getByRole("combobox", { name: /filter by hero/i }),
			{
				target: { value: "Tracer" },
			},
		);
		expect(onHeroChange).toHaveBeenCalledWith("Tracer");

		// Trigger Level of Play change
		fireEvent.change(
			screen.getByRole("combobox", { name: /filter by level of play/i }),
			{
				target: { value: "Champion" },
			},
		);
		expect(onLevelOfPlayChange).toHaveBeenCalledWith("Champion");

		// Trigger Player input
		fireEvent.change(
			screen.getByRole("textbox", { name: /filter by player/i }),
			{
				target: { value: "Viol2t" },
			},
		);
		expect(onPlayerChange).toHaveBeenCalledWith("Viol2t");

		// Trigger Module toggle
		fireEvent.click(screen.getByRole("button", { name: /toggle tactics/i }));
		expect(onModuleToggle).toHaveBeenCalledWith("TACTICS");
	});
});
