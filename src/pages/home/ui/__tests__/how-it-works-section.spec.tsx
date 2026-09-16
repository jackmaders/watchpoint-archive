import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HowItWorksSection } from "../how-it-works-section";

describe("HowItWorksSection", () => {
	it("renders all four training workflow steps", () => {
		// Arrange
		render(<HowItWorksSection />);

		// Act
		const heading = screen.getByRole("heading", {
			name: /how watchpoint works/i,
		});

		// Assert
		expect(heading).toBeDefined();
		expect(screen.getByText("Curated Match Scenarios")).toBeDefined();
		expect(screen.getByText("Interactive Decision Moments")).toBeDefined();
		expect(screen.getByText("Instant Tactical Breakdown")).toBeDefined();
		expect(screen.getByText("Track Game Sense Mastery")).toBeDefined();
	});
});
