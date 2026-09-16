/**
 * Unit test suite verifying data loaders and query options for the public demo playthrough page.
 *
 * Tests `loadDemoPage` and `demoPageQueryOptions` ensuring registration status resolution
 * and deterministic delivery of the curated interactive demo manifest fixture.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/shared/lib/auth");

import { getRegistrationStatus } from "@/shared/lib/auth";
import { DEMO_VOD_MANIFEST } from "../../model/fixtures";
import { demoPageQueryOptions, loadDemoPage } from "../loaders";

describe("demo loaders", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("loadDemoPage", () => {
		it("loads registration status and curated demo vod manifest", async () => {
			// Arrange
			vi.mocked(getRegistrationStatus).mockResolvedValueOnce(true);

			// Act
			const result = await loadDemoPage();

			// Assert
			expect(getRegistrationStatus).toHaveBeenCalled();
			expect(result).toEqual({
				registrationEnabled: true,
				vod: DEMO_VOD_MANIFEST,
			});
		});

		it("falls back to registrationEnabled: true when getRegistrationStatus fails", async () => {
			// Arrange
			vi.mocked(getRegistrationStatus).mockRejectedValueOnce(
				new Error("Network error"),
			);

			// Act
			const result = await loadDemoPage();

			// Assert
			expect(result).toEqual({
				registrationEnabled: true,
				vod: DEMO_VOD_MANIFEST,
			});
		});
	});

	describe("demoPageQueryOptions", () => {
		it("returns query options with demo queryKey and queryFn", async () => {
			// Arrange
			vi.mocked(getRegistrationStatus).mockResolvedValueOnce(false);
			const options = demoPageQueryOptions();

			// Act
			const result = await options.queryFn?.({} as never);

			// Assert
			expect(options.queryKey).toContain("demo");
			expect(result).toEqual({
				registrationEnabled: false,
				vod: DEMO_VOD_MANIFEST,
			});
		});

		it("falls back to registrationEnabled: true in queryFn when getRegistrationStatus fails", async () => {
			// Arrange
			vi.mocked(getRegistrationStatus).mockRejectedValueOnce(
				new Error("Network error"),
			);
			const options = demoPageQueryOptions();

			// Act
			const result = await options.queryFn?.({} as never);

			// Assert
			expect(result).toEqual({
				registrationEnabled: true,
				vod: DEMO_VOD_MANIFEST,
			});
		});
	});
});
