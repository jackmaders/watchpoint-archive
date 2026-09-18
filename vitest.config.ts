import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: { tsconfigPaths: true },
	test: {
		clearMocks: true,
		coverage: {
			exclude: [
				"**/__mocks__/**",
				"**/__tests__/**",
				"**/__stories__/**",
				"src/shared/db/schema",
			],
			include: ["src/**/*.{ts,tsx}"],
			thresholds: {
				branches: 100,
				functions: 100,
				lines: 100,
				statements: 100,
			},
		},
		environment: "happy-dom",
		globals: true,
		include: ["**/*.spec.{ts,tsx}"],
		setupFiles: ["./vitest/setup.ts"],
		testTimeout: process.env.CI ? 500 : 1500,
	},
});
