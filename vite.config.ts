import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tanstackStart({ srcDirectory: "src/app" }),
		viteReact(),
		tailwindcss(),
		...(process.env.ANALYSE ? [visualizer()] : []),
	],
	resolve: { tsconfigPaths: true },
});
