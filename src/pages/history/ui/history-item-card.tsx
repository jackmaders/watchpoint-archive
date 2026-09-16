/**
 * Summary card component displaying a single completed playthrough record with accuracy, latency, and module badges.
 *
 * Implements `HistoryItemCard` linking to `/history/$id` and rendering completion timestamps, accuracy ratings,
 * median active-response latency, and map/rank badges.
 */
import { Link } from "@tanstack/react-router";
import { formatAccuracy, formatLatency } from "@/shared/lib/metrics";
import type { PlayerHistoryItem } from "../model/types";
import { MODULE_LABEL_MAP } from "./history-filter-bar";

export function HistoryItemCard({ item }: { item: PlayerHistoryItem }) {
	return (
		<div className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-primary/50 sm:flex-row sm:items-center">
			<div className="space-y-2">
				<div className="flex flex-wrap items-center gap-2">
					<span className="rounded-sm border border-secondary bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
						{item.vod?.mapName ?? "Unknown Map"}
					</span>
					<span className="rounded-sm border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
						{item.vod?.rankTier ?? "Rank"}
					</span>
				</div>

				<h2 className="text-lg font-semibold text-foreground">
					{item.vod?.title ?? "VOD Training Session"}
				</h2>

				<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
					<span>
						Completed:{" "}
						{new Date(item.completedAt ?? item.createdAt).toLocaleDateString()}
					</span>
					<span>&bull;</span>
					<span>
						Accuracy:{" "}
						<strong className="text-foreground">
							{formatAccuracy(item.accuracy)}
						</strong>
					</span>
					<span>&bull;</span>
					<span>
						Median Latency:{" "}
						<strong className="text-foreground">
							{formatLatency(item.medianLatencyMs)}
						</strong>
					</span>
				</div>

				<div className="flex flex-wrap items-center gap-1.5 pt-1">
					{item.moduleSelections.map((sel) => (
						<span
							className="rounded border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
							key={sel.moduleType}
						>
							{MODULE_LABEL_MAP[sel.moduleType]}
						</span>
					))}
				</div>
			</div>

			<div className="shrink-0">
				<Link
					aria-label="Review details for completed session"
					className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					params={{ playthroughId: item.id } as Record<string, string>}
					to={"/history/$playthroughId" as string}
				>
					Review Details
				</Link>
			</div>
		</div>
	);
}
