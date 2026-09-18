import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"cloudflare:workers": new URL(
				"./src/shared/db/__mocks__/cloudflare-workers.ts",
				import.meta.url,
			).pathname,
		},
		tsconfigPaths: true,
	},
	test: {
		clearMocks: true,
		coverage: {
			exclude: [
				"**/__mocks__/**",
				"**/__stories__/**",
				"**/*.d.ts",
				"src/**/*.stories.{ts,tsx}",
				"src/**/*.{spec,test}.{ts,tsx}",
				"src/**/index.ts",
				"src/**/index.client.ts",
				"src/**/index.server.ts",
				"src/shared/test-fixtures/**",
				"src/app/**",
				"src/shared/db/**/schema.ts",
				"src/shared/db/schema/**",
				"src/**/types.ts",
			],
			include: ["src/**/*.{ts,tsx}"],
			reporter: ["text-summary"],
			thresholds: {
				branches: 100,
				functions: 100,
				lines: 100,
				statements: 100,
			},
		},
		environment: "happy-dom",
		exclude: [
			"e2e/**",
			"node_modules/**",
			".output/**",
			".nitro/**",
			".vinxi/**",
			".next/**",
			".wrangler/**",
			".claude/**",
			".agents/**",
			"dist/**",
			"generated/**",
		],
		globals: true,
		include: ["**/*.spec.{ts,tsx}"],
		maxWorkers: process.env.CI ? 2 : 8,
		reporters: ["minimal"],
		setupFiles: ["./vitest.setup.ts"],
		testTimeout: process.env.CI ? 500 : 1500,
	},
});
