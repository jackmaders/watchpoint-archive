/**
 * Renders the responsive slide-over drawer containing the navigation sidebar for mobile viewports.
 *
 * Implements `MobileNavDrawer` within `src/widgets/layout-main` according to Feature-Sliced Design.
 * Wraps Radix UI `Dialog` primitives with animated slide-in transitions, an accessible title,
 * and a header close button, embedding `Sidebar` configured for full-width mobile navigation.
 */

import { X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Sidebar } from "./sidebar";

export interface MobileNavDrawerProps {
	onClose: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export function MobileNavDrawer({
	onClose,
	onOpenChange,
	open,
}: MobileNavDrawerProps) {
	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent
				className="fixed inset-y-0 left-0 top-0 z-50 h-full w-72 max-w-[80vw] translate-x-0 translate-y-0 rounded-none border-r border-border bg-card p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-xs"
				showCloseButton={false}
			>
				<DialogTitle className="sr-only">Mobile Navigation</DialogTitle>
				<div className="flex h-16 items-center justify-between border-b border-border px-4">
					<span className="font-mono text-sm font-bold uppercase tracking-wider text-primary">
						Navigation Menu
					</span>
					<Button
						aria-label="Close navigation menu"
						onClick={onClose}
						size="icon"
						type="button"
						variant="ghost"
					>
						<X className="h-5 w-5" />
					</Button>
				</div>
				<Sidebar
					className="static h-[calc(100%-4rem)] w-full border-r-0 bg-transparent"
					onNavClick={onClose}
					showCollapseToggle={false}
				/>
			</DialogContent>
		</Dialog>
	);
}
