import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router");
vi.mock("../vods-page");

import { getRouteApi } from "@tanstack/react-router";
import { VodsPage } from "../vods-page";
import { VodsRouteComponent } from "../vods-route";

describe("VodsRouteComponent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(VodsPage).mockReturnValue(
			<div data-testid="mock-vods-page">Vods Page</div>,
		);
	});

	it("renders VodsPage with loader data, search params, and wires filter navigation callback", () => {
		// Arrange
		const mockNavigate = vi.fn();
		const mockLoaderData = {
			registrationEnabled: true,
			vods: [{ id: "vod_1" }],
		};
		const routeApi = getRouteApi("/vods/");
		vi.mocked(routeApi.useLoaderData).mockReturnValue(mockLoaderData);
		vi.mocked(routeApi.useSearch).mockReturnValue({ map: "King's Row" });
		vi.mocked(routeApi.useNavigate).mockReturnValue(mockNavigate);

		// Act
		render(<VodsRouteComponent />);

		// Assert
		expect(screen.getByTestId("mock-vods-page")).toBeDefined();
		expect(VodsPage).toHaveBeenCalledWith(
			expect.objectContaining({
				registrationEnabled: true,
				searchParams: { map: "King's Row" },
				vods: mockLoaderData.vods,
			}),
			undefined,
		);

		// Act: trigger onFilterChange
		const lastCallProps = vi.mocked(VodsPage).mock.calls[0]?.[0];
		lastCallProps?.onFilterChange?.({ hero: "Ana" });

		// Assert
		expect(mockNavigate).toHaveBeenCalled();
		const navigateArg = mockNavigate.mock.calls[0]?.[0];
		if (typeof navigateArg?.search === "function") {
			const merged = navigateArg.search({ map: "King's Row" });
			expect(merged).toEqual({ hero: "Ana", map: "King's Row" });
		}
	});
});
