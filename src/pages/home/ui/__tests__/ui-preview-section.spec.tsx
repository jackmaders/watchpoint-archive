import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UiPreviewSection } from "../ui-preview-section";

vi.mock("@tanstack/react-router");

describe("UiPreviewSection", () => {
	it("renders high-fidelity decision player interface mockup and Try It Now CTA", () => {
		// Arrange
		render(<UiPreviewSection />);

		// Act
		const heading = screen.getByRole("heading", {
			name: /train in high-pressure match moments/i,
		});
		const tryItNowLink = screen.getByRole("link", {
			name: /try it now/i,
		});

		// Assert
		expect(heading).toBeDefined();
		expect(screen.getByText(/interactive decision engine/i)).toBeDefined();
		expect(screen.getByText(/decision point/i)).toBeDefined();
		expect(
			screen.getByText(
				/the enemy winston dives your co-support with barrier shield/i,
			),
		).toBeDefined();
		expect(
			screen.getByText(/save biotic grenade to counter dive commitment/i),
		).toBeDefined();
		expect(tryItNowLink).toBeDefined();
		expect(tryItNowLink.getAttribute("href")).toBe("/vods/vod_local_fixture");
	});

	it("renders Try It Now CTA with custom demoVodId when provided", () => {
		// Arrange & Act
		render(<UiPreviewSection demoVodId="vod_custom_demo" />);

		// Assert
		const tryItNowLink = screen.getByRole("link", { name: /try it now/i });
		expect(tryItNowLink.getAttribute("href")).toBe("/vods/vod_custom_demo");
	});
});
