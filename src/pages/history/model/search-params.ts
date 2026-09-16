/**
 * Search schema and validation logic for the player history filtering state.
 *
 * Implements `historySearchSchema` and `validateHistorySearch` to parse active module filters,
 * pagination parameters (`page`, `pageSize`), and VOD IDs for completed playthroughs.
 */
import { z } from "zod";

const moduleEnumSchema = z.enum(["STRATEGY", "TACTICS", "TRACKING", "SPATIAL"]);

export const historySearchSchema = z.object({
	hero: z.string().min(1).optional(),
	levelOfPlay: z.string().min(1).optional(),
	map: z.string().min(1).optional(),
	modules: z
		.union([
			z.array(moduleEnumSchema),
			z.string().transform((val) =>
				val
					.split(",")
					.map((m) => m.trim())
					.filter(Boolean),
			),
		])
		.pipe(z.array(moduleEnumSchema))
		.optional(),
	page: z.coerce.number().int().positive().optional(),
	pageSize: z.coerce.number().int().positive().max(50).optional(),
	player: z.string().min(1).optional(),
	vodId: z.string().min(1).optional(),
});

export type HistorySearchParams = z.infer<typeof historySearchSchema>;

export function validateHistorySearch(
	search: Record<string, unknown>,
): HistorySearchParams {
	const parsed = historySearchSchema.safeParse(search);
	if (parsed.success) {
		return parsed.data;
	}
	return {};
}
