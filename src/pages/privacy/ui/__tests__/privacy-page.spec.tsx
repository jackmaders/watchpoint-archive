import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PrivacyPage } from "../privacy-page";

vi.mock("@tanstack/react-router");
vi.mock("@/shared/lib/auth-client");

describe("PrivacyPage component", () => {
	it("renders main header and descriptive briefing", () => {
		// Arrange & Act
		render(<PrivacyPage />);

		// Assert
		expect(
			screen.getByRole("heading", { level: 1, name: "Privacy Statement" }),
		).toBeDefined();
		expect(screen.queryByText("Watchpoint / Legal & Compliance")).toBeNull();
		expect(
			screen.getByText(
				/transparency and data protection are fundamental to our platform/i,
			),
		).toBeDefined();
	});

	it("renders all six core privacy sections with clean document hierarchy", () => {
		// Arrange & Act
		render(<PrivacyPage />);

		// Assert
		expect(
			screen.getByRole("heading", {
				level: 2,
				name: /1\. Who We Are and Scope/i,
			}),
		).toBeDefined();
		expect(
			screen.getByRole("heading", {
				level: 2,
				name: /2\. Information We Collect/i,
			}),
		).toBeDefined();
		expect(
			screen.getByRole("heading", {
				level: 3,
				name: /A\. Information You Provide Directly/i,
			}),
		).toBeDefined();
		expect(
			screen.getByRole("heading", {
				level: 3,
				name: /B\. Information Collected Automatically/i,
			}),
		).toBeDefined();
		expect(
			screen.getByRole("heading", {
				level: 2,
				name: /3\. How and Why We Use Your Information/i,
			}),
		).toBeDefined();
		expect(
			screen.getByRole("heading", {
				level: 2,
				name: /4\. Data Sharing and Third Parties/i,
			}),
		).toBeDefined();
		expect(
			screen.getByRole("heading", {
				level: 2,
				name: /5\. Data Retention Policies/i,
			}),
		).toBeDefined();
		expect(
			screen.getByRole("heading", {
				level: 2,
				name: /6\. Your Data Protection Rights/i,
			}),
		).toBeDefined();
	});

	it("renders with custom registrationEnabled prop set to false", () => {
		// Arrange & Act
		render(<PrivacyPage registrationEnabled={false} />);

		// Assert
		expect(
			screen.getByRole("heading", { level: 1, name: "Privacy Statement" }),
		).toBeDefined();
	});
});
