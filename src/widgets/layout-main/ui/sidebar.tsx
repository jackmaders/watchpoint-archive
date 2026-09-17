/**
 * Renders the primary navigation sidebar containing catalog discovery, training performance history,
 * and role-gated administrative access links.
 *
 * Implements the `Sidebar` component within `src/widgets/layout-main` for the desktop drawer and mobile slide-over views.
 * Integrates with Better Auth session state to conditionally display administrative capabilities,
 * provides active route styling via TanStack Router `Link.activeProps`, and supports collapsed icon states.
 */

import { Link } from "@tanstack/react-router";
import {
	Compass,
	History,
	PanelLeft,
	PanelLeftClose,
	Shield,
} from "lucide-react";
import { useCallback, useState } from "react";
import { authClient } from "@/shared/lib/auth-client";
import { hasPermission, PERMISSIONS } from "@/shared/lib/permissions";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export interface SidebarProps {
	className?: string;
	defaultCollapsed?: boolean;
	onNavClick?: () => void;
	showCollapseToggle?: boolean;
}

interface NavItem {
	href: string;
	icon: typeof Compass;
	label: string;
	requireAdmin?: boolean;
}

const NAV_ITEMS: NavItem[] = [
	{
		href: "/vods",
		icon: Compass,
		label: "VOD Catalog",
	},
	{
		href: "/history",
		icon: History,
		label: "Training History",
	},
	{
		href: "/admin",
		icon: Shield,
		label: "Admin Panel",
		requireAdmin: true,
	},
];

export function Sidebar({
	className,
	defaultCollapsed = false,
	onNavClick,
	showCollapseToggle = true,
}: SidebarProps) {
	const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

	const toggleCollapse = useCallback(() => {
		setIsCollapsed((prev) => !prev);
	}, []);

	const session = authClient.useSession();
	const user = session.data?.user as { role?: string } | undefined;
	const userRole = user?.role;
	const isAdmin = hasPermission(userRole, PERMISSIONS.ADMIN_ACCESS);

	const visibleItems = NAV_ITEMS.filter(
		(item) => !item.requireAdmin || isAdmin,
	);

	return (
		<aside
			aria-label="Sidebar Navigation"
			className={cn(
				"sticky top-16 flex h-[calc(100vh-4rem)] flex-col overflow-y-auto border-r border-border bg-card/60 transition-[width] duration-200",
				isCollapsed ? "w-16" : "w-64",
				className,
			)}
		>
			{showCollapseToggle ? (
				<div
					className={cn(
						"flex h-12 items-center border-b border-border/60 px-3",
						isCollapsed ? "justify-center px-0" : "justify-between",
					)}
				>
					{!isCollapsed ? (
						<span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Navigation
						</span>
					) : null}
					<Button
						aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
						className="h-8 w-8 text-muted-foreground hover:text-foreground"
						onClick={toggleCollapse}
						size="icon"
						type="button"
						variant="ghost"
					>
						{isCollapsed ? (
							<PanelLeft className="h-4 w-4" />
						) : (
							<PanelLeftClose className="h-4 w-4" />
						)}
					</Button>
				</div>
			) : null}

			<nav className="flex-1 space-y-1.5 p-3">
				{visibleItems.map((item) => {
					const Icon = item.icon;
					return (
						<Link
							activeOptions={{ exact: false }}
							activeProps={{
								className:
									"bg-primary/10 text-primary font-semibold border-primary shadow-xs",
							}}
							aria-label={item.label}
							className={cn(
								"flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground border border-transparent",
								isCollapsed && "justify-center px-2",
							)}
							key={item.href}
							onClick={onNavClick}
							title={item.label}
							to={item.href}
						>
							<Icon className="h-5 w-5 shrink-0" />
							{!isCollapsed ? (
								<span className="truncate">{item.label}</span>
							) : null}
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
