import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		rollupOptions: {
			external: ["cloudflare:workers"],
			onwarn(warning, defaultHandler) {
				if (
					warning.message?.includes(
						"has been externalized for browser compatibility",
					)
				) {
					return;
				}
				defaultHandler(warning);
			},
		},
	},
	plugins: [
		tanstackStart({
			srcDirectory: "src/app",
		}),
		viteReact(),
		tailwindcss(),
		visualizer({
			filename: "stats.json",
			gzipSize: true,
			template: "raw-data", // Outputs structured JSON instead of HTML
		}),
	],
	resolve: {
		tsconfigPaths: true,
	},
	server: {
		port: 3000,
	},
});
