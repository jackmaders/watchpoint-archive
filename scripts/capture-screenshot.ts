import { type ChildProcess, spawn } from "node:child_process";
import { chromium } from "@playwright/test";

async function main() {
	let server: ChildProcess | null = null;
	server = spawn("bun", ["run", "build-preview"], {
		env: {
			...process.env,
			BETTER_AUTH_ALLOW_REGISTRATION: "true",
			BETTER_AUTH_SECRET: "development-secret-key-at-least-32-chars-long",
			BETTER_AUTH_URL: "http://127.0.0.1:3000",
			HOST: "127.0.0.1",
			PORT: "3000",
		},
		stdio: "ignore",
	});

	await new Promise((r) => setTimeout(r, 2000));

	const browser = await chromium.launch({ headless: true });
	const context = await browser.newContext({
		deviceScaleFactor: 2,
		viewport: { height: 900, width: 1440 },
	});

	// Mock YouTube API so that the video player initializes immediately and simulates timestamp 15s (paused at scenario)
	await context.addInitScript(() => {
		let stateChangeCb:
			| ((event: { data: number; target: unknown }) => void)
			| null = null;
		let readyCb: ((event: { target: unknown }) => void) | null = null;
		let currentTime = 15;

		(window as unknown as { YT: unknown }).YT = {
			Player: (
				element: HTMLElement,
				options: {
					events?: {
						onReady?: (event: { target: unknown }) => void;
						onStateChange?: (event: { data: number; target: unknown }) => void;
					};
				},
			) => {
				readyCb = options?.events?.onReady ?? null;
				stateChangeCb = options?.events?.onStateChange ?? null;

				const bgContainer = document.createElement("div");
				bgContainer.style.width = "100%";
				bgContainer.style.height = "100%";
				bgContainer.style.backgroundColor = "#0b0f19";
				bgContainer.style.backgroundImage =
					"radial-gradient(ellipse at center, #1e293b 0%, #0f172a 70%, #020617 100%)";
				bgContainer.style.position = "relative";
				bgContainer.style.display = "flex";
				bgContainer.style.alignItems = "center";
				bgContainer.style.justifyContent = "center";
				bgContainer.style.overflow = "hidden";

				const hud = document.createElement("div");
				hud.innerHTML = `
					<div style="position: absolute; inset: 0; opacity: 0.15; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px);"></div>
					<div style="width: 24px; height: 24px; border: 2px solid rgba(255,255,255,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
						<div style="width: 4px; height: 4px; background: rgba(0,255,200,0.8); border-radius: 50%;"></div>
					</div>
				`;
				bgContainer.appendChild(hud);
				element.appendChild(bgContainer);

				const player = {
					destroy: () => {},
					getCurrentTime: () => currentTime,
					getDuration: () => 300,
					pauseVideo: () => {
						if (stateChangeCb) stateChangeCb({ data: 2, target: player });
					},
					playVideo: () => {
						if (stateChangeCb) stateChangeCb({ data: 1, target: player });
					},
					seekTo: (sec: number) => {
						currentTime = sec;
					},
				};

				setTimeout(() => {
					if (readyCb) {
						readyCb({ target: player });
					}
					if (stateChangeCb) {
						stateChangeCb({ data: 1, target: player });
					}
				}, 100);

				return player;
			},
		};
	});

	const page = await context.newPage();

	try {
		console.log("Navigating to demo...");
		await page.goto("http://127.0.0.1:3000/demo", { waitUntil: "networkidle" });
		console.log("Loaded demo page. URL:", page.url());

		const dialog = page.locator('div[role="dialog"]');
		await dialog.waitFor({ state: "visible", timeout: 15000 });
		console.log("Scenario overlay visible!");

		const playerSection = page.locator(
			'section[aria-label="Session media player"]',
		);
		await page.waitForTimeout(500);

		await playerSection.screenshot({
			path: "public/images/decision-interface-preview.png",
		});
		console.log("Screenshot captured successfully!");
	} finally {
		await browser.close();
		if (server) {
			server.kill();
		}
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
