import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DEMO_VOD_MANIFEST } from "../../model/fixtures";
import { DemoPage } from "../demo-page";

vi.mock("@/widgets/layout-main");
vi.mock("@/widgets/session-player");

import { AppLayout } from "@/widgets/layout-main";
import { SessionPlayerClient } from "@/widgets/session-player";

describe("DemoPage", () => {
	it("renders SessionPlayerClient with isDemo, autoplay false, and demo vod manifest wrapped in AppLayout", () => {
		// Arrange
		vi.mocked(AppLayout).mockImplementation((props) => (
			<div
				data-registration-enabled={props?.registrationEnabled}
				data-testid="mock-app-layout"
			>
				{props?.children}
			</div>
		));
		vi.mocked(SessionPlayerClient).mockReturnValue(
			<div data-testid="demo-player-client">Mock Session Player</div>,
		);

		// Act
		render(<DemoPage registrationEnabled={true} vod={DEMO_VOD_MANIFEST} />);

		// Assert
		expect(screen.getByTestId("mock-app-layout")).toBeDefined();
		expect(screen.getByTestId("demo-player-client")).toBeDefined();
		expect(SessionPlayerClient).toHaveBeenCalledWith(
			expect.objectContaining({
				autoplay: false,
				isDemo: true,
				playthroughId: null,
				registrationEnabled: true,
				vod: DEMO_VOD_MANIFEST,
			}),
			undefined,
		);
	});
});
