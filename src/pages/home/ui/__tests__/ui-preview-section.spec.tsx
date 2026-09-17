import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UiPreviewSection } from "../ui-preview-section";

vi.mock("@tanstack/react-router");

describe("UiPreviewSection", () => {
	it("renders decision interface screenshot and Try It Now CTA without eyebrow", () => {
		// Arrange
		render(<UiPreviewSection />);

		// Act
		const heading = screen.getByRole("heading", {
			name: /train in high-pressure match moments/i,
		});
		const screenshotImage = screen.getByRole("img", {
			name: /interactive decision interface screenshot/i,
		});
		const tryItNowLink = screen.getByRole("link", {
			name: /try it now/i,
		});

		// Assert
		expect(heading).toBeDefined();
		expect(screen.queryByText(/interactive decision engine/i)).toBeNull();
		expect(screenshotImage).toBeDefined();
		expect(screenshotImage.getAttribute("src")).toBe(
			"/images/decision-interface-preview.png",
		);
		expect(tryItNowLink).toBeDefined();
		expect(tryItNowLink.getAttribute("href")).toBe("/demo");
	});

	it("renders Try It Now CTA navigating to /demo when demoVodId prop is provided", () => {
		// Arrange & Act
		render(<UiPreviewSection demoVodId="vod_custom_demo" />);

		// Assert
		const tryItNowLink = screen.getByRole("link", { name: /try it now/i });
		expect(tryItNowLink.getAttribute("href")).toBe("/demo");
	});
});
