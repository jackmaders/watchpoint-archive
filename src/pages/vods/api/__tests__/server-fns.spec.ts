import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDbClient, queryVods } from "@/shared/db/index.server";
import { getPublishedVods } from "../server-fns";

vi.mock("@tanstack/react-start");
vi.mock("@/shared/db/index.server");

describe("vods server-fns", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(createDbClient).mockReturnValue({} as never);
	});

	it("executes getPublishedVods handler correctly without filters", async () => {
		// Arrange
		const mockVods = [
			{ id: "vod_1", title: "VOD 1" },
			{ id: "vod_2", title: "VOD 2" },
		] as never;
		vi.mocked(queryVods).mockResolvedValueOnce(mockVods);

		// Act
		const result = await (
			getPublishedVods as unknown as (arg?: {
				data?: unknown;
			}) => Promise<unknown>
		)({ data: {} });

		// Assert
		expect(queryVods).toHaveBeenCalledWith(
			{
				filter: { isPublished: { eq: true } },
				order: { createdAt: "desc" },
			},
			expect.anything(),
		);
		expect(result).toEqual(mockVods);
	});

	it("filters by map, hero, and levelOfPlay via queryVods filter", async () => {
		// Arrange
		const mockVods = [
			{
				heroName: "Ana",
				id: "vod_1",
				mapName: "King's Row",
				rankTier: "Grandmaster",
				title: "Grandmaster Ana King's Row",
			},
		] as never;
		vi.mocked(queryVods).mockResolvedValueOnce(mockVods);

		// Act
		const result = await (
			getPublishedVods as unknown as (arg?: {
				data?: unknown;
			}) => Promise<unknown>
		)({
			data: {
				hero: "Ana",
				levelOfPlay: "Grandmaster",
				map: "King's Row",
			},
		});

		// Assert
		expect(queryVods).toHaveBeenCalledWith(
			{
				filter: {
					heroName: { eq: "Ana" },
					isPublished: { eq: true },
					mapName: { eq: "King's Row" },
					rankTier: { eq: "Grandmaster" },
				},
				order: { createdAt: "desc" },
			},
			expect.anything(),
		);
		expect(result).toEqual(mockVods);
	});

	it("filters by player in title", async () => {
		// Arrange
		const mockVods = [
			{
				heroName: "Tracer",
				id: "vod_1",
				mapName: "Circuit Royal",
				rankTier: "Top 500",
				title: "Proper Tracer Dominating Ranked",
			},
			{
				heroName: "Tracer",
				id: "vod_2",
				mapName: "Circuit Royal",
				rankTier: "Top 500",
				title: "Viol2t Support VOD",
			},
		] as never;
		vi.mocked(queryVods).mockResolvedValueOnce(mockVods);

		// Act
		const result = await (
			getPublishedVods as unknown as (arg?: {
				data?: unknown;
			}) => Promise<unknown>
		)({
			data: {
				player: "Proper",
			},
		});

		// Assert
		expect(result).toEqual([mockVods[0]]);
	});

	it("handles undefined data gracefully by returning all published vods", async () => {
		// Arrange
		const mockVods = [{ id: "vod_1", title: "VOD 1" }] as never;
		vi.mocked(queryVods).mockResolvedValueOnce(mockVods);

		// Act
		const result = await (
			getPublishedVods as unknown as (arg?: {
				data?: unknown;
			}) => Promise<unknown>
		)();

		// Assert
		expect(queryVods).toHaveBeenCalledWith(
			{
				filter: { isPublished: { eq: true } },
				order: { createdAt: "desc" },
			},
			expect.anything(),
		);
		expect(result).toEqual(mockVods);
	});

	it("falls back to empty filter when validator receives invalid data", async () => {
		// Arrange
		const mockVods = [{ id: "vod_1", title: "VOD 1" }] as never;
		vi.mocked(queryVods).mockResolvedValueOnce(mockVods);

		// Act - provide map as a number which fails z.string().optional() validation
		const result = await (
			getPublishedVods as unknown as (arg?: {
				data?: unknown;
			}) => Promise<unknown>
		)({
			data: { map: 12345 },
		});

		// Assert
		expect(queryVods).toHaveBeenCalledWith(
			{
				filter: { isPublished: { eq: true } },
				order: { createdAt: "desc" },
			},
			expect.anything(),
		);
		expect(result).toEqual(mockVods);
	});

	it("throws error when queryVods fails", async () => {
		// Arrange
		vi.mocked(queryVods).mockRejectedValueOnce(
			new Error("Failed to query VODs"),
		);

		// Act & Assert
		await expect(
			(
				getPublishedVods as unknown as (arg?: {
					data?: unknown;
				}) => Promise<unknown>
			)({
				data: {},
			}),
		).rejects.toThrow("Failed to query VODs");
	});
});
