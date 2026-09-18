import {
	createFileRoute,
	getRouteApi,
	useNavigate,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { describe, expect, it, vi } from "vitest";
import {
	createDbClient,
	getVodById,
	queryUsers,
} from "@/shared/db/index.server";

describe("Global Test Mocks Setup", () => {
	it("provides auto-mocked @tanstack/react-router exports without manual vi.mock declaration", () => {
		// Arrange & Act
		const navigate = useNavigate();
		const routeApi = getRouteApi("/");

		// Assert
		expect(vi.isMockFunction(useNavigate)).toBe(true);
		expect(typeof navigate).toBe("function");
		expect(vi.isMockFunction(createFileRoute)).toBe(true);
		expect(vi.isMockFunction(getRouteApi)).toBe(true);
		expect(vi.isMockFunction(routeApi.useLoaderData)).toBe(true);
	});

	it("provides auto-mocked server database exports without manual vi.mock declaration", async () => {
		// Arrange
		vi.mocked(getVodById).mockResolvedValueOnce({
			id: "vod_global_mock",
		} as never);

		// Act
		const vod = await getVodById("vod_global_mock");

		// Assert
		expect(vi.isMockFunction(getVodById)).toBe(true);
		expect(vi.isMockFunction(createDbClient)).toBe(true);
		expect(vi.isMockFunction(queryUsers)).toBe(true);
		expect(vod).toEqual({ id: "vod_global_mock" });
	});

	it("provides auto-mocked @tanstack/react-start server function helpers", () => {
		// Arrange & Act
		const serverFnBuilder = createServerFn();

		// Assert
		expect(vi.isMockFunction(createServerFn)).toBe(true);
		expect(serverFnBuilder).toHaveProperty("validator");
		expect(serverFnBuilder).toHaveProperty("handler");
	});
});
