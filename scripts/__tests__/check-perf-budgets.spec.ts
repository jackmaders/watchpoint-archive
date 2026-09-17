import http from "node:http";
import type { AddressInfo } from "node:net";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import {
	calculateMedianMetric,
	isDirectCliExecution,
	isServerReachable,
	type RouteAuditRunMetrics,
	type RouteAuditSummary,
	summarizeRouteMetrics,
} from "../check-perf-budgets";

describe("Performance Budget Audit Summary and Median Calculations", () => {
	it("calculates the median metric correctly for odd and even number of samples", () => {
		// Arrange
		const oddSamples = [2100, 2500, 2300];
		const evenSamples = [100, 200, 300, 400];

		// Act
		const medianOdd = calculateMedianMetric(oddSamples);
		const medianEven = calculateMedianMetric(evenSamples);

		// Assert
		expect(medianOdd).toBe(2300);
		expect(medianEven).toBe(250);
	});

	it("handles decimal precision metrics like CLS accurately", () => {
		// Arrange
		const clsSamples = [0.05, 0.08, 0.02];

		// Act
		const medianCls = calculateMedianMetric(clsSamples);

		// Assert
		expect(medianCls).toBe(0.05);
	});

	it("summarizes multi-pass run metrics into route audit summary evaluated against budgets", () => {
		// Arrange
		const runs: RouteAuditRunMetrics[] = [
			{ cls: 0.02, fcp: 1200, inp: 50, lcp: 2100, tbt: 80 },
			{ cls: 0.04, fcp: 1400, inp: 60, lcp: 2300, tbt: 100 },
			{ cls: 0.03, fcp: 1300, inp: 55, lcp: 2200, tbt: 90 },
		];

		// Act
		const summary: RouteAuditSummary = summarizeRouteMetrics({
			accessState: "public",
			exceptions: [],
			route: "/vods/",
			runs,
		});

		// Assert
		expect(summary.route).toBe("/vods/");
		expect(summary.accessState).toBe("public");
		expect(summary.passed).toBe(true);
		expect(summary.medianMetrics).toEqual({
			cls: 0.03,
			fcp: 1300,
			inp: 55,
			lcp: 2200,
			tbt: 90,
		});
		expect(summary.evaluations).toHaveLength(5);
		expect(summary.evaluations.every((e) => e.passed)).toBe(true);
	});

	it("marks summary as failed when any metric exceeds its budget threshold", () => {
		// Arrange
		const runs: RouteAuditRunMetrics[] = [
			{ cls: 0.02, fcp: 1200, inp: 50, lcp: 2800, tbt: 80 },
			{ cls: 0.04, fcp: 1400, inp: 60, lcp: 3000, tbt: 100 },
			{ cls: 0.03, fcp: 1300, inp: 55, lcp: 2900, tbt: 90 },
		];

		// Act
		const summary = summarizeRouteMetrics({
			accessState: "public",
			exceptions: [],
			route: "/vods/",
			runs,
		});

		// Assert
		expect(summary.passed).toBe(false);
		const lcpEval = summary.evaluations.find((e) => e.metric === "lcp");
		expect(lcpEval?.passed).toBe(false);
		expect(lcpEval?.value).toBe(2900);
	});
});

describe("isDirectCliExecution", () => {
	it("returns false in test environments when VITEST or NODE_ENV=test is set", () => {
		// Arrange
		const vitestEnv = { VITEST: "true" };
		const nodeEnvTest = { NODE_ENV: "test" };

		// Act
		const isVitest = isDirectCliExecution(
			true,
			"file:///script.ts",
			"/script.ts",
			vitestEnv,
		);
		const isNodeTest = isDirectCliExecution(
			true,
			"file:///script.ts",
			"/script.ts",
			nodeEnvTest,
		);

		// Assert
		expect(isVitest).toBe(false);
		expect(isNodeTest).toBe(false);
	});

	it("returns true when metaMain is truthy in non-test environments", () => {
		// Arrange
		const cleanEnv = {};

		// Act
		const isDirect = isDirectCliExecution(
			true,
			"file:///script.ts",
			undefined,
			cleanEnv,
		);

		// Assert
		expect(isDirect).toBe(true);
	});

	it("returns true when argv1 maps to metaUrl in non-test environments", () => {
		// Arrange
		const cleanEnv = {};
		const filePath = "/home/user/watchpoint/scripts/check-perf-budgets.ts";
		const fileUrl = pathToFileURL(filePath).href;

		// Act
		const isDirect = isDirectCliExecution(false, fileUrl, filePath, cleanEnv);

		// Assert
		expect(isDirect).toBe(true);
	});

	it("returns false when argv1 does not match metaUrl or is missing", () => {
		// Arrange
		const cleanEnv = {};

		// Act
		const mismatch = isDirectCliExecution(
			false,
			"file:///home/user/watchpoint/scripts/check-perf-budgets.ts",
			"/home/user/watchpoint/scripts/other.ts",
			cleanEnv,
		);
		const missingArgv = isDirectCliExecution(
			false,
			"file:///home/user/watchpoint/scripts/check-perf-budgets.ts",
			undefined,
			cleanEnv,
		);

		// Assert
		expect(mismatch).toBe(false);
		expect(missingArgv).toBe(false);
	});
});

describe("isServerReachable", () => {
	it("returns false cleanly without throwing or unhandled errors when connection is refused", async () => {
		// Arrange
		const unreachableUrl = "http://127.0.0.1:59999";

		// Act
		const reachable = await isServerReachable(unreachableUrl);

		// Assert
		expect(reachable).toBe(false);
	});

	it("returns false cleanly for invalid or malformed URLs", async () => {
		// Arrange
		const invalidUrl = "not-a-valid-url";

		// Act
		const reachable = await isServerReachable(invalidUrl);

		// Assert
		expect(reachable).toBe(false);
	});

	it("returns true when a server responds with 200 OK", async () => {
		// Arrange
		const server = http.createServer((_req, res) => {
			res.writeHead(200, { "Content-Type": "text/plain" });
			res.end("OK");
		});

		await new Promise<void>((resolve) => {
			server.listen(0, "127.0.0.1", () => resolve());
		});

		const port = (server.address() as AddressInfo).port;
		const targetUrl = `http://127.0.0.1:${port}`;

		try {
			// Act
			const reachable = await isServerReachable(targetUrl);

			// Assert
			expect(reachable).toBe(true);
		} finally {
			await new Promise<void>((resolve) => {
				server.close(() => resolve());
			});
		}
	});

	it("returns false when a server responds with 500 error status", async () => {
		// Arrange
		const server = http.createServer((_req, res) => {
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("Internal Server Error");
		});

		await new Promise<void>((resolve) => {
			server.listen(0, "127.0.0.1", () => resolve());
		});

		const port = (server.address() as AddressInfo).port;
		const targetUrl = `http://127.0.0.1:${port}`;

		try {
			// Act
			const reachable = await isServerReachable(targetUrl);

			// Assert
			expect(reachable).toBe(false);
		} finally {
			await new Promise<void>((resolve) => {
				server.close(() => resolve());
			});
		}
	});
});
