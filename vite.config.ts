import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

const ANALYZE = process.env.ANALYZE;

export default defineConfig({
	plugins: [
		cloudflare({
			viteEnvironment: { name: "ssr" },
		}),
		tailwindcss(),
		tanstackStart({
			srcDirectory: "src/app",
		}),
		viteReact(),
		...(ANALYZE ? [visualizer()] : []),
	],
	resolve: {
		tsconfigPaths: true,
	},
});
