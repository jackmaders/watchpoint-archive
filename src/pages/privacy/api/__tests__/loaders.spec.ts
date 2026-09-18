import type { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-start");
vi.mock("@/shared/auth/index.server");

import { queryKeys } from "@/shared/api";
import { isRegistrationOpen } from "@/shared/auth/index.server";
import {
	fetchPrivacyPage,
	loadPrivacyPage,
	privacyPageQueryOptions,
} from "../loaders";

describe("privacy loaders", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("fetchPrivacyPage", () => {
		it("fetches registration status for privacy page", async () => {
			// Arrange
			vi.mocked(isRegistrationOpen).mockResolvedValueOnce(true);

			// Act
			const result = await (
				fetchPrivacyPage as unknown as () => Promise<{
					registrationEnabled: boolean;
				}>
			)();

			// Assert
			expect(isRegistrationOpen).toHaveBeenCalled();
			expect(result).toEqual({
				registrationEnabled: true,
			});
		});
	});

	describe("privacyPageQueryOptions", () => {
		it("returns query options with canonical privacy queryKey and fetcher", async () => {
			// Arrange
			vi.mocked(isRegistrationOpen).mockResolvedValueOnce(false);

			// Act
			const options = privacyPageQueryOptions();
			const result = await (options.queryFn as () => Promise<unknown>)();

			// Assert
			expect(options.queryKey).toEqual(queryKeys.privacy);
			expect(result).toEqual({ registrationEnabled: false });
		});
	});

	describe("loadPrivacyPage", () => {
		it("warms query cache with staleTime static", async () => {
			// Arrange
			const mockQueryClient = {
				query: vi.fn().mockResolvedValueOnce({
					registrationEnabled: true,
				}),
			} as unknown as QueryClient;

			// Act
			await loadPrivacyPage({ context: { queryClient: mockQueryClient } });

			// Assert
			expect(mockQueryClient.query).toHaveBeenCalledWith(
				expect.objectContaining({
					queryKey: queryKeys.privacy,
					staleTime: "static",
				}),
			);
		});
	});
});
