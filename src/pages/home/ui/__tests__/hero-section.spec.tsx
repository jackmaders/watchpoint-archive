import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HeroSection } from "../hero-section";

vi.mock("@tanstack/react-router");

describe("HeroSection", () => {
	it("renders benefit-driven headlines and call to action links", () => {
		// Arrange
		render(<HeroSection />);

		// Act
		const heading = screen.getByRole("heading", {
			name: /master game sense/i,
		});
		const startTrainingLink = screen.getByRole("link", {
			name: /start training/i,
		});
		const tryItNowLink = screen.getByRole("link", {
			name: /try it now/i,
		});

		// Assert
		expect(heading).toBeDefined();
		expect(startTrainingLink).toBeDefined();
		expect(tryItNowLink).toBeDefined();
		expect(screen.getByText(/authentic top 500 vods/i)).toBeDefined();
		expect(screen.getByText(/real-time decision drills/i)).toBeDefined();
		expect(screen.getByText(/instant tactical feedback/i)).toBeDefined();
	});
});
