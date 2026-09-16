import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DEMO_VOD_MANIFEST } from "../../model/fixtures";
import { DemoPage } from "../demo-page";

vi.mock("@/widgets/session-player");

import { SessionPlayerClient } from "@/widgets/session-player";

describe("DemoPage", () => {
	it("renders SessionPlayerClient with isDemo and demo vod manifest", () => {
		// Arrange
		vi.mocked(SessionPlayerClient).mockReturnValue(
			<div data-testid="demo-player-client">Mock Session Player</div>,
		);

		// Act
		render(<DemoPage registrationEnabled={true} vod={DEMO_VOD_MANIFEST} />);

		// Assert
		expect(screen.getByTestId("demo-player-client")).toBeDefined();
		expect(SessionPlayerClient).toHaveBeenCalledWith(
			expect.objectContaining({
				isDemo: true,
				playthroughId: null,
				registrationEnabled: true,
				vod: DEMO_VOD_MANIFEST,
			}),
			undefined,
		);
	});
});
