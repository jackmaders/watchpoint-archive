/**
 * End-of-session performance summary modal presented upon completing an interactive VOD playthrough.
 *
 * Implements `SessionSummaryPanel` rendering accuracy tiers, median latency stats, per-module performance breakdowns,
 * guest post-demo registration triggers, and retry/exit call-to-actions.
 */
"use client";

import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MODULE_MAP } from "@/entities/vod";
import { AuthModal } from "@/shared/ui/auth-modal";
import type { SessionSummaryReport } from "../model/summary";
import type { ModuleType } from "../model/types";

export interface SessionSummaryPanelProps {
	isDemo?: boolean;
	onExit: () => void;
	onRetry: () => void;
	registrationEnabled?: boolean;
	summary: SessionSummaryReport;
}

interface RankThreshold {
	badgeClass: string;
	label: string;
	minAccuracy: number;
}

const RANK_THRESHOLDS: RankThreshold[] = [
	{
		badgeClass: "bg-secondary text-secondary-foreground border-border",
		label: "Grandmaster",
		minAccuracy: 90,
	},
	{
		badgeClass: "bg-accent text-accent-foreground border-border",
		label: "Master",
		minAccuracy: 75,
	},
	{
		badgeClass: "bg-primary/10 text-primary border-primary/40",
		label: "Diamond",
		minAccuracy: 60,
	},
	{
		badgeClass: "bg-accent text-accent-foreground border-border",
		label: "Platinum",
		minAccuracy: 40,
	},
];

const DEFAULT_RANK: RankThreshold = {
	badgeClass: "bg-destructive/10 text-destructive border-destructive/40",
	label: "Needs Practice",
	minAccuracy: 0,
};

function getRankBadge(accuracyPercentage: number): RankThreshold {
	return (
		RANK_THRESHOLDS.find(
			(threshold) => accuracyPercentage >= threshold.minAccuracy,
		) ?? DEFAULT_RANK
	);
}

export function SessionSummaryPanel({
	isDemo = false,
	onExit,
	onRetry,
	registrationEnabled = true,
	summary,
}: SessionSummaryPanelProps) {
	const containerRef = useRef<HTMLElement | null>(null);
	const [authOpen, setAuthOpen] = useState(false);
	const rank = getRankBadge(summary.accuracyPercentage);
	const openAuthModal = useCallback(() => setAuthOpen(true), []);

	useEffect(() => {
		containerRef.current?.focus();
	}, []);

	const attemptedModules = (
		Object.entries(summary.moduleBreakdown) as [
			ModuleType,
			SessionSummaryReport["moduleBreakdown"][ModuleType],
		][]
	).filter(([, stats]) => stats.total > 0);

	return (
		<section
			aria-label="Session Performance Summary"
			aria-live="polite"
			className="rounded-lg border border-border bg-card p-4 sm:p-6 md:p-8 shadow-lg space-y-8 max-w-3xl mx-auto text-card-foreground outline-none"
			ref={containerRef}
			tabIndex={-1}
		>
			<header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<span className="text-xs font-bold tracking-widest text-primary uppercase font-mono">
							{isDemo ? "Demo Complete" : "Session Complete"}
						</span>
						<span
							className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md border ${rank.badgeClass}`}
						>
							{rank.label}
						</span>
					</div>
					<h2 className="text-2xl sm:text-3xl font-extrabold text-card-foreground tracking-tight">
						{isDemo ? "Interactive Demo Summary" : "Performance Summary"}
					</h2>
				</div>
			</header>

			{isDemo ? (
				<div className="rounded-lg border border-primary/40 bg-gradient-to-br from-card via-card to-primary/10 p-6 space-y-4 shadow-sm">
					<div className="flex items-center gap-2.5">
						<Sparkles className="h-5 w-5 text-primary" />
						<h3 className="text-lg font-bold text-card-foreground">
							Save Your Scores & Access Full Training
						</h3>
					</div>
					<p className="text-sm text-muted-foreground leading-relaxed">
						Create a free account to save your match playthroughs, track your
						tactical decision accuracy over time, and explore our complete
						catalog of Grandmaster scenarios.
					</p>
					<div className="flex flex-wrap items-center gap-3 pt-1">
						<button
							className="px-5 py-2.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold shadow-md shadow-primary/20 transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							onClick={openAuthModal}
							type="button"
						>
							Sign In / Create Account
						</button>
						<Link
							className="px-5 py-2.5 rounded-md border border-input bg-secondary hover:bg-accent hover:text-accent-foreground text-secondary-foreground text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							to="/vods"
						>
							Explore Full Catalog
						</Link>
					</div>
					<AuthModal
						defaultMode="register"
						onOpenChange={setAuthOpen}
						open={authOpen}
						registrationEnabled={registrationEnabled}
					/>
				</div>
			) : null}

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="p-4 sm:p-5 rounded-lg border border-border bg-background/60 flex flex-col justify-between space-y-2">
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Overall Accuracy
					</span>
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-extrabold text-foreground font-mono">
							{summary.accuracyPercentage}%
						</span>
						<span className="text-xs text-muted-foreground font-medium">
							{summary.correctCount} / {summary.totalScenarios} Correct
						</span>
					</div>
				</div>

				<div className="p-4 sm:p-5 rounded-lg border border-border bg-background/60 flex flex-col justify-between space-y-2">
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Avg Response Latency
					</span>
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-extrabold text-foreground font-mono">
							{summary.averageLatencyMs} ms
						</span>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
					Module Breakdown
				</h3>

				{attemptedModules.length === 0 ? (
					<div className="p-6 text-center text-sm text-muted-foreground rounded-lg border border-border bg-background/30">
						No scenario breakdown available
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{attemptedModules.map(([moduleKey, stats]) => {
							const moduleDef = MODULE_MAP[moduleKey];

							return (
								<div
									className="p-4 rounded-lg border border-border bg-background/40 flex flex-col justify-between space-y-3"
									key={moduleKey}
								>
									<div className="flex items-center justify-between">
										<span
											className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${moduleDef.badge}`}
										>
											{moduleDef.label}
										</span>
										<span className="text-xs font-mono font-semibold text-muted-foreground">
											{`${stats.correct} / ${stats.total} (${stats.accuracyPercentage}%)`}
										</span>
									</div>
									<div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
										<span>Response speed:</span>
										<span className="font-mono text-foreground">
											{stats.averageLatencyMs} ms avg
										</span>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			<footer className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-end gap-3">
				<button
					className="w-full sm:w-auto px-5 py-2.5 rounded-md border border-input bg-secondary hover:bg-accent hover:text-accent-foreground text-secondary-foreground text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					onClick={onExit}
					type="button"
				>
					{isDemo ? "Exit Demo" : "Return to VOD"}
				</button>
				<button
					className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
					onClick={onRetry}
					type="button"
				>
					{isDemo ? "Retry Demo Scenario" : "Retry Training Session"}
				</button>
			</footer>
		</section>
	);
}
