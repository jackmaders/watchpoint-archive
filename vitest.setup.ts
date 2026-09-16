import { cleanup, render } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";

// Configure global auto-mocks for core external dependencies and domain boundaries
vi.mock("@/shared/db");
vi.mock("@tanstack/react-router");
vi.mock("@tanstack/react-start");

if (typeof process !== "undefined" && typeof process.on === "function") {
	const isConnRefused = (err: unknown) => {
		const error = err as {
			code?: string;
			errors?: Array<{ code?: string }>;
			message?: string;
		};
		return (
			error?.code === "ECONNREFUSED" ||
			error?.message?.includes("ECONNREFUSED") ||
			(Array.isArray(error?.errors) &&
				error.errors.some((e) => e?.code === "ECONNREFUSED"))
		);
	};

	process.on("uncaughtException", (err: unknown) => {
		if (isConnRefused(err)) {
			return;
		}
		throw err;
	});

	process.on("unhandledRejection", (err: unknown) => {
		if (isConnRefused(err)) {
			return;
		}
		throw err;
	});
}

const failOnUnmockedFetch = (input: RequestInfo | URL) => {
	const url =
		typeof input === "string"
			? input
			: input instanceof URL
				? input.href
				: input.url;
	throw new Error(
		`Unmocked network request to "${url}". Unit tests must mock all network calls.`,
	);
};

globalThis.fetch = failOnUnmockedFetch as unknown as typeof globalThis.fetch;
if (typeof window !== "undefined") {
	window.fetch = failOnUnmockedFetch as unknown as typeof window.fetch;
}

// Warm up React reconciler, Happy-DOM document, and @testing-library DOM query engine
if (typeof window !== "undefined") {
	const { unmount } = render(React.createElement("div", null, "warmup"));
	unmount();
	cleanup();
}
