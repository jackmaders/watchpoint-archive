/**
 * Catalog browser view presenting all published Overwatch 2 training VODs with multi-dimensional filtering.
 *
 * Implements `VodsPage` wrapped in `AppLayout`, rendering hero tags, rank tier badges, map names,
 * video durations, filter controls for Map, Hero, Level of Play, and Player, and navigation links to pre-session setup pages.
 */
import { Link } from "@tanstack/react-router";
import { useCallback } from "react";
import { VodFilterInputs } from "@/entities/vod";
import { formatDuration } from "@/shared/lib/utils";
import { getEffectiveVodDuration } from "@/shared/lib/vod-time-range";
import { Button } from "@/shared/ui/button";
import type { PublishedVodItem } from "@/widgets/admin-vod-editor";
import { AppLayout } from "@/widgets/layout-main";
import type { VodsSearchParams } from "../model/search-params";

export type VodItem = PublishedVodItem;
export { formatDuration };

export interface VodsPageProps {
	onFilterChange?: (newParams: VodsSearchParams) => void;
	registrationEnabled?: boolean;
	searchParams?: VodsSearchParams;
	vods?: PublishedVodItem[];
}

export function VodsPage(props?: VodsPageProps) {
	const vods = props?.vods ?? [];
	const searchParams = props?.searchParams;
	const onFilterChange = props?.onFilterChange;

	const hasActiveFilters = Boolean(
		searchParams?.map ||
			searchParams?.hero ||
			searchParams?.levelOfPlay ||
			searchParams?.player,
	);

	const handleClearFilters = useCallback(() => {
		onFilterChange?.({});
	}, [onFilterChange]);

	return (
		<AppLayout registrationEnabled={props?.registrationEnabled}>
			<div className="mx-auto max-w-6xl space-y-8">
				<VodsHeader />

				<VodsFilterBar
					hasActiveFilters={hasActiveFilters}
					onClearFilters={handleClearFilters}
					onFilterChange={onFilterChange}
					searchParams={searchParams}
					vods={vods}
				/>

				{vods.length === 0 ? (
					<VodsEmptyState
						hasActiveFilters={hasActiveFilters}
						onClearFilters={handleClearFilters}
					/>
				) : (
					<VodsGrid vods={vods} />
				)}
			</div>
		</AppLayout>
	);
}

function VodsHeader() {
	return (
		<header className="space-y-3 border-b border-border pb-6">
			<h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
				VOD Training Catalog
			</h1>
			<p className="max-w-2xl text-base text-muted-foreground">
				Select a match to practice decision making, cooldown management, and
				tactical positioning.
			</p>
		</header>
	);
}

function VodsFilterBar({
	hasActiveFilters,
	onClearFilters,
	onFilterChange,
	searchParams,
	vods,
}: {
	hasActiveFilters: boolean;
	onClearFilters: () => void;
	onFilterChange?: (newParams: VodsSearchParams) => void;
	searchParams?: VodsSearchParams;
	vods: PublishedVodItem[];
}) {
	const handleMapChange = useCallback(
		(map: string) =>
			onFilterChange?.({ ...searchParams, map: map || undefined }),
		[onFilterChange, searchParams],
	);

	const handleHeroChange = useCallback(
		(hero: string) =>
			onFilterChange?.({ ...searchParams, hero: hero || undefined }),
		[onFilterChange, searchParams],
	);

	const handleLevelOfPlayChange = useCallback(
		(levelOfPlay: string) =>
			onFilterChange?.({
				...searchParams,
				levelOfPlay: levelOfPlay || undefined,
			}),
		[onFilterChange, searchParams],
	);

	const handlePlayerChange = useCallback(
		(player: string) =>
			onFilterChange?.({
				...searchParams,
				player: player || undefined,
			}),
		[onFilterChange, searchParams],
	);

	return (
		<div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
			<VodFilterInputs
				onHeroChange={handleHeroChange}
				onLevelOfPlayChange={handleLevelOfPlayChange}
				onMapChange={handleMapChange}
				onPlayerChange={handlePlayerChange}
				selectedHero={searchParams?.hero}
				selectedLevelOfPlay={searchParams?.levelOfPlay}
				selectedMap={searchParams?.map}
				selectedPlayer={searchParams?.player}
				vods={vods}
			/>

			{hasActiveFilters ? (
				<div className="flex items-center justify-end border-t border-border pt-3">
					<Button
						aria-label="Clear all filters"
						onClick={onClearFilters}
						size="sm"
						variant="outline"
					>
						Clear Filters
					</Button>
				</div>
			) : null}
		</div>
	);
}

function VodsEmptyState({
	hasActiveFilters,
	onClearFilters,
}: {
	hasActiveFilters: boolean;
	onClearFilters: () => void;
}) {
	return (
		<div className="rounded-lg border border-dashed border-border bg-muted/50 p-8 text-center sm:p-12">
			<p className="text-lg font-medium text-muted-foreground">
				{hasActiveFilters
					? "No training VODs match the selected filters."
					: "No training VODs currently available."}
			</p>
			<p className="mt-1 text-sm text-muted-foreground/80">
				{hasActiveFilters
					? "Try adjusting or clearing your filters to see more sessions."
					: "Check back soon for new Grandmaster and Top 500 session uploads."}
			</p>
			{hasActiveFilters ? (
				<div className="mt-4">
					<Button onClick={onClearFilters} size="sm" variant="outline">
						Clear Filters
					</Button>
				</div>
			) : null}
		</div>
	);
}

function VodsGrid({ vods }: { vods: PublishedVodItem[] }) {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{vods.map((vod) => (
				<div
					className="flex flex-col justify-between rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-primary/60 hover:shadow-md motion-reduce:transition-none"
					key={vod.id}
				>
					<div className="space-y-4">
						<div className="flex items-center justify-between gap-2 flex-wrap">
							<div className="flex items-center gap-1.5 flex-wrap">
								<span className="rounded-sm border border-accent bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
									{vod.mapName}
								</span>
								<span className="rounded-sm border border-secondary bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
									{vod.heroName}
								</span>
							</div>
							<span className="rounded-sm border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
								{vod.rankTier}
							</span>
						</div>

						<h2 className="line-clamp-2 text-xl font-semibold text-card-foreground">
							{vod.title}
						</h2>

						<div className="flex items-center justify-between gap-2 border-t border-border pt-3 font-mono text-xs text-muted-foreground">
							<span>
								Duration: {formatDuration(getEffectiveVodDuration(vod))}
							</span>
							<span>{vod.scenarios.length} Scenarios</span>
						</div>
					</div>

					<div className="mt-6">
						<Link
							className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:bg-primary/80 motion-reduce:transition-none"
							params={{ id: vod.id }}
							to="/vods/$id"
						>
							Start Training
						</Link>
					</div>
				</div>
			))}
		</div>
	);
}
