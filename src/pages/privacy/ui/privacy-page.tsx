/**
 * Presentation component for the Watchpoint platform Privacy Statement.
 *
 * Implements `PrivacyPage` wrapped in `AppLayout`, rendering structured briefing sections
 * adapted from standard open-source GDPR privacy notice templates (CC BY-SA 4.0).
 */
import {
	Database,
	Eye,
	FileText,
	Info,
	Lock,
	Scale,
	ShieldCheck,
	UserCheck,
} from "lucide-react";
import { AppLayout } from "@/widgets/layout-main";
import type { PrivacyPageProps } from "../model/types";

export function PrivacyPage(props?: PrivacyPageProps) {
	return (
		<AppLayout registrationEnabled={props?.registrationEnabled ?? true}>
			<div className="mx-auto max-w-4xl space-y-10 py-6 sm:py-12">
				{/* Header Section */}
				<header className="space-y-4 text-center">
					<p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
						Watchpoint / Legal & Compliance
					</p>
					<h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
						Privacy Statement
					</h1>
					<p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
						Transparency and data protection are fundamental to our platform.
						This privacy statement outlines how Watchpoint collects, uses,
						stores, and protects your personal data in compliance with GDPR and
						standard privacy regulations.
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
							We do not sell personal data, run advertising networks, or deploy
							third-party marketing tracking pixels.
						</p>
					</div>

					<div className="rounded-lg border border-border bg-card p-5 shadow-xs">
						<div className="flex items-center gap-3">
							<div className="rounded-md bg-primary/10 p-2 text-primary">
								<Database className="h-5 w-5" />
							</div>
							<h2 className="text-sm font-semibold text-foreground">
								Edge-Native Security
							</h2>
						</div>
						<p className="mt-2 text-xs text-muted-foreground leading-relaxed">
							Data is processed through isolated Cloudflare Workers and stored
							in encrypted Cloudflare D1 databases.
						</p>
					</div>

					<div className="rounded-lg border border-border bg-card p-5 shadow-xs">
						<div className="flex items-center gap-3">
							<div className="rounded-md bg-primary/10 p-2 text-primary">
								<Lock className="h-5 w-5" />
							</div>
							<h2 className="text-sm font-semibold text-foreground">
								Player Data Rights
							</h2>
						</div>
						<p className="mt-2 text-xs text-muted-foreground leading-relaxed">
							Full rights to access, rectify, export, or permanently erase your
							account and training history records.
						</p>
					</div>
				</div>

				{/* Detailed Sections */}
				<div className="space-y-8">
					{/* Section 1: Scope & Controller */}
					<section className="rounded-lg border border-border bg-card p-6 shadow-xs space-y-4">
						<div className="flex items-center gap-3 border-b border-border pb-3">
							<Info className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-semibold text-card-foreground">
								1. Who We Are and Scope
							</h2>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							This Privacy Statement applies to all services and web
							applications provided by Watchpoint, an interactive tactical VOD
							training platform. Watchpoint acts as the data controller
							responsible for your personal information collected through our
							website and training engine.
						</p>
					</section>

					{/* Section 2: Information We Collect */}
					<section className="rounded-lg border border-border bg-card p-6 shadow-xs space-y-4">
						<div className="flex items-center gap-3 border-b border-border pb-3">
							<UserCheck className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-semibold text-card-foreground">
								2. Information We Collect
							</h2>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							We collect information only where necessary to provide, secure,
							and improve our tactical training services.
						</p>
						<div className="space-y-3 text-sm text-muted-foreground">
							<div>
								<h3 className="font-semibold text-foreground">
									A. Information You Provide Directly
								</h3>
								<ul className="list-disc pl-5 mt-1 space-y-1">
									<li>
										<strong>Account Details:</strong> Email address, username /
										display name, and cryptographically salted and hashed
										passwords when registering.
									</li>
									<li>
										<strong>Profile & Preferences:</strong> User settings, theme
										preferences, and role assignments (Player or Administrator).
									</li>
								</ul>
							</div>
							<div>
								<h3 className="font-semibold text-foreground">
									B. Information Collected Automatically
								</h3>
								<ul className="list-disc pl-5 mt-1 space-y-1">
									<li>
										<strong>Training Telemetry:</strong> Scenario decisions,
										timestamped multiple-choice submissions, response latencies,
										and playthrough completion outcomes.
									</li>
									<li>
										<strong>Technical Logs:</strong> IP address (for security
										and rate-limiting), browser type, and access timestamps.
									</li>
									<li>
										<strong>Cookies & Session State:</strong> Strictly necessary{" "}
										<code>HttpOnly</code> cookies for authenticated session
										management and local storage for UI state persistence.
									</li>
								</ul>
							</div>
						</div>
					</section>

					{/* Section 3: Legal Basis & Purpose */}
					<section className="rounded-lg border border-border bg-card p-6 shadow-xs space-y-4">
						<div className="flex items-center gap-3 border-b border-border pb-3">
							<Scale className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-semibold text-card-foreground">
								3. How and Why We Use Your Information
							</h2>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Under the General Data Protection Regulation (GDPR), we process
							personal data under the following lawful bases:
						</p>
						<ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
							<li>
								<strong>Performance of Contract:</strong> To create and manage
								your player account, deliver interactive VOD scenarios, and
								record your playthrough progress.
							</li>
							<li>
								<strong>Legitimate Interests:</strong> To protect platform
								integrity, prevent unauthorized administrative access, enforce
								rate limits, and audit administrative actions.
							</li>
							<li>
								<strong>Legal Compliance:</strong> To meet applicable legal and
								regulatory recordkeeping requirements.
							</li>
						</ul>
					</section>

					{/* Section 4: Data Sharing & Third Parties */}
					<section className="rounded-lg border border-border bg-card p-6 shadow-xs space-y-4">
						<div className="flex items-center gap-3 border-b border-border pb-3">
							<Eye className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-semibold text-card-foreground">
								4. Data Sharing and Third Parties
							</h2>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							We do not sell, rent, or monetize your personal information. Data
							is shared only with trusted infrastructure subprocessors strictly
							necessary to run the service:
						</p>
						<ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
							<li>
								<strong>Cloudflare:</strong> Edge compute (Workers), database
								storage (D1), and media asset hosting (R2) under strict Data
								Processing Agreements.
							</li>
							<li>
								<strong>Legal Demands:</strong> We disclose information only if
								compelled by lawful court orders or binding regulatory requests.
							</li>
						</ul>
					</section>

					{/* Section 5: Data Retention & Deletion */}
					<section className="rounded-lg border border-border bg-card p-6 shadow-xs space-y-4">
						<div className="flex items-center gap-3 border-b border-border pb-3">
							<FileText className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-semibold text-card-foreground">
								5. Data Retention Policies
							</h2>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							We retain personal information only for as long as needed to
							fulfill the purposes described in this policy:
						</p>
						<ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
							<li>
								<strong>Active Accounts:</strong> User profiles and associated
								playthrough records are retained while your account remains
								active.
							</li>
							<li>
								<strong>Audit Logs:</strong> Operational security logs and
								administrative mutation audit trails are retained for security
								forensics and compliance.
							</li>
							<li>
								<strong>Account Erasure:</strong> When an account is deleted,
								personal identifiers and playthrough records are permanently
								removed from production databases.
							</li>
						</ul>
					</section>

					{/* Section 6: Rights & Choices */}
					<section className="rounded-lg border border-border bg-card p-6 shadow-xs space-y-4">
						<div className="flex items-center gap-3 border-b border-border pb-3">
							<Lock className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-semibold text-card-foreground">
								6. Your Data Protection Rights (GDPR / Privacy Laws)
							</h2>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Depending on your location, you hold statutory rights regarding
							your personal data:
						</p>
						<ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
							<li>
								<strong>Right of Access:</strong> Request a copy of the personal
								data we hold about you.
							</li>
							<li>
								<strong>Right to Rectification:</strong> Request correction of
								inaccurate or incomplete profile details.
							</li>
							<li>
								<strong>
									Right to Erasure (&quot;Right to be Forgotten&quot;):
								</strong>{" "}
								Request the permanent deletion of your personal account data.
							</li>
							<li>
								<strong>Right to Data Portability:</strong> Obtain your training
								metrics and history in a structured, machine-readable format.
							</li>
							<li>
								<strong>Right to Object or Restrict Processing:</strong> Object
								to or restrict processing under certain circumstances.
							</li>
						</ul>
					</section>
				</div>
			</div>
		</AppLayout>
	);
}
