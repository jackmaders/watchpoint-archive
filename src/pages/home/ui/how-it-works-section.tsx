/**
 * Details the four-step interactive training methodology and core user journey across Watchpoint.
 *
 * Implements `HowItWorksSection` within `src/pages/home/ui/`, rendering responsive step cards
 * that describe the interactive decision lifecycle from match selection to post-scenario analysis.
 */
import { BarChart3, Crosshair, Target, Zap } from "lucide-react";

const STEPS = [
	{
		description:
			"Study high-stakes fight moments selected from Grandmaster and Top 500 competitive matches.",
		icon: Crosshair,
		number: "01",
		title: "Curated Match Scenarios",
	},
	{
		description:
			"The video pauses at high-pressure junctures. Choose your positioning, target priority, or cooldown usage.",
		icon: Target,
		number: "02",
		title: "Interactive Decision Moments",
	},
	{
		description:
			"Receive immediate coaching feedback comparing your selection against the optimal play.",
		icon: Zap,
		number: "03",
		title: "Instant Tactical Breakdown",
	},
	{
		description:
			"Track decision accuracy, role-specific strengths, and tactical speed over time to climb the ranks.",
		icon: BarChart3,
		number: "04",
		title: "Track Game Sense Mastery",
	},
] as const;

export function HowItWorksSection() {
	return (
		<section className="space-y-10 py-12 sm:py-16">
			<div className="space-y-3 text-center">
				<p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
					Tactical Training Loop
				</p>
				<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					How Watchpoint Works
				</h2>
				<p className="mx-auto max-w-2xl text-base text-muted-foreground">
					Four deliberate steps to sharpen your competitive instincts and
					eliminate costly teamfight mistakes.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{STEPS.map((step) => {
					const Icon = step.icon;
					return (
						<div
							className="relative flex flex-col justify-between rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md"
							key={step.number}
						>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
										<Icon className="h-5 w-5" />
									</div>
									<span className="font-mono text-xs font-bold text-muted-foreground/60">
										{step.number}
									</span>
								</div>
								<h3 className="text-lg font-semibold text-card-foreground">
									{step.title}
								</h3>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{step.description}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
