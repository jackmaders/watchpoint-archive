/**
 * Filter controls bar for narrowing match history by learning module types and advanced dimensions.
 *
 * Implements `HistoryFilterBar` with advanced filter dropdowns (Map, Hero, Level of Play, Player, VOD)
 * and individual module toggle buttons.
 */
import { type ChangeEvent, useCallback } from "react";
import type { ModuleType, PublishedVodItem } from "../model/types";

export const MODULE_LABEL_MAP: Record<ModuleType, string> = {
	SPATIAL: "Spatial",
	STRATEGY: "Strategy",
	TACTICS: "Tactics",
	TRACKING: "Tracking",
};

export const ALL_MODULES: { key: ModuleType; label: string }[] = [
	{ key: "STRATEGY", label: MODULE_LABEL_MAP.STRATEGY },
	{ key: "TACTICS", label: MODULE_LABEL_MAP.TACTICS },
	{ key: "TRACKING", label: MODULE_LABEL_MAP.TRACKING },
	{ key: "SPATIAL", label: MODULE_LABEL_MAP.SPATIAL },
];

export interface HistoryFilterBarProps {
	onHeroChange?: (hero: string) => void;
	onLevelOfPlayChange?: (levelOfPlay: string) => void;
	onMapChange?: (map: string) => void;
	onModuleToggle: (module: ModuleType) => void;
	onPlayerChange?: (player: string) => void;
	onVodChange: (vodId: string) => void;
	selectedHero?: string;
	selectedLevelOfPlay?: string;
	selectedMap?: string;
	selectedModules: readonly ModuleType[];
	selectedPlayer?: string;
	selectedVodId: string;
	vods: readonly PublishedVodItem[];
}

const DEFAULT_LEVELS_OF_PLAY = [
	"Grandmaster",
	"Champion",
	"GM Ranked",
	"FACEIT",
	"OWCS",
	"Top 500",
	"Master",
	"Diamond",
];

export function HistoryFilterBar(props: HistoryFilterBarProps) {
	return (
		<div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="text-sm font-semibold text-foreground">Filters</div>
				<div className="flex flex-wrap items-center gap-1.5">
					{ALL_MODULES.map((m) => (
						<ModuleFilterButton
							active={props.selectedModules.includes(m.key)}
							definition={m}
							key={m.key}
							onToggle={props.onModuleToggle}
						/>
					))}
				</div>
			</div>
			<HistoryAdvancedInputs {...props} />
		</div>
	);
}

function HistoryAdvancedInputs({
	onHeroChange,
	onLevelOfPlayChange,
	onMapChange,
	onPlayerChange,
	onVodChange,
	selectedHero = "",
	selectedLevelOfPlay = "",
	selectedMap = "",
	selectedPlayer = "",
	selectedVodId,
	vods,
}: HistoryFilterBarProps) {
	const handleSelectChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => onVodChange(e.target.value),
		[onVodChange],
	);
	const handleMapSelect = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => onMapChange?.(e.target.value),
		[onMapChange],
	);
	const handleHeroSelect = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => onHeroChange?.(e.target.value),
		[onHeroChange],
	);
	const handleLevelSelect = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) =>
			onLevelOfPlayChange?.(e.target.value),
		[onLevelOfPlayChange],
	);
	const handlePlayerInput = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => onPlayerChange?.(e.target.value),
		[onPlayerChange],
	);

	const availableMaps = Array.from(
		new Set(
			[...vods.map((v) => v.mapName), selectedMap].filter(Boolean) as string[],
		),
	).sort();

	const availableHeroes = Array.from(
		new Set(
			[...vods.map((v) => v.heroName), selectedHero].filter(
				Boolean,
			) as string[],
		),
	).sort();

	const availableLevels = Array.from(
		new Set(
			[
				...DEFAULT_LEVELS_OF_PLAY,
				...vods.map((v) => v.rankTier),
				selectedLevelOfPlay,
			].filter(Boolean) as string[],
		),
	);

	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 border-t border-border pt-4">
			<select
				aria-label="Filter by Map"
				className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				onChange={handleMapSelect}
				value={selectedMap}
			>
				<option value="">All Maps</option>
				{availableMaps.map((map) => (
					<option key={map} value={map}>
						{map}
					</option>
				))}
			</select>

			<select
				aria-label="Filter by Hero"
				className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				onChange={handleHeroSelect}
				value={selectedHero}
			>
				<option value="">All Heroes</option>
				{availableHeroes.map((hero) => (
					<option key={hero} value={hero}>
						{hero}
					</option>
				))}
			</select>

			<select
				aria-label="Filter by Level of Play"
				className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				onChange={handleLevelSelect}
				value={selectedLevelOfPlay}
			>
				<option value="">All Levels</option>
				{availableLevels.map((lvl) => (
					<option key={lvl} value={lvl}>
						{lvl}
					</option>
				))}
			</select>

			<input
				aria-label="Filter by Player"
				className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				onChange={handlePlayerInput}
				placeholder="Filter by player…"
				type="text"
				value={selectedPlayer}
			/>

			<select
				aria-label="Filter by VOD"
				className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				onChange={handleSelectChange}
				value={selectedVodId}
			>
				<option value="">All VODs</option>
				{vods.map((vod) => (
					<option key={vod.id} value={vod.id}>
						{vod.title} ({vod.mapName})
					</option>
				))}
			</select>
		</div>
	);
}

function ModuleFilterButton({
	active,
	definition,
	onToggle,
}: {
	active: boolean;
	definition: { key: ModuleType; label: string };
	onToggle: (key: ModuleType) => void;
}) {
	const handleClick = useCallback(
		() => onToggle(definition.key),
		[definition.key, onToggle],
	);

	return (
		<button
			aria-label={`Toggle ${definition.label}`}
			className={`rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
				active
					? "border-primary bg-primary text-primary-foreground"
					: "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
			}`}
			onClick={handleClick}
			type="button"
		>
			{definition.label}
		</button>
	);
}
