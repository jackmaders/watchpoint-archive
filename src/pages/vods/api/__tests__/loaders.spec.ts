/**
 * Unit test suite verifying data loaders and route guards for the public VOD catalog page.
 *
 * Tests `vodsBeforeLoad` and `loadVodsPage` ensuring session authentication enforcement,
 * concurrent retrieval of published VODs and registration state via server functions.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router");
vi.mock("@/entities/vod");
vi.mock("@/shared/auth");

import { redirect } from "@tanstack/react-router";
import { getPublishedVods } from "@/entities/vod";
import { getRegistrationStatus, getSessionUser } from "@/shared/auth";
import { loadVodsPage, vodsBeforeLoad } from "../loaders";

describe("vods loaders", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("vodsBeforeLoad", () => {
		it("returns active user when session is present", async () => {
			// Arrange
			const mockUser = { id: "usr_1", role: "PLAYER" as const };
			vi.mocked(getSessionUser).mockResolvedValueOnce(mockUser as never);

			// Act
			const result = await vodsBeforeLoad();

			// Assert
			expect(result).toEqual({ user: mockUser });
		});

		it("redirects to homepage when user session is null", async () => {
			// Arrange
			vi.mocked(getSessionUser).mockResolvedValueOnce(null);

			// Act & Assert
			await expect(vodsBeforeLoad()).rejects.toThrow();
			expect(redirect).toHaveBeenCalledWith({ to: "/" });
		});

		it("redirects to homepage when getSessionUser throws an error", async () => {
			// Arrange
			vi.mocked(getSessionUser).mockRejectedValueOnce(
				new Error("Session error"),
			);

			// Act & Assert
			await expect(vodsBeforeLoad()).rejects.toThrow();
			expect(redirect).toHaveBeenCalledWith({ to: "/" });
		});
	});

	describe("loadVodsPage", () => {
		it("loads published vods and registration state without filter deps", async () => {
			// Arrange
			const mockVods = [{ id: "vod_1" }] as never;
			vi.mocked(getPublishedVods).mockResolvedValueOnce(mockVods);
			vi.mocked(getRegistrationStatus).mockResolvedValueOnce(true);

			// Act
			const result = await loadVodsPage();

			// Assert
			expect(getPublishedVods).toHaveBeenCalledWith({ data: {} });
			expect(getRegistrationStatus).toHaveBeenCalled();
			expect(result).toEqual({
				registrationEnabled: true,
				vods: mockVods,
			});
		});

		it("loads published vods with search filter deps", async () => {
			// Arrange
			const mockVods = [{ id: "vod_1", mapName: "King's Row" }] as never;
			vi.mocked(getPublishedVods).mockResolvedValueOnce(mockVods);
			vi.mocked(getRegistrationStatus).mockResolvedValueOnce(true);

			// Act
			const deps = {
				hero: "Ana",
				levelOfPlay: "Grandmaster",
				map: "King's Row",
				player: "Viol2t",
			};
			const result = await loadVodsPage({ deps });

			// Assert
			expect(getPublishedVods).toHaveBeenCalledWith({ data: deps });
			expect(result).toEqual({
				registrationEnabled: true,
				vods: mockVods,
			});
		});

		it("falls back to empty array when getPublishedVods returns undefined", async () => {
			// Arrange
			vi.mocked(getPublishedVods).mockResolvedValueOnce(undefined as never);
			vi.mocked(getRegistrationStatus).mockResolvedValueOnce(false);

			// Act
			const result = await loadVodsPage();

			// Assert
			expect(result).toEqual({
				registrationEnabled: false,
				vods: [],
			});
		});
	});
});
