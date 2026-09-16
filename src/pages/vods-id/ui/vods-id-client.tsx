/**
 * Interactive client coordinator for the pre-session VOD overview and module selection.
 *
 * Implements `VodsIdClient` managing module filter selection state, auth gate modals (`AuthModal`),
 * scenario count recalculations, and session playthrough launch URLs.
 */
"use client";

import { Link, useNavigate } from "@tanstack/react-router";
import { type MouseEvent, useCallback, useMemo, useState } from "react";
import {
	calculateModuleCounts,
	filterScenariosByModules,
	MODULE_DEFINITIONS,
	ModuleFilterPills,
	type ModuleType,
	type SessionManifest,
	serializeModulesParam,
} from "@/entities/vod";
import { authClient } from "@/shared/lib/auth-client";
import { AuthModal } from "@/shared/ui/auth-modal";

export interface VodsIdClientProps {
	registrationEnabled?: boolean;
	vod: SessionManifest;
}

export function VodsIdClient({
	registrationEnabled = true,
	vod,
}: VodsIdClientProps) {
	const [playthroughId] = useState(() => crypto.randomUUID());
	const [activeModules, setActiveModules] = useState<ModuleType[]>(() =>
		MODULE_DEFINITIONS.map((def) => def.key),
	);
	const [authOpen, setAuthOpen] = useState(false);
	const session = authClient.useSession();
	const navigate = useNavigate();
	const handleStart = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			if (activeModules.length === 0) {
				event.preventDefault();
				return;
			}
			if (!session.data?.user) {
				event.preventDefault();
				setAuthOpen(true);
			}
		},
		[activeModules.length, session.data?.user],
	);
	const handleAuthenticated = useCallback(() => {
		navigate({
			params: { id: vod.id },
			search: { modules: serializeModulesParam(activeModules), playthroughId },
			to: "/vods/$id/session",
		});
	}, [activeModules, navigate, playthroughId, vod.id]);

	const availableCounts = useMemo(
		() => calculateModuleCounts(vod.scenarios),
		[vod.scenarios],
	);

	const matchingScenarioCount = useMemo(
		() => filterScenariosByModules(vod.scenarios, activeModules).length,
		[vod.scenarios, activeModules],
	);

	return (
		<div className="space-y-6 sm:space-y-8">
			<div className="rounded-lg border border-border bg-card p-4 sm:p-6 md:p-8 shadow-sm space-y-6">
				<div className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-6">
					<div>
						<h2 className="text-2xl font-bold text-card-foreground">
							Configure Scenario Modules
						</h2>
						<p className="text-muted-foreground text-sm mt-1">
							Toggle target skills to customize your interactive training
							timeline.
						</p>
					</div>

					<div className="flex items-center gap-3">
						<span className="text-xs font-medium text-muted-foreground">
							Active Scenarios:
						</span>
						<span className="px-3 py-1 bg-primary/10 border border-primary/40 text-primary font-bold text-sm rounded-md font-mono">
							{matchingScenarioCount} / {vod.scenarios.length}
						</span>
					</div>
				</div>

				<ModuleFilterPills
					availableCounts={availableCounts}
					onChange={setActiveModules}
					selectedModules={activeModules}
				/>

				<div className="sticky bottom-0 z-10 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 md:-mx-8 md:-mb-8 p-4 sm:p-6 md:p-8 rounded-b-lg border-t border-border bg-card/95 backdrop-blur flex items-center justify-between flex-wrap gap-4">
					<div className="text-xs text-muted-foreground">
						<span>
							{activeModules.length} module
							{activeModules.length !== 1 ? "s" : ""} selected
						</span>
					</div>

					<Link
						className={`inline-flex items-center justify-center px-6 py-3 rounded-md font-bold text-sm transition-all shadow-sm ${
							activeModules.length > 0
								? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
								: "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
						}`}
						disabled={activeModules.length === 0}
						onClick={handleStart}
						params={{ id: vod.id }}
						search={{
							modules: serializeModulesParam(activeModules),
							playthroughId,
						}}
						to="/vods/$id/session"
					>
						Start Training Session
					</Link>
					<AuthModal
						onOpenChange={setAuthOpen}
						onSuccess={handleAuthenticated}
						open={authOpen}
						registrationEnabled={registrationEnabled}
					/>
				</div>
			</div>
		</div>
	);
}
