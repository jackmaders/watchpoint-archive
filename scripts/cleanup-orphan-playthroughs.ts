import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import { getPlatformProxy } from "wrangler";
import { deleteOrphanInProgressPlaythroughs } from "../src/shared/db/queries/playthroughs";
import { relations } from "../src/shared/db/schema/relations";

export interface CleanupOrphanPlaythroughsResult {
	deletedCount: number;
}

export async function executeCleanupOrphanPlaythroughs(
	db: Parameters<typeof deleteOrphanInProgressPlaythroughs>[0],
): Promise<CleanupOrphanPlaythroughsResult> {
	const deleted = await deleteOrphanInProgressPlaythroughs(db);
	return { deletedCount: deleted.length };
}

async function main() {
	const proxy = await getPlatformProxy<{ DB: D1Database }>();

	try {
		const db = drizzle(proxy.env.DB, { relations });
		const result = await executeCleanupOrphanPlaythroughs(db as never);
		console.log(
			`Cleaned up ${result.deletedCount} orphaned in-progress playthrough records from D1.`,
		);
	} finally {
		await proxy.dispose();
	}
}

if (import.meta.main) {
	main().catch((error) => {
		console.error(error);
		process.exitCode = 1;
	});
}
