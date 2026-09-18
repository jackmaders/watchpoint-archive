/**
 * Filter controls bar for narrowing match history by learning module types and advanced dimensions.
 *
 * Implements `HistoryFilterBar` with advanced filter dropdowns (Map, Hero, Level of Play, Player)
 * and individual module toggle buttons.
 */
import { useCallback } from "react";
import { VodFilterInputs } from "@/entities/vod";
import type { ModuleType, PublishedVodItem } from "../model/types";

export const MODULE_LABEL_MAP: Record<ModuleType, string> = {
	SPATIAL: "Spatial",
	STRATEGY: "Strategy",
	TACTICS: "Tactics",
	TRACKING: "Tracking",
};

const ALL_MODULES: { key: ModuleType; label: string }[] = [
	{ key: "STRATEGY", label: MODULE_LABEL_MAP.STRATEGY },
	{ key: "TACTICS", label: MODULE_LABEL_MAP.TACTICS },
	{ key: "TRACKING", label: MODULE_LABEL_MAP.TRACKING },
	{ key: "SPATIAL", label: MODULE_LABEL_MAP.SPATIAL },
];

export interface HistoryFilterBarProps {
	onAllModulesToggle?: () => void;
	onHeroChange?: (hero: string) => void;
	onLevelOfPlayChange?: (levelOfPlay: string) => void;
	onMapChange?: (map: string) => void;
	onModuleToggle: (module: ModuleType) => void;
	onPlayerChange?: (player: string) => void;
	selectedHero?: string;
	selectedLevelOfPlay?: string;
	selectedMap?: string;
	selectedModules: readonly ModuleType[];
	selectedPlayer?: string;
	vods: readonly PublishedVodItem[];
}

export function HistoryFilterBar(props: HistoryFilterBarProps) {
	const isAllActive =
		props.selectedModules.length === 0 ||
		props.selectedModules.length === ALL_MODULES.length;

	return (
		<div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="text-sm font-semibold text-foreground">Filters</div>
				<div className="flex flex-wrap items-center gap-1.5">
					<button
						aria-label="Toggle All Scenarios"
						aria-pressed={isAllActive}
						className={`rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
							isAllActive
								? "border-primary bg-primary text-primary-foreground"
								: "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
						}`}
						onClick={props.onAllModulesToggle}
						type="button"
					>
						All Scenarios
					</button>
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
			<VodFilterInputs
				className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 border-t border-border pt-4"
				onHeroChange={props.onHeroChange}
				onLevelOfPlayChange={props.onLevelOfPlayChange}
				onMapChange={props.onMapChange}
				onPlayerChange={props.onPlayerChange}
				selectedHero={props.selectedHero}
				selectedLevelOfPlay={props.selectedLevelOfPlay}
				selectedMap={props.selectedMap}
				selectedPlayer={props.selectedPlayer}
				vods={props.vods}
			/>
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
