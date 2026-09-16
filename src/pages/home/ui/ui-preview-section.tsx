/**
 * Visual showcase previewing the interactive decision-moment training player interface.
 *
 * Implements `UiPreviewSection` within `src/pages/home/ui/`, rendering a high-fidelity
 * mock player shell with scenario prompts, decision options, and a secondary "Try It Now" CTA.
 */
import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	CheckCircle2,
	Clock,
	Pause,
	RotateCcw,
	Shield,
} from "lucide-react";
import { FIXTURE_IDS } from "@/shared/db";

export interface UiPreviewSectionProps {
	demoVodId?: string;
}

export function UiPreviewSection({
	demoVodId = FIXTURE_IDS.vod,
}: UiPreviewSectionProps = {}) {
	return (
		<section className="space-y-8 py-12 sm:py-16">
			<div className="space-y-3 text-center">
				<p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
					Interactive Decision Engine
				</p>
				<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					Train in High-Pressure Match Moments
				</h2>
				<p className="mx-auto max-w-2xl text-base text-muted-foreground">
					Watch authentic gameplay pause at game-defining junctures. Test your
					decision-making under pressure and review coaching explanations
					instantly.
				</p>
			</div>

			{/* High-fidelity Player UI Mockup */}
			<div className="relative mx-auto max-w-4xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
				{/* Top Browser / Player Bar */}
				<div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/60 px-4 py-3 text-xs sm:px-6">
					<div className="flex items-center gap-2">
						<span className="h-3 w-3 rounded-full bg-red-500/80" />
						<span className="h-3 w-3 rounded-full bg-yellow-500/80" />
						<span className="h-3 w-3 rounded-full bg-green-500/80" />
						<span className="ml-2 font-mono text-xs font-semibold text-muted-foreground">
							Grandmaster Ana — King&apos;s Row Defense
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="rounded border border-border bg-card px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
							Scenario 2 / 5
						</span>
						<span className="rounded border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
							LIVE DRILL
						</span>
					</div>
				</div>

				{/* Video Stage & Decision Overlay */}
				<div className="relative aspect-video w-full overflow-hidden bg-gradient-to-b from-zinc-900 to-black p-4 sm:p-8 flex flex-col justify-between text-left">
					{/* Header Tags */}
					<div className="flex items-center justify-between">
						<div className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/20 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
							<Shield className="h-3.5 w-3.5" />
							<span>Tactics • Mid-Fight Decision</span>
						</div>
						<div className="flex items-center gap-2 rounded-md bg-black/60 px-2.5 py-1 text-xs font-mono text-zinc-300 backdrop-blur">
							<Clock className="h-3 w-3 text-primary" />
							<span>02:15 / 16:00</span>
						</div>
					</div>

					{/* Decision Prompt & Options Overlay */}
					<div className="my-auto max-w-xl space-y-3 rounded-lg border border-border/80 bg-card/95 p-4 sm:p-6 shadow-xl backdrop-blur">
						<div className="space-y-1">
							<span className="text-[11px] font-bold uppercase tracking-wider text-primary">
								Decision Point
							</span>
							<p className="text-sm font-semibold text-card-foreground sm:text-base">
								The enemy Winston dives your co-support with Barrier Shield.
								What is your immediate tactical priority?
							</p>
						</div>

						<div className="space-y-2 pt-1 text-xs sm:text-sm">
							<div className="flex items-center gap-2.5 rounded-md border border-border bg-muted/40 px-3 py-2 text-muted-foreground">
								<span className="font-mono text-xs font-bold">A</span>
								<span>
									Fall back through hotel corridor and break sightlines
								</span>
							</div>

							<div className="flex items-center justify-between rounded-md border border-primary/60 bg-primary/15 px-3 py-2 font-medium text-foreground">
								<div className="flex items-center gap-2.5">
									<span className="font-mono text-xs font-bold text-primary">
										B
									</span>
									<span>Save Biotic Grenade to counter dive commitment</span>
								</div>
								<CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
							</div>

							<div className="flex items-center gap-2.5 rounded-md border border-border bg-muted/40 px-3 py-2 text-muted-foreground">
								<span className="font-mono text-xs font-bold">C</span>
								<span>Use Sleep Dart on frontlining enemy tank</span>
							</div>
						</div>
					</div>

					{/* Bottom Controls Bar */}
					<div className="flex items-center justify-between rounded-md bg-black/60 px-3 py-2 text-xs text-zinc-300 backdrop-blur">
						<div className="flex items-center gap-3">
							<button
								aria-label="Pause replay"
								className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
								type="button"
							>
								<Pause className="h-3.5 w-3.5" />
							</button>
							<button
								aria-label="Replay last 5 seconds"
								className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white"
								type="button"
							>
								<RotateCcw className="h-3 w-3" />
								<span>Replay -5s</span>
							</button>
						</div>
						<span className="font-mono text-[11px] text-zinc-400">
							Action Paused for Decision
						</span>
					</div>
				</div>
			</div>

			{/* Interactive CTA */}
			<div className="text-center pt-2">
				<Link
					className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					params={{ id: demoVodId }}
					to="/vods/$id"
				>
					<span>Try It Now</span>
					<ArrowRight className="h-4 w-4" />
				</Link>
			</div>
		</section>
	);
}
