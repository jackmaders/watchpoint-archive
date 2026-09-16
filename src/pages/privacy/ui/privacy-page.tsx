/**
 * Presentation component for the Watchpoint platform Privacy Statement.
 *
 * Implements `PrivacyPage` wrapped in `AppLayout`, rendering structured briefing sections
 * covering account authentication, training playthrough metrics, session storage, and data retention policies.
 */
import { Database, FileText, Lock, ShieldCheck, UserCheck } from "lucide-react";
import { AppLayout } from "@/widgets/layout-main";
import type { PrivacyPageProps } from "../model/types";

export function PrivacyPage(props?: PrivacyPageProps) {
	return (
		<AppLayout registrationEnabled={props?.registrationEnabled ?? true}>
			<div className="mx-auto max-w-4xl space-y-10 py-6 sm:py-12">
				{/* Header Section */}
				<header className="space-y-4 text-center">
					<p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
						Watchpoint / Security & Compliance
					</p>
					<h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
						Privacy Statement
					</h1>
					<p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
						Transparent overview of our data collection practices, tactical
						training telemetry, local storage invariants, and privacy
						protections across the Watchpoint platform.
					</p>
				</header>

				{/* Quick Summary Grid */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="rounded-lg border border-border bg-card p-5 shadow-xs">
						<div className="flex items-center gap-3">
							<div className="rounded-md bg-primary/10 p-2 text-primary">
								<ShieldCheck className="h-5 w-5" />
							</div>
							<h2 className="text-sm font-semibold text-foreground">
								Zero Ad Tracking
							</h2>
						</div>
						<p className="mt-2 text-xs text-muted-foreground leading-relaxed">
							No third-party advertising trackers, marketing pixels, or sale of
							player behavioral data.
						</p>
					</div>

					<div className="rounded-lg border border-border bg-card p-5 shadow-xs">
						<div className="flex items-center gap-3">
							<div className="rounded-md bg-primary/10 p-2 text-primary">
								<Database className="h-5 w-5" />
							</div>
							<h2 className="text-sm font-semibold text-foreground">
								Edge-Native Isolation
							</h2>
						</div>
						<p className="mt-2 text-xs text-muted-foreground leading-relaxed">
							All decision manifests and auth tokens are processed securely via
							Cloudflare edge runtime and D1.
						</p>
					</div>

					<div className="rounded-lg border border-border bg-card p-5 shadow-xs">
						<div className="flex items-center gap-3">
							<div className="rounded-md bg-primary/10 p-2 text-primary">
								<Lock className="h-5 w-5" />
							</div>
							<h2 className="text-sm font-semibold text-foreground">
								Player Control
							</h2>
						</div>
						<p className="mt-2 text-xs text-muted-foreground leading-relaxed">
							Direct access to your attempt histories and guaranteed right to
							account and data erasure.
						</p>
					</div>
				</div>

				{/* Detailed Sections */}
				<div className="space-y-8">
					{/* Section 1: Account Identity */}
					<section className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
						<div className="flex items-center gap-3 border-b border-border pb-3">
							<UserCheck className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-semibold text-card-foreground">
								1. Account Identity & Authentication
							</h2>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							When you create an account or sign in to Watchpoint,
							authentication data is managed through our Better Auth
							integration. We collect and securely store only the minimum
							information necessary to identify your player profile:
						</p>
						<ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
							<li>
								<strong className="text-foreground">Player Identity:</strong>{" "}
								Your registered email address, display name, and unique user ID.
							</li>
							<li>
								<strong className="text-foreground">Credentials:</strong>{" "}
								Cryptographically salted and hashed passwords, or OAuth account
								identifiers if using external identity providers.
							</li>
							<li>
								<strong className="text-foreground">Role & Permissions:</strong>{" "}
								Role assignments (such as Player or Administrator) controlling
								access to catalog management and authoring tooling.
							</li>
						</ul>
					</section>

					{/* Section 2: Attempt & Decision Metrics */}
					<section className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
						<div className="flex items-center gap-3 border-b border-border pb-3">
							<FileText className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-semibold text-card-foreground">
								2. Training Attempt & Decision Telemetry
							</h2>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Watchpoint operates an interactive decision-training engine.
							During VOD playthrough sessions, we collect tactical telemetry to
							track your learning progression:
						</p>
						<ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
							<li>
								<strong className="text-foreground">
									Playthrough Manifests:
								</strong>{" "}
								Timestamped scenario checkpoints, selected multiple-choice
								actions, and response latency.
							</li>
							<li>
								<strong className="text-foreground">
									Performance Metrics:
								</strong>{" "}
								Calculated accuracy scores, module completion indicators, and
								historical aggregate statistics displayed in your Training
								History dashboard.
							</li>
							<li>
								<strong className="text-foreground">Session Ownership:</strong>{" "}
								Playthrough records are linked strictly to your authenticated
								user record and are never accessible by other non-admin players.
							</li>
						</ul>
					</section>

					{/* Section 3: Session & Local Storage */}
					<section className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
						<div className="flex items-center gap-3 border-b border-border pb-3">
							<Database className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-semibold text-card-foreground">
								3. Session State & Local Storage
							</h2>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							We utilize modern browser storage and HTTP cookies exclusively for
							essential application functionality:
						</p>
						<ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
							<li>
								<strong className="text-foreground">
									Authentication Cookies:
								</strong>{" "}
								Secure, HttpOnly, SameSite cookies to maintain your signed-in
								session across requests.
							</li>
							<li>
								<strong className="text-foreground">UI Preferences:</strong>{" "}
								Local browser storage to persist client preferences such as
								sidebar collapsed states and theme settings.
							</li>
							<li>
								<strong className="text-foreground">Query Cache:</strong>{" "}
								In-memory client-side cache managed by TanStack Query for fast
								and responsive page navigation.
							</li>
						</ul>
					</section>

					{/* Section 4: Data Retention & Rights */}
					<section className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
						<div className="flex items-center gap-3 border-b border-border pb-3">
							<Lock className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-semibold text-card-foreground">
								4. Data Retention & Player Rights
							</h2>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							We respect your sovereignty over your data. Our operational
							retention policies follow strict guidelines:
						</p>
						<ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
							<li>
								<strong className="text-foreground">Retention Policy:</strong>{" "}
								Player accounts and playthrough telemetry are retained as long
								as your account remains active. Administrative audit logs are
								stored for operational security and forensic review.
							</li>
							<li>
								<strong className="text-foreground">Right to Erasure:</strong>{" "}
								You have the right to request full deletion of your account and
								all associated playthrough attempt records from our database.
							</li>
							<li>
								<strong className="text-foreground">Data Portability:</strong>{" "}
								You may view and review your complete historical performance
								data at any time within the Training History section.
							</li>
						</ul>
					</section>
				</div>
			</div>
		</AppLayout>
	);
}
