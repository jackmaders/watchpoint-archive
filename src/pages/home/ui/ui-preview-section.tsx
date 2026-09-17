/**
 * Visual showcase previewing the interactive decision-moment training player interface.
 *
 * Implements `UiPreviewSection` within `src/pages/home/ui/`, rendering an authentic screenshot
 * of the tactical decision engine interface and a secondary "Try It Now" CTA.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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

			{/* Authentic Screenshot Preview */}
			<div className="relative mx-auto max-w-4xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
				<img
					alt="Interactive decision interface screenshot"
					className="w-full h-auto object-cover"
					src="/images/decision-interface-preview.svg"
				/>
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
