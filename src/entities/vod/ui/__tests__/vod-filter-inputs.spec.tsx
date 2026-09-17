/**
 * Tests the shared interactive filter controls component for VOD catalogs and playthrough history.
 *
 * Verifies dropdown rendering of unique Maps, Heroes, Levels of Play, and text search for Player,
 * dynamic option extraction strictly from provided datasets, and propagation of change events to callback handlers.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { PublishedVodItem } from "../../model/types";
import { VodFilterInputs } from "../vod-filter-inputs";

const mockVods: PublishedVodItem[] = [
	{
		createdAt: new Date("2026-01-01"),
		durationSeconds: 1200,
		heroName: "Ana",
		id: "vod_1",
		isDemo: false,
		isPublished: true,
		mapName: "King's Row",
		rankTier: "Grandmaster",
		role: "SUPPORT",
		scenarios: [{ id: "sc_1" }],
		title: "GM Ana Gameplay",
		youtubeVideoId: "yt123",
	},
	{
		createdAt: new Date("2026-01-02"),
		durationSeconds: 1500,
		heroName: "Tracer",
		id: "vod_2",
		isDemo: false,
		isPublished: true,
		mapName: "Lijiang Tower",
		rankTier: "Champion",
		role: "DAMAGE",
		scenarios: [{ id: "sc_2" }],
		title: "Champion Tracer Review",
		youtubeVideoId: "yt456",
	},
];

describe("VodFilterInputs component", () => {
	it("renders Map, Hero, Level of Play dropdowns and Player text input with correct labels and placeholders", () => {
		// Arrange & Act
		render(<VodFilterInputs vods={mockVods} />);

		// Assert
		const mapSelect = screen.getByRole("combobox", { name: /filter by map/i });
		const heroSelect = screen.getByRole("combobox", {
			name: /filter by hero/i,
		});
		const levelSelect = screen.getByRole("combobox", {
			name: /filter by level of play/i,
		});
		const playerInput = screen.getByRole("textbox", {
			name: /filter by player/i,
		});

		expect(mapSelect).toBeDefined();
		expect(heroSelect).toBeDefined();
		expect(levelSelect).toBeDefined();
		expect(playerInput).toBeDefined();

		expect(screen.getByText("All Maps")).toBeDefined();
		expect(screen.getByText("All Heroes")).toBeDefined();
		expect(screen.getByText("All Levels of Play")).toBeDefined();
		expect(playerInput.getAttribute("placeholder")).toBe("Filter by player…");
	});

	it("populates dropdown options strictly from dataset without static default constants", () => {
		// Arrange & Act
		render(<VodFilterInputs vods={mockVods} />);

		// Assert - Map dropdown
		const mapSelect = screen.getByRole("combobox", { name: /filter by map/i });
		const mapOptions = Array.from(mapSelect.querySelectorAll("option")).map(
			(o) => o.textContent,
		);
		expect(mapOptions).toEqual(["All Maps", "King's Row", "Lijiang Tower"]);

		// Assert - Hero dropdown
		const heroSelect = screen.getByRole("combobox", {
			name: /filter by hero/i,
		});
		const heroOptions = Array.from(heroSelect.querySelectorAll("option")).map(
			(o) => o.textContent,
		);
		expect(heroOptions).toEqual(["All Heroes", "Ana", "Tracer"]);

		// Assert - Level of Play dropdown: only Grandmaster & Champion exist
		const levelSelect = screen.getByRole("combobox", {
			name: /filter by level of play/i,
		});
		const levelOptions = Array.from(levelSelect.querySelectorAll("option")).map(
			(o) => o.textContent,
		);
		expect(levelOptions).toEqual([
			"All Levels of Play",
			"Champion",
			"Grandmaster",
		]);
		expect(screen.queryByText("FACEIT")).toBeNull();
		expect(screen.queryByText("OWCS")).toBeNull();
		expect(screen.queryByText("Diamond")).toBeNull();
	});

	it("includes selected filter value in dropdown options even if absent in dataset", () => {
		// Arrange & Act
		render(
			<VodFilterInputs
				selectedHero="Reinhardt"
				selectedLevelOfPlay="Diamond"
				selectedMap="Numbani"
				vods={mockVods}
			/>,
		);

		// Assert
		expect(screen.getByText("Numbani")).toBeDefined();
		expect(screen.getByText("Reinhardt")).toBeDefined();
		expect(screen.getByText("Diamond")).toBeDefined();
	});

	it("wires onChange callbacks for map, hero, levelOfPlay, and player inputs", () => {
		// Arrange
		const onMapChange = vi.fn();
		const onHeroChange = vi.fn();
		const onLevelOfPlayChange = vi.fn();
		const onPlayerChange = vi.fn();

		// Act
		render(
			<VodFilterInputs
				onHeroChange={onHeroChange}
				onLevelOfPlayChange={onLevelOfPlayChange}
				onMapChange={onMapChange}
				onPlayerChange={onPlayerChange}
				vods={mockVods}
			/>,
		);

		// Map change
		fireEvent.change(screen.getByRole("combobox", { name: /filter by map/i }), {
			target: { value: "King's Row" },
		});
		expect(onMapChange).toHaveBeenCalledWith("King's Row");

		// Hero change
		fireEvent.change(
			screen.getByRole("combobox", { name: /filter by hero/i }),
			{
				target: { value: "Ana" },
			},
		);
		expect(onHeroChange).toHaveBeenCalledWith("Ana");

		// Level of Play change
		fireEvent.change(
			screen.getByRole("combobox", { name: /filter by level of play/i }),
			{
				target: { value: "Grandmaster" },
			},
		);
		expect(onLevelOfPlayChange).toHaveBeenCalledWith("Grandmaster");

		// Player input change
		fireEvent.change(
			screen.getByRole("textbox", { name: /filter by player/i }),
			{
				target: { value: "Proper" },
			},
		);
		expect(onPlayerChange).toHaveBeenCalledWith("Proper");
	});

	it("handles undefined callbacks gracefully when user changes filters", () => {
		// Arrange
		render(<VodFilterInputs vods={mockVods} />);

		// Act & Assert
		expect(() => {
			fireEvent.change(
				screen.getByRole("combobox", { name: /filter by map/i }),
				{
					target: { value: "King's Row" },
				},
			);
			fireEvent.change(
				screen.getByRole("combobox", { name: /filter by hero/i }),
				{
					target: { value: "Ana" },
				},
			);
			fireEvent.change(
				screen.getByRole("combobox", { name: /filter by level of play/i }),
				{
					target: { value: "Grandmaster" },
				},
			);
			fireEvent.change(
				screen.getByRole("textbox", { name: /filter by player/i }),
				{
					target: { value: "Proper" },
				},
			);
		}).not.toThrow();
	});
});
