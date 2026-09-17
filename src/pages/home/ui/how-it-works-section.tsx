/**
 * Details the 4 core game sense learning areas across Watchpoint.
 *
 * Implements `HowItWorksSection` within `src/pages/home/ui/`, rendering responsive cards
 * covering Strategy, Tactics, Awareness, and Tracking.
 */
import { Activity, Compass, Eye, Swords } from "lucide-react";

const LEARNING_AREAS = [
	{
		description: "Pre-fight positioning, win-conditions, and lose-conditions.",
		icon: Compass,
		number: "01",
		title: "Strategy",
	},
	{
		description: "Mid-fight opportunities and cooldown usage.",
		icon: Swords,
		number: "02",
		title: "Tactics",
	},
	{
		description: "Spatial awareness and positional tracking.",
		icon: Eye,
		number: "03",
		title: "Awareness",
	},
	{
		description: "Ultimate and ability tracking.",
		icon: Activity,
		number: "04",
		title: "Tracking",
	},
] as const;

export function HowItWorksSection() {
	return (
		<section className="space-y-10 py-12 sm:py-16">
			<div className="space-y-3 text-center">
				<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					How Watchpoint Works
				</h2>
				<p className="mx-auto max-w-2xl text-base text-muted-foreground">
					Four core areas designed to sharpen your competitive instincts and
					decision-making.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{LEARNING_AREAS.map((area) => {
					const Icon = area.icon;
					return (
						<div
							className="relative flex flex-col justify-between rounded-lg border border-border bg-card p-6 shadow-sm"
							key={area.title}
						>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
										<Icon className="h-5 w-5" />
									</div>
									<span className="font-mono text-xs font-bold text-muted-foreground/60">
										{area.number}
									</span>
								</div>
								<h3 className="text-lg font-semibold text-card-foreground">
									{area.title}
								</h3>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{area.description}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
