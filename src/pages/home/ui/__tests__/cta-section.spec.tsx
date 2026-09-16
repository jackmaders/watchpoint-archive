import { useNavigate } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authClient } from "@/shared/lib/auth-client";
import { CtaSection } from "../cta-section";

vi.mock("@tanstack/react-router");
vi.mock("@/shared/lib/auth-client");

describe("CtaSection", () => {
	const navigate = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useNavigate).mockReturnValue(navigate);
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
		} as never);
	});

	it("renders conversion headline and dual CTAs (Start Training and Try It Now)", () => {
		// Arrange
		render(<CtaSection />);

		// Act
		const heading = screen.getByRole("heading", {
			name: /ready to level up your game sense\?/i,
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
		expect(tryItNowLink.getAttribute("href")).toBe("/vods/vod_local_fixture");
	});

	it("opens auth modal when unauthenticated player clicks Start Training and navigates on success", async () => {
		// Arrange
		render(<CtaSection />);

		// Act
		fireEvent.click(screen.getByRole("link", { name: /start training/i }));

		// Assert modal opened
		expect(screen.getByRole("dialog")).toBeDefined();
		expect(
			screen.getByRole("heading", { name: "Welcome back, player" }),
		).toBeDefined();

		// Submit form to trigger handleAuthenticated
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "player@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});
		fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

		await waitFor(() => {
			expect(navigate).toHaveBeenCalledWith({ to: "/vods" });
		});
	});

	it("renders Try It Now with custom demoVodId when passed", () => {
		// Arrange & Act
		render(<CtaSection demoVodId="vod_custom_demo" />);

		// Assert
		const tryItNowLink = screen.getByRole("link", { name: /try it now/i });
		expect(tryItNowLink.getAttribute("href")).toBe("/vods/vod_custom_demo");
	});
});
