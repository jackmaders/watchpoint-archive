import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router");
vi.mock("@/shared/lib/auth-client");
vi.mock("@/widgets/layout-main");
vi.mock("../hero-section");
vi.mock("../how-it-works-section");
vi.mock("../ui-preview-section");
vi.mock("../featured-vods-section");
vi.mock("../cta-section");

import { AppLayout } from "@/widgets/layout-main";
import type { PublishedVodItem } from "../../model/types";
import { CtaSection } from "../cta-section";
import { FeaturedVodsSection } from "../featured-vods-section";
import { HeroSection } from "../hero-section";
import { HomePage } from "../home-page";
import { HowItWorksSection } from "../how-it-works-section";
import { UiPreviewSection } from "../ui-preview-section";

describe("HomePage component", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		vi.mocked(AppLayout).mockImplementation((props) => (
			<div
				data-registration-enabled={props?.registrationEnabled}
				data-testid="mock-app-layout"
			>
				{props?.children}
			</div>
		));

		vi.mocked(HeroSection).mockImplementation((props) => (
			<div
				data-demo-vod-id={props?.demoVodId}
				data-registration-enabled={props?.registrationEnabled}
				data-testid="mock-hero-section"
			/>
		));

		vi.mocked(HowItWorksSection).mockReturnValue(
			<div data-testid="mock-how-it-works-section" />,
		);

		vi.mocked(UiPreviewSection).mockImplementation((props) => (
			<div
				data-demo-vod-id={props?.demoVodId}
				data-testid="mock-ui-preview-section"
			/>
		));

		vi.mocked(FeaturedVodsSection).mockImplementation((props) => (
			<div
				data-testid="mock-featured-vods-section"
				data-vod-count={props?.vods?.length ?? 0}
			/>
		));

		vi.mocked(CtaSection).mockImplementation((props) => (
			<div
				data-demo-vod-id={props?.demoVodId}
				data-registration-enabled={props?.registrationEnabled}
				data-testid="mock-cta-section"
			/>
		));
	});

	it("renders marketing layout and all compose sections with default props", () => {
		// Arrange & Act
		render(<HomePage />);

		// Assert
		const appLayout = screen.getByTestId("mock-app-layout");
		const heroSection = screen.getByTestId("mock-hero-section");
		const howItWorksSection = screen.getByTestId("mock-how-it-works-section");
		const uiPreviewSection = screen.getByTestId("mock-ui-preview-section");
		const featuredVodsSection = screen.getByTestId(
			"mock-featured-vods-section",
		);
		const ctaSection = screen.getByTestId("mock-cta-section");

		expect(appLayout).toBeDefined();
		expect(appLayout.getAttribute("data-registration-enabled")).toBe("true");

		expect(heroSection).toBeDefined();
		expect(heroSection.getAttribute("data-demo-vod-id")).toBe(
			"vod_local_fixture",
		);
		expect(heroSection.getAttribute("data-registration-enabled")).toBe("true");

		expect(howItWorksSection).toBeDefined();

		expect(uiPreviewSection).toBeDefined();
		expect(uiPreviewSection.getAttribute("data-demo-vod-id")).toBe(
			"vod_local_fixture",
		);

		expect(featuredVodsSection).toBeDefined();
		expect(featuredVodsSection.getAttribute("data-vod-count")).toBe("0");

		expect(ctaSection).toBeDefined();
		expect(ctaSection.getAttribute("data-demo-vod-id")).toBe(
			"vod_local_fixture",
		);
		expect(ctaSection.getAttribute("data-registration-enabled")).toBe("true");
	});

	it("passes first VOD id as demoVodId to hero, preview, and cta sections", () => {
		// Arrange
		const mockVods = [
			{
				createdAt: new Date(),
				durationSeconds: 100,
				heroName: "Ana",
				id: "vod_ana_gm",
				isPublished: true,
				mapName: "King's Row",
				rankTier: "Grandmaster",
				role: "SUPPORT" as const,
				scenarios: [{ id: "sc_1" }],
				title: "Grandmaster Ana VOD",
				youtubeVideoId: "abcde",
			},
		] satisfies PublishedVodItem[];

		// Act
		render(<HomePage vods={mockVods} />);

		// Assert
		const heroSection = screen.getByTestId("mock-hero-section");
		const uiPreviewSection = screen.getByTestId("mock-ui-preview-section");
		const featuredVodsSection = screen.getByTestId(
			"mock-featured-vods-section",
		);
		const ctaSection = screen.getByTestId("mock-cta-section");

		expect(heroSection.getAttribute("data-demo-vod-id")).toBe("vod_ana_gm");
		expect(uiPreviewSection.getAttribute("data-demo-vod-id")).toBe(
			"vod_ana_gm",
		);
		expect(featuredVodsSection.getAttribute("data-vod-count")).toBe("1");
		expect(ctaSection.getAttribute("data-demo-vod-id")).toBe("vod_ana_gm");
	});

	it("passes custom registrationEnabled prop to AppLayout, HeroSection, and CtaSection", () => {
		// Arrange & Act
		render(<HomePage registrationEnabled={false} />);

		// Assert
		const appLayout = screen.getByTestId("mock-app-layout");
		const heroSection = screen.getByTestId("mock-hero-section");
		const ctaSection = screen.getByTestId("mock-cta-section");

		expect(appLayout.getAttribute("data-registration-enabled")).toBe("false");
		expect(heroSection.getAttribute("data-registration-enabled")).toBe("false");
		expect(ctaSection.getAttribute("data-registration-enabled")).toBe("false");
	});
});
