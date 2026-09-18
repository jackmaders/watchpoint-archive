import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/widgets/session-player");

import { SessionPlayerPage } from "@/widgets/session-player";
import { SessionPlayerRouteView } from "../session-player-route-view";

describe("SessionPlayerRouteView", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(SessionPlayerPage).mockReturnValue(
			<div data-testid="mock-session-player-page">Session Player Page</div>,
		);
	});

	it("renders SessionPlayerPage by default", () => {
		// Arrange
		const mockNavigate = vi.fn();
		const mockVod = { id: "vod_1" } as never;

		// Act
		render(
			<SessionPlayerRouteView
				onNavigateSearch={mockNavigate}
				playthroughId="pt_1"
				scenarioSnapshotIds={["s1"]}
				search={{}}
				vod={mockVod}
				vodId="vod_1"
			/>,
		);

		// Assert
		expect(screen.getByTestId("mock-session-player-page")).toBeDefined();
		expect(SessionPlayerPage).toHaveBeenCalledWith(
			{
				params: { id: "vod_1" },
				playthroughId: "pt_1",
				scenarioSnapshotIds: ["s1"],
				searchParams: {
					modules: undefined,
				},
				vod: mockVod,
			},
			undefined,
		);
	});

	it("passes modules and handles omitted search parameter", () => {
		// Arrange
		const mockNavigate = vi.fn();
		const mockVod = { id: "vod_1" } as never;

		// Act
		render(
			<SessionPlayerRouteView
				onNavigateSearch={mockNavigate}
				playthroughId="pt_1"
				scenarioSnapshotIds={["s1"]}
				search={{ modules: "AIM" }}
				vod={mockVod}
				vodId="vod_1"
			/>,
		);

		// Assert
		expect(SessionPlayerPage).toHaveBeenCalledWith(
			expect.objectContaining({
				searchParams: {
					modules: "AIM",
				},
			}),
			undefined,
		);

		// Act: test with search completely undefined
		render(
			<SessionPlayerRouteView
				onNavigateSearch={mockNavigate}
				playthroughId={null}
				scenarioSnapshotIds={[]}
				vod={null}
				vodId="vod_2"
			/>,
		);

		// Assert
		expect(SessionPlayerPage).toHaveBeenCalledWith(
			expect.objectContaining({
				searchParams: {
					modules: undefined,
				},
			}),
			undefined,
		);
	});
});
