/**
 * URL search parameter schema and validation for the interactive session player view.
 *
 * Validates and structures URL query search parameters for the interactive session player view,
 * ensuring type-safe filtering of training modules.
 *
 * Implements `sessionSearchSchema` and `validateSessionSearch` using Zod schemas to parse optional
 * module filters within the `src/pages/vods-id-session/` slice.
 */
import { z } from "zod";

export const sessionSearchSchema = z.object({
	modules: z.string().optional(),
});

export type SessionSearch = z.infer<typeof sessionSearchSchema>;

export function validateSessionSearch(search: unknown): SessionSearch {
	return sessionSearchSchema.parse(search);
}
