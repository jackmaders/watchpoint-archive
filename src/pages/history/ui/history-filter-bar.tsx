/**
 * Filter controls bar for narrowing match history by VOD title and learning module types.
 *
 * Implements `HistoryFilterBar` with a VOD selector dropdown and individual module toggle buttons.
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
	onModuleToggle: (module: ModuleType) => void;
	onVodChange: (vodId: string) => void;
	selectedModules: readonly ModuleType[];
	selectedVodId: string;
	vods: readonly PublishedVodItem[];
}

export function HistoryFilterBar({
	onModuleToggle,
	onVodChange,
	selectedModules,
	selectedVodId,
	vods,
}: HistoryFilterBarProps) {
	const handleSelectChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => onVodChange(e.target.value),
		[onVodChange],
	);

	return (
		<div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-wrap items-center gap-3">
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

			<div className="flex flex-wrap items-center gap-1.5">
				{ALL_MODULES.map((m) => (
					<ModuleFilterButton
						active={selectedModules.includes(m.key)}
						definition={m}
						key={m.key}
						onToggle={onModuleToggle}
					/>
				))}
			</div>
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
