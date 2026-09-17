/**
 * Reusable multi-dimensional filter inputs for narrowing training VOD catalog and playthrough history collections.
 *
 * Implements `VodFilterInputs` providing responsive dropdown controls for Map, Hero, and Level of Play
 * alongside a text input for Player search. Dynamically extracts select options strictly from the provided VOD dataset.
 */
"use client";

import { type ChangeEvent, useCallback } from "react";
export interface VodFilterItem {
	heroName?: string;
	mapName?: string;
	rankTier?: string;
}

export interface VodFilterInputsProps {
	className?: string;
	onHeroChange?: (hero: string) => void;
	onLevelOfPlayChange?: (levelOfPlay: string) => void;
	onMapChange?: (map: string) => void;
	onPlayerChange?: (player: string) => void;
	selectedHero?: string;
	selectedLevelOfPlay?: string;
	selectedMap?: string;
	selectedPlayer?: string;
	vods: readonly VodFilterItem[];
}

export function VodFilterInputs({
	className = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4",
	onHeroChange,
	onLevelOfPlayChange,
	onMapChange,
	onPlayerChange,
	selectedHero = "",
	selectedLevelOfPlay = "",
	selectedMap = "",
	selectedPlayer = "",
	vods,
}: VodFilterInputsProps) {
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
			[...vods.map((v) => v.rankTier), selectedLevelOfPlay].filter(
				Boolean,
			) as string[],
		),
	).sort();

	return (
		<div className={className}>
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
				<option value="">All Levels of Play</option>
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
		</div>
	);
}
