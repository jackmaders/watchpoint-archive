import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-query");
vi.mock("../privacy-page");

import { useSuspenseQuery } from "@tanstack/react-query";
import { PrivacyPage } from "../privacy-page";
import { PrivacyRouteComponent } from "../privacy-route";

describe("PrivacyRouteComponent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(PrivacyPage).mockReturnValue(
			<div data-testid="mock-privacy-page">Privacy Page</div>,
		);
	});

	it("renders PrivacyPage with query data from useSuspenseQuery", () => {
		// Arrange
		const mockQueryData = {
			registrationEnabled: true,
		};
		vi.mocked(useSuspenseQuery).mockReturnValue({
			data: mockQueryData,
		} as never);

		// Act
		render(<PrivacyRouteComponent />);

		// Assert
		expect(screen.getByTestId("mock-privacy-page")).toBeDefined();
		expect(PrivacyPage).toHaveBeenCalledWith(
			{
				registrationEnabled: true,
			},
			undefined,
		);
	});
});
