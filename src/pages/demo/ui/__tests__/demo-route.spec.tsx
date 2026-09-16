import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-query");
vi.mock("../demo-page");

import { useSuspenseQuery } from "@tanstack/react-query";
import { DEMO_VOD_MANIFEST } from "../../model/fixtures";
import { DemoPage } from "../demo-page";
import { DemoRouteComponent } from "../demo-route";

describe("DemoRouteComponent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(DemoPage).mockReturnValue(
			<div data-testid="mock-demo-page">Demo Page</div>,
		);
	});

	it("renders DemoPage with query data from useSuspenseQuery", () => {
		// Arrange
		const mockQueryData = {
			registrationEnabled: true,
			vod: DEMO_VOD_MANIFEST,
		};
		vi.mocked(useSuspenseQuery).mockReturnValue({
			data: mockQueryData,
		} as never);

		// Act
		render(<DemoRouteComponent />);

		// Assert
		expect(screen.getByTestId("mock-demo-page")).toBeDefined();
		expect(DemoPage).toHaveBeenCalledWith(
			{
				registrationEnabled: true,
				vod: mockQueryData.vod,
			},
			undefined,
		);
	});
});
