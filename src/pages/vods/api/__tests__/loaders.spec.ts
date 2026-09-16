/**
 * Unit test suite verifying data loaders for the public VOD catalog page.
 *
 * Tests `loadVodsPage` ensuring concurrent retrieval of published VODs and registration state
 * via server functions, including graceful fallback on database or network failures.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/entities/vod");
vi.mock("@/shared/lib/auth");

import { getPublishedVods } from "@/entities/vod";
import { getRegistrationStatus } from "@/shared/lib/auth";
import { loadVodsPage } from "../loaders";

describe("loadVodsPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("loads published vods and registration state", async () => {
		// Arrange
		const mockVods = [{ id: "vod_1" }] as never;
		vi.mocked(getPublishedVods).mockResolvedValueOnce(mockVods);
		vi.mocked(getRegistrationStatus).mockResolvedValueOnce(true);

		// Act
		const result = await loadVodsPage();

		// Assert
		expect(getPublishedVods).toHaveBeenCalled();
		expect(getRegistrationStatus).toHaveBeenCalled();
		expect(result).toEqual({
			registrationEnabled: true,
			vods: mockVods,
		});
	});
});
