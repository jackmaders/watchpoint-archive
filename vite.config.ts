import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		cloudflare(),
		tanstackStart({ srcDirectory: "src/app" }),
		tailwindcss(),
		viteReact(),
		...(process.env.ANALYSE ? [visualizer()] : []),
	],
	resolve: { tsconfigPaths: true },
});
