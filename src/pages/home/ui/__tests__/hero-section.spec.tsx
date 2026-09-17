import { useNavigate } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authClient } from "@/shared/lib/auth-client";
import { HeroSection } from "../hero-section";

vi.mock("@tanstack/react-router");
vi.mock("@/shared/lib/auth-client");

describe("HeroSection", () => {
	const navigate = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useNavigate).mockReturnValue(navigate);
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
		} as never);
	});

	it("renders non-duplicated Title, Subheading, and dual CTAs without tags below buttons", () => {
		// Arrange
		render(<HeroSection />);

		// Act
		const heading = screen.getByRole("heading", {
			name: /improve your decision making\.\s*win more games\./i,
		});
		const startTrainingLink = screen.getByRole("link", {
			name: /start training/i,
		});
		const tryItNowLink = screen.getByRole("link", {
			name: /try it now/i,
		});

		// Assert
		expect(heading).toBeDefined();
		expect(
			screen.getByText(
				/structured practice to help you climb\. test your awareness and get instant feedback\./i,
			),
		).toBeDefined();
		expect(startTrainingLink).toBeDefined();
		expect(tryItNowLink).toBeDefined();
		expect(tryItNowLink.getAttribute("href")).toBe("/demo");
		expect(
			screen.queryByText(/overwatch 2 tactical decision training/i),
		).toBeNull();
		expect(screen.queryByText(/refine your decision-making/i)).toBeNull();
		expect(screen.queryByText(/authentic top 500 vods/i)).toBeNull();
		expect(screen.queryByText(/real-time decision drills/i)).toBeNull();
		expect(screen.queryByText(/instant tactical feedback/i)).toBeNull();
	});

	it("opens auth modal when unauthenticated player clicks Start Training and navigates on success", async () => {
		// Arrange
		render(<HeroSection />);

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

	it("allows direct navigation when authenticated player clicks Start Training without opening modal", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: { user: { id: "user_1", name: "Player" } },
			isPending: false,
		} as never);
		render(<HeroSection />);

		// Act
		fireEvent.click(screen.getByRole("link", { name: /start training/i }));

		// Assert
		expect(screen.queryByRole("dialog")).toBeNull();
	});
});
