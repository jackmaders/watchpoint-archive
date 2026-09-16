import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CtaSection } from "../cta-section";

vi.mock("@tanstack/react-router");

describe("CtaSection", () => {
	it("renders conversion headline and training catalog link", () => {
		// Arrange
		render(<CtaSection />);

		// Act
		const heading = screen.getByRole("heading", {
			name: /ready to level up your game sense\?/i,
		});
		const catalogLink = screen.getByRole("link", {
			name: /explore training catalog/i,
		});
		const demoLink = screen.getByRole("link", {
			name: /try interactive demo/i,
		});

		// Assert
		expect(heading).toBeDefined();
		expect(catalogLink).toBeDefined();
		expect(demoLink).toBeDefined();
	});
});
