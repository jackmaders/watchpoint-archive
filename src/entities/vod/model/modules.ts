/**
 * Canonical module definitions, visual styling tokens, and descriptors for the 4 interactive game sense learning modules.
 *
 * Defines `DEFAULT_MODULE_TYPES`, `MODULE_DEFINITIONS`, and `MODULE_MAP` mapping `STRATEGY`, `TACTICS`,
 * `TRACKING`, and `SPATIAL` modules to their respective badge classes, theme colors, and user-facing labels.
 */
import type { ModuleType } from "@/shared/db";

export type { ModuleType };

export interface ModuleDefinition {
	badge: string;
	color: string;
	description: string;
	key: ModuleType;
	label: string;
	tooltip: string;
}

export const DEFAULT_MODULE_TYPES: readonly ModuleType[] = [
	"STRATEGY",
	"TACTICS",
	"TRACKING",
	"SPATIAL",
] as const;

export const MODULE_DEFINITIONS: readonly ModuleDefinition[] = [
	{
		badge: "bg-primary/10 text-primary border-primary/40",
		color: "bg-primary/10 text-primary border-primary/40",
		description: "Pre-fight positioning, win-conditions, and lose-conditions",
		key: "STRATEGY",
		label: "Strategy",
		tooltip: "Pre-fight positioning, win-conditions, and lose-conditions",
	},
	{
		badge: "bg-accent text-accent-foreground border-border",
		color: "bg-accent text-accent-foreground border-border",
		description: "Mid-fight opportunities and cooldown usage",
		key: "TACTICS",
		label: "Tactics",
		tooltip: "Mid-fight opportunities and cooldown usage",
	},
	{
		badge: "bg-secondary text-secondary-foreground border-border",
		color: "bg-secondary text-secondary-foreground border-border",
		description: "Ultimate and ability tracking",
		key: "TRACKING",
		label: "Tracking",
		tooltip: "Ultimate and ability tracking",
	},
	{
		badge: "bg-card text-card-foreground border-border",
		color: "bg-card text-card-foreground border-border",
		description: "Spatial awareness and positional tracking",
		key: "SPATIAL",
		label: "Awareness",
		tooltip: "Spatial awareness and positional tracking",
	},
] as const;

export const MODULE_MAP: Record<ModuleType, ModuleDefinition> =
	MODULE_DEFINITIONS.reduce(
		(acc, def) => {
			acc[def.key] = def;
			return acc;
		},
		{} as Record<ModuleType, ModuleDefinition>,
	);
