import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HowItWorksSection } from "../how-it-works-section";

describe("HowItWorksSection", () => {
	it("renders all four core learning pillars (Strategy, Tactics, Awareness, Tracking)", () => {
		// Arrange
		render(<HowItWorksSection />);

		// Act
		const heading = screen.getByRole("heading", {
			name: /how watchpoint works/i,
		});

		// Assert
		expect(heading).toBeDefined();
		expect(screen.getByText(/core learning pillars/i)).toBeDefined();

		expect(screen.getByText("Strategy")).toBeDefined();
		expect(
			screen.getByText(
				"Pre-fight positioning, win-conditions, and lose-conditions.",
			),
		).toBeDefined();

		expect(screen.getByText("Tactics")).toBeDefined();
		expect(
			screen.getByText("Mid-fight opportunities and cooldown usage."),
		).toBeDefined();

		expect(screen.getByText("Awareness")).toBeDefined();
		expect(
			screen.getByText("Spatial awareness and positional tracking."),
		).toBeDefined();

		expect(screen.getByText("Tracking")).toBeDefined();
		expect(screen.getByText("Ultimate and ability tracking.")).toBeDefined();
	});
});
