/**
 * Presents the primary value proposition, tactical hook, and initial action triggers for the Watchpoint platform.
 *
 * Implements `HeroSection` within `src/pages/home/ui/`, rendering high-impact competitive copy,
 * key feature badges, and primary action triggers for starting training or trying the interactive demo.
 */
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Crosshair, Sparkles, Zap } from "lucide-react";
import { type MouseEvent, useCallback, useState } from "react";
import { FIXTURE_IDS } from "@/shared/db";
import { authClient } from "@/shared/lib/auth-client";
import { AuthModal } from "@/shared/ui/auth-modal";

export interface HeroSectionProps {
	demoVodId?: string;
	registrationEnabled?: boolean;
}

export function HeroSection({
	demoVodId = FIXTURE_IDS.vod,
	registrationEnabled = true,
}: HeroSectionProps = {}) {
	const [authOpen, setAuthOpen] = useState(false);
	const session = authClient.useSession();
	const navigate = useNavigate();

	const handleStartTraining = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			if (!session.data?.user) {
				event.preventDefault();
				setAuthOpen(true);
			}
		},
		[session.data?.user],
	);

	const handleAuthenticated = useCallback(() => {
		navigate({ to: "/vods" });
	}, [navigate]);

	return (
		<section className="relative overflow-hidden py-12 text-center sm:py-20 lg:py-24">
			<div className="mx-auto max-w-4xl space-y-8">
				<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
					Improve Your Decision Making.
					<span className="block text-primary">Win More Games.</span>
				</h1>

				<p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-xl">
					Structured practice to help you climb. Refine your decision-making,
					test your awareness, and get instant feedback.
				</p>

				<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
					<Link
						className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
						onClick={handleStartTraining}
						to="/vods"
					>
						<span>Start Training</span>
						<ArrowRight className="h-4 w-4" />
					</Link>
					<Link
						className="inline-flex h-12 w-full items-center justify-center rounded-md border border-border bg-card px-8 text-base font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
						params={{ id: demoVodId }}
						to="/vods/$id"
					>
						Try It Now
					</Link>
				</div>

				<div className="pt-6">
					<div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-muted-foreground sm:gap-8">
						<span className="flex items-center gap-1.5">
							<Crosshair className="h-4 w-4 text-primary" />
							Authentic Top 500 VODs
						</span>
						<span className="flex items-center gap-1.5">
							<Zap className="h-4 w-4 text-primary" />
							Real-Time Decision Drills
						</span>
						<span className="flex items-center gap-1.5">
							<Sparkles className="h-4 w-4 text-primary" />
							Instant Tactical Feedback
						</span>
					</div>
				</div>
			</div>

			<AuthModal
				onOpenChange={setAuthOpen}
				onSuccess={handleAuthenticated}
				open={authOpen}
				registrationEnabled={registrationEnabled}
			/>
		</section>
	);
}
