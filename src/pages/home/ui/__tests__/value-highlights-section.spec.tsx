import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ValueHighlightsSection } from "../value-highlights-section";

describe("ValueHighlightsSection", () => {
	it("renders competitive advantage highlights", () => {
		// Arrange
		render(<ValueHighlightsSection />);

		// Act
		const heading = screen.getByRole("heading", {
			name: /engineered for serious competitors/i,
		});

		// Assert
		expect(heading).toBeDefined();
		expect(screen.getByText("Targeted Role Scenarios")).toBeDefined();
		expect(screen.getByText("Sub-Second Tactical Drills")).toBeDefined();
		expect(screen.getByText("Objective Performance Metrics")).toBeDefined();
		expect(screen.getByText("Map & Meta Versatility")).toBeDefined();
	});
});
