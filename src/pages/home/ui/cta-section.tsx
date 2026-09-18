/**
 * Renders the concluding call-to-action banner with dual training action triggers.
 *
 * Implements `CtaSection` within `src/pages/home/ui/`, rendering an emphasized card
 * with high-contrast dual actions to authenticate or try the interactive demo VOD.
 */
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Trophy } from "lucide-react";
import { type MouseEvent, useCallback, useState } from "react";
import { AuthModal } from "@/features/authentication";
import { authClient } from "@/shared/auth";

export interface CtaSectionProps {
	demoVodId?: string;
	registrationEnabled?: boolean;
}

export function CtaSection({
	demoVodId: _demoVodId,
	registrationEnabled = true,
}: CtaSectionProps = {}) {
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
		<section className="py-12 sm:py-16">
			<div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-card via-card to-primary/10 p-8 text-center sm:p-12 lg:p-16">
				<div className="mx-auto max-w-2xl space-y-6">
					<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
						<Trophy className="h-6 w-6" />
					</div>

					<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						Ready to Level Up Your Game Sense?
					</h2>

					<p className="text-base text-muted-foreground sm:text-lg">
						Stop guessing during high-stakes teamfights. Start training your
						tactical instincts with authentic match scenarios today.
					</p>

					<div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
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
							to="/demo"
						>
							Try Interactive Demo
						</Link>
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
