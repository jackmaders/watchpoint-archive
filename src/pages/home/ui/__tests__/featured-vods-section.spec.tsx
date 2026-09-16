import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FeaturedVodsSection } from "../featured-vods-section";

vi.mock("@tanstack/react-router");

describe("FeaturedVodsSection", () => {
	it("renders empty state when no VOD items are provided", () => {
		// Arrange
		render(<FeaturedVodsSection vods={[]} />);

		// Act
		const emptyText = screen.getByText(
			/no training scenarios currently available/i,
		);

		// Assert
		expect(emptyText).toBeDefined();
		expect(
			screen.getByRole("link", { name: /explore catalog/i }),
		).toBeDefined();
	});

	it("renders scenario cards with map, rank, title, and start link when VODs exist", () => {
		// Arrange
		const mockVods = [
			{
				createdAt: new Date(),
				durationSeconds: 154,
				heroName: "Ana",
				id: "vod_ana",
				isPublished: true,
				mapName: "King's Row",
				rankTier: "Grandmaster",
				role: "SUPPORT" as const,
				scenarios: [{ id: "sc_1" }, { id: "sc_2" }],
				title: "Grandmaster Ana Support Mastery",
				youtubeVideoId: "youtube_1",
			},
		];

		// Act
		render(<FeaturedVodsSection vods={mockVods} />);

		// Assert
		expect(screen.getByText("Grandmaster Ana Support Mastery")).toBeDefined();
		expect(screen.getByText("King's Row")).toBeDefined();
		expect(screen.getByText("Ana")).toBeDefined();
		expect(screen.getByText("Grandmaster")).toBeDefined();
		expect(screen.getByText(/2m 34s/i)).toBeDefined();
		expect(screen.getByText(/2 scenarios/i)).toBeDefined();
		expect(screen.getByRole("link", { name: /start scenario/i })).toBeDefined();
	});
});
