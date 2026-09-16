/**
 * Highlights key player benefits, role-specific drills, and tactical competitive advantages of Watchpoint.
 *
 * Implements `ValueHighlightsSection` within `src/pages/home/ui/`, rendering responsive benefit cards
 * detailing role specializations, reaction drills, and objective game sense improvements.
 */
import { Award, Compass, Shield, Zap } from "lucide-react";

const VALUE_ITEMS = [
	{
		description:
			"Dedicated decision paths for Tank space creation, DPS target prioritization, and Support cooldown usage.",
		icon: Shield,
		title: "Targeted Role Scenarios",
	},
	{
		description:
			"Sharpen fight recognition under pressure to make fast, decisive plays before the enemy team reacts.",
		icon: Zap,
		title: "Sub-Second Tactical Drills",
	},
	{
		description:
			"Gain transparent accuracy metrics, response time telemetry, and detailed post-scenario breakdowns.",
		icon: Award,
		title: "Objective Performance Metrics",
	},
	{
		description:
			"Cover high-ground defenses, overtime pushes, counter-pick adjustments, and retakes across all competitive maps.",
		icon: Compass,
		title: "Map & Meta Versatility",
	},
] as const;

export function ValueHighlightsSection() {
	return (
		<section className="space-y-10 py-12 sm:py-16">
			<div className="space-y-3 text-center">
				<p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
					Competitive Advantage
				</p>
				<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					Engineered for Serious Competitors
				</h2>
				<p className="mx-auto max-w-2xl text-base text-muted-foreground">
					Bridge the gap between raw mechanics and elite game sense with
					structured, scenario-based learning.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{VALUE_ITEMS.map((item) => {
					const Icon = item.icon;
					return (
						<div
							className="flex flex-col justify-between rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/50"
							key={item.title}
						>
							<div className="space-y-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
									<Icon className="h-5 w-5" />
								</div>
								<h3 className="text-lg font-semibold text-card-foreground">
									{item.title}
								</h3>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{item.description}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
