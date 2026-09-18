/**
 * Defines database-backed vocabulary shared by browser and server modules without exposing
 * Drizzle's runtime schema graph to client bundles.
 *
 * Exports the stable role, scenario input, learning module, and playthrough status constants
 * together with their TypeScript unions; Drizzle schemas consume the same values server-side.
 */

export const heroRoleEnum = ["TANK", "DAMAGE", "SUPPORT"] as const;
export type HeroRole = (typeof heroRoleEnum)[number];

export const inputTypeEnum = [
	"MULTIPLE_CHOICE",
	"PERCENT_SLIDER",
	"TIME_SLIDER",
	"MAP_PIN_2D",
] as const;
export type InputType = (typeof inputTypeEnum)[number];

export const moduleTypeEnum = [
	"STRATEGY",
	"TACTICS",
	"TRACKING",
	"SPATIAL",
] as const;
export type ModuleType = (typeof moduleTypeEnum)[number];

export const playthroughStatusEnum = ["IN_PROGRESS", "COMPLETED"] as const;
export type PlaythroughStatus = (typeof playthroughStatusEnum)[number];

export const userRoleEnum = ["PLAYER", "ADMIN"] as const;
export type UserRole = (typeof userRoleEnum)[number];
