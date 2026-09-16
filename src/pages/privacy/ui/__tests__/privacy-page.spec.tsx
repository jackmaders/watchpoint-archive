import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PrivacyPage } from "../privacy-page";

vi.mock("@tanstack/react-router");
vi.mock("@/shared/lib/auth-client");

describe("PrivacyPage component", () => {
	it("renders main header, badge, and descriptive briefing", () => {
		// Arrange & Act
		render(<PrivacyPage />);

		// Assert
		expect(
			screen.getByRole("heading", { name: "Privacy Statement" }),
		).toBeDefined();
		expect(
			screen.getByText("Watchpoint / Security & Compliance"),
		).toBeDefined();
		expect(
			screen.getByText(
				/transparent overview of our data collection practices/i,
			),
		).toBeDefined();
	});

	it("renders key highlight summary callouts", () => {
		// Arrange & Act
		render(<PrivacyPage />);

		// Assert
		expect(
			screen.getByRole("heading", { name: "Zero Ad Tracking" }),
		).toBeDefined();
		expect(
			screen.getByRole("heading", { name: "Edge-Native Isolation" }),
		).toBeDefined();
		expect(
			screen.getByRole("heading", { name: "Player Control" }),
		).toBeDefined();
	});

	it("renders all four core privacy sections", () => {
		// Arrange & Act
		render(<PrivacyPage />);

		// Assert
		expect(
			screen.getByRole("heading", {
				name: /1\. Account Identity & Authentication/i,
			}),
		).toBeDefined();
		expect(
			screen.getByRole("heading", {
				name: /2\. Training Attempt & Decision Telemetry/i,
			}),
		).toBeDefined();
		expect(
			screen.getByRole("heading", {
				name: /3\. Session State & Local Storage/i,
			}),
		).toBeDefined();
		expect(
			screen.getByRole("heading", {
				name: /4\. Data Retention & Player Rights/i,
			}),
		).toBeDefined();
	});

	it("renders with custom registrationEnabled prop set to false", () => {
		// Arrange & Act
		render(<PrivacyPage registrationEnabled={false} />);

		// Assert
		expect(
			screen.getByRole("heading", { name: "Privacy Statement" }),
		).toBeDefined();
	});
});
