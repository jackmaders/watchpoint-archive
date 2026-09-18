import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import { getPlatformProxy } from "wrangler";
import {
	assertLocalSeedTarget,
	executeSeed,
} from "../src/shared/db/lib/seed/index.server";
import { relations } from "../src/shared/db/model/schema/relations";

async function main() {
	assertLocalSeedTarget();
	const proxy = await getPlatformProxy<{ DB: D1Database }>();

	try {
		const db = drizzle(proxy.env.DB, { relations });
		const result = await executeSeed(db);
		console.log(
			`Seeded local fixtures: ${result.playerEmail}, ${result.adminEmail}, and ${result.scenariosCount} module scenarios.`,
		);
	} finally {
		await proxy.dispose();
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
