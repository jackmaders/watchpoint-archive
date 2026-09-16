/**
 * Search parameter schema and validation logic for the VOD training catalog page.
 *
 * Implements `vodsSearchSchema` and `validateVodsSearch` to parse active filter parameters
 * including map, hero, level of play, and player search filters.
 */
import { z } from "zod";

export const vodsSearchSchema = z.object({
	hero: z.string().min(1).optional(),
	levelOfPlay: z.string().min(1).optional(),
	map: z.string().min(1).optional(),
	player: z.string().min(1).optional(),
});

export type VodsSearchParams = z.infer<typeof vodsSearchSchema>;

export function validateVodsSearch(
	search: Record<string, unknown>,
): VodsSearchParams {
	const parsed = vodsSearchSchema.safeParse(search);
	if (parsed.success) {
		return parsed.data;
	}
	return {};
}
