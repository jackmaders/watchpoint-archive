/**
 * Provides the top-level responsive layout shell integrating top navigation and sidebar drawers
 * across public catalog, history, and user dashboard views.
 *
 * Implements `AppLayout` within `src/widgets/layout-main` according to Feature-Sliced Design.
 * Composes the `Navbar` and `Sidebar` components, orchestrates responsive drawer states via Radix UI
 * dialog primitives, conditionally renders the navigation sidebar and mobile toggle for authenticated players,
 * and provides fluid desktop sidebar collapse interactions.
 */

import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { authClient } from "@/shared/lib/auth-client";
import { MobileNavDrawer } from "./mobile-nav-drawer";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

export interface AppLayoutProps {
	children?: ReactNode;
	registrationEnabled?: boolean;
}

export function AppLayout({
	children,
	registrationEnabled = true,
}: AppLayoutProps) {
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const session = authClient.useSession();
	const isLoggedIn = Boolean(session.data?.user);

	const toggleMobileSidebar = useCallback(() => {
		setIsMobileOpen((prev) => !prev);
	}, []);

	const closeMobileSidebar = useCallback(() => {
		setIsMobileOpen(false);
	}, []);

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col">
			<Navbar
				isMobileSidebarOpen={isMobileOpen}
				onToggleMobileSidebar={toggleMobileSidebar}
				registrationEnabled={registrationEnabled}
				showSidebarToggle={isLoggedIn}
			/>

			{/* Mobile Drawer */}
			{isLoggedIn ? (
				<MobileNavDrawer
					onClose={closeMobileSidebar}
					onOpenChange={setIsMobileOpen}
					open={isMobileOpen}
				/>
			) : null}

			<div className="flex flex-1">
				{/* Desktop Sidebar */}
				{isLoggedIn ? <Sidebar className="hidden md:flex" /> : null}

				{/* Page Content & Footer */}
				<div className="flex flex-1 flex-col min-w-0">
					<main className="flex-1 w-full p-4 sm:p-6 lg:p-8">{children}</main>
					<footer className="border-t border-border bg-card/40 px-4 py-4 sm:px-6 lg:px-8 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
						<span>
							Watchpoint Overwatch 2 tactical decision training engine.
						</span>
						<div className="flex items-center gap-4">
							<Link
								className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
								to="/privacy"
							>
								Privacy Statement
							</Link>
						</div>
					</footer>
				</div>
			</div>
		</div>
	);
}
