/**
 * Displays a curated preview of published interactive training VODs and direct access points to scenario sessions.
 *
 * Implements `FeaturedVodsSection` within `src/pages/home/ui/`, rendering responsive scenario cards
 * with rank tier badges, map designations, scenario counts, and links to full catalog views.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Layers } from "lucide-react";
import { formatDuration } from "@/shared/lib/utils";
import type { PublishedVodItem } from "../model/types";

export function FeaturedVodsSection(props: { vods: PublishedVodItem[] }) {
	const { vods } = props;

	return (
		<section className="space-y-6 py-12 sm:py-16">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div className="space-y-1">
					<p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
						Interactive Catalog Preview
					</p>
					<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						Featured Training Modules
					</h2>
					<p className="text-base text-muted-foreground">
						Jump into hand-crafted tactical decision scenarios across Tank,
						Damage, and Support roles.
					</p>
				</div>
				<Link
					className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					to="/vods"
				>
					<span>View Full Catalog</span>
					<ArrowRight className="h-4 w-4" />
				</Link>
			</div>

			{vods.length === 0 ? (
				<div className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
					<p className="text-lg font-medium text-muted-foreground">
						No training scenarios currently available.
					</p>
					<p className="mt-1 text-sm text-muted-foreground/80">
						Check back soon for new Grandmaster and Top 500 session uploads.
					</p>
					<div className="mt-6">
						<Link
							className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground"
							to="/vods"
						>
							Explore Catalog
						</Link>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{vods.map((vod) => (
						<div
							className="flex flex-col justify-between rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm transition-all duration-200 hover:border-primary/60 hover:shadow-md"
							key={vod.id}
						>
							<div className="space-y-3">
								<div className="flex flex-wrap items-center justify-between gap-2">
									<span className="rounded-sm border border-accent bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
										{vod.mapName}
									</span>
									<span className="rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
										{vod.rankTier}
									</span>
								</div>

								<h3 className="line-clamp-2 text-lg font-semibold text-card-foreground">
									{vod.title}
								</h3>

								<div className="flex items-center justify-between gap-2 border-t border-border pt-3 font-mono text-xs text-muted-foreground">
									<span className="flex items-center gap-1">
										<Clock className="h-3.5 w-3.5" />
										{formatDuration(vod.durationSeconds)}
									</span>
									<span className="flex items-center gap-1">
										<Layers className="h-3.5 w-3.5" />
										{vod.scenarios.length} Scenarios
									</span>
								</div>
							</div>

							<div className="mt-5">
								<Link
									className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									params={{ id: vod.id }}
									to="/vods/$id"
								>
									<span>Start Scenario</span>
									<ArrowRight className="h-4 w-4" />
								</Link>
							</div>
						</div>
					))}
				</div>
			)}
		</section>
	);
}
