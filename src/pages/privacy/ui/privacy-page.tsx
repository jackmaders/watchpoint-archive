/**
 * Presentation component for the Watchpoint platform Privacy Statement.
 *
 * Implements `PrivacyPage` wrapped in `AppLayout`, rendering a clean, readable,
 * document-structured privacy notice adapted from standard open-source GDPR privacy notice templates.
 */
import { AppLayout } from "@/widgets/layout-main";
import type { PrivacyPageProps } from "../model/types";

export function PrivacyPage(props?: PrivacyPageProps) {
	return (
		<AppLayout registrationEnabled={props?.registrationEnabled ?? true}>
			<article className="mx-auto max-w-3xl space-y-8 py-6 sm:py-10">
				{/* Document Header */}
				<header className="space-y-3 border-b border-border pb-6">
					<p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
						Watchpoint / Legal & Compliance
					</p>
					<h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						Privacy Statement
					</h1>
					<p className="text-base text-muted-foreground leading-relaxed">
						Transparency and data protection are fundamental to our platform.
						This privacy statement outlines how Watchpoint collects, uses,
						stores, and protects your personal data in compliance with GDPR and
						standard privacy regulations.
					</p>
				</header>

				{/* Document Body */}
				<div className="space-y-8">
					{/* Section 1: Scope & Controller */}
					<section className="space-y-3">
						<h2 className="text-xl font-semibold text-foreground">
							1. Who We Are and Scope
						</h2>
						<p className="text-sm text-muted-foreground leading-relaxed">
							This Privacy Statement applies to all services and web
							applications provided by Watchpoint, an interactive tactical VOD
							training platform. Watchpoint acts as the data controller
							responsible for your personal information collected through our
							website and training engine.
						</p>
					</section>

					{/* Section 2: Information We Collect */}
					<section className="space-y-4">
						<h2 className="text-xl font-semibold text-foreground">
							2. Information We Collect
						</h2>
						<p className="text-sm text-muted-foreground leading-relaxed">
							We collect information only where necessary to provide, secure,
							and improve our tactical training services.
						</p>
						<div className="space-y-3">
							<div>
								<h3 className="text-sm font-semibold text-foreground">
									A. Information You Provide Directly
								</h3>
								<ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-muted-foreground leading-relaxed">
									<li>
										<strong className="text-foreground">
											Account Details:
										</strong>{" "}
										Email address, username / display name, and
										cryptographically salted and hashed passwords when
										registering.
									</li>
									<li>
										<strong className="text-foreground">
											Profile & Preferences:
										</strong>{" "}
										User settings, theme preferences, and role assignments
										(Player or Administrator).
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-sm font-semibold text-foreground">
									B. Information Collected Automatically
								</h3>
								<ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-muted-foreground leading-relaxed">
									<li>
										<strong className="text-foreground">
											Training Telemetry:
										</strong>{" "}
										Scenario decisions, timestamped multiple-choice submissions,
										response latencies, and playthrough completion outcomes.
									</li>
									<li>
										<strong className="text-foreground">Technical Logs:</strong>{" "}
										IP address (for security and rate-limiting), browser type,
										and access timestamps.
									</li>
									<li>
										<strong className="text-foreground">
											Cookies & Session State:
										</strong>{" "}
										Strictly necessary{" "}
										<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
											HttpOnly
										</code>{" "}
										cookies for authenticated session management and local
										storage for UI state persistence.
									</li>
								</ul>
							</div>
						</div>
					</section>

					{/* Section 3: Legal Basis & Purpose */}
					<section className="space-y-3">
						<h2 className="text-xl font-semibold text-foreground">
							3. How and Why We Use Your Information
						</h2>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Under the General Data Protection Regulation (GDPR), we process
							personal data under the following lawful bases:
						</p>
						<ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground leading-relaxed">
							<li>
								<strong className="text-foreground">
									Performance of Contract:
								</strong>{" "}
								To create and manage your player account, deliver interactive
								VOD scenarios, and record your playthrough progress.
							</li>
							<li>
								<strong className="text-foreground">
									Legitimate Interests:
								</strong>{" "}
								To protect platform integrity, prevent unauthorized
								administrative access, enforce rate limits, and audit
								administrative actions.
							</li>
							<li>
								<strong className="text-foreground">Legal Compliance:</strong>{" "}
								To meet applicable legal and regulatory recordkeeping
								requirements.
							</li>
						</ul>
					</section>

					{/* Section 4: Data Sharing & Third Parties */}
					<section className="space-y-3">
						<h2 className="text-xl font-semibold text-foreground">
							4. Data Sharing and Third Parties
						</h2>
						<p className="text-sm text-muted-foreground leading-relaxed">
							We do not sell, rent, or monetize your personal information. Data
							is shared only with trusted infrastructure subprocessors strictly
							necessary to run the service:
						</p>
						<ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground leading-relaxed">
							<li>
								<strong className="text-foreground">Cloudflare:</strong> Edge
								compute (Workers), database storage (D1), and media asset
								hosting (R2) under strict Data Processing Agreements.
							</li>
							<li>
								<strong className="text-foreground">Legal Demands:</strong> We
								disclose information only if compelled by lawful court orders or
								binding regulatory requests.
							</li>
						</ul>
					</section>

					{/* Section 5: Data Retention Policies */}
					<section className="space-y-3">
						<h2 className="text-xl font-semibold text-foreground">
							5. Data Retention Policies
						</h2>
						<p className="text-sm text-muted-foreground leading-relaxed">
							We retain personal information only for as long as needed to
							fulfill the purposes described in this policy:
						</p>
						<ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground leading-relaxed">
							<li>
								<strong className="text-foreground">Active Accounts:</strong>{" "}
								User profiles and associated playthrough records are retained
								while your account remains active.
							</li>
							<li>
								<strong className="text-foreground">Audit Logs:</strong>{" "}
								Operational security logs and administrative mutation audit
								trails are retained for security forensics and compliance.
							</li>
							<li>
								<strong className="text-foreground">Account Erasure:</strong>{" "}
								When an account is deleted, personal identifiers and playthrough
								records are permanently removed from production databases.
							</li>
						</ul>
					</section>

					{/* Section 6: Rights & Choices */}
					<section className="space-y-3">
						<h2 className="text-xl font-semibold text-foreground">
							6. Your Data Protection Rights (GDPR / Privacy Laws)
						</h2>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Depending on your location, you hold statutory rights regarding
							your personal data:
						</p>
						<ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground leading-relaxed">
							<li>
								<strong className="text-foreground">Right of Access:</strong>{" "}
								Request a copy of the personal data we hold about you.
							</li>
							<li>
								<strong className="text-foreground">
									Right to Rectification:
								</strong>{" "}
								Request correction of inaccurate or incomplete profile details.
							</li>
							<li>
								<strong className="text-foreground">
									Right to Erasure (&quot;Right to be Forgotten&quot;):
								</strong>{" "}
								Request the permanent deletion of your personal account data.
							</li>
							<li>
								<strong className="text-foreground">
									Right to Data Portability:
								</strong>{" "}
								Obtain your training metrics and history in a structured,
								machine-readable format.
							</li>
							<li>
								<strong className="text-foreground">
									Right to Object or Restrict Processing:
								</strong>{" "}
								Object to or restrict processing under certain circumstances.
							</li>
						</ul>
					</section>
				</div>
			</article>
		</AppLayout>
	);
}
