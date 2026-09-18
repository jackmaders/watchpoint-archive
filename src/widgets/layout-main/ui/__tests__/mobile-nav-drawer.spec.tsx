import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router");
vi.mock("@/shared/lib/auth-client");

import { authClient } from "@/shared/lib/auth-client";
import { MobileNavDrawer } from "../mobile-nav-drawer";

describe("MobileNavDrawer", () => {
	it("renders navigation drawer and triggers onClose when close button is clicked", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: { user: { id: "u1", name: "Player One" } },
			isPending: false,
		} as never);
		const onClose = vi.fn();
		const onOpenChange = vi.fn();

		// Act
		render(
			<MobileNavDrawer
				onClose={onClose}
				onOpenChange={onOpenChange}
				open={true}
			/>,
		);

		// Assert - rendered
		expect(screen.getByRole("dialog")).toBeDefined();
		expect(screen.getByText("Navigation Menu")).toBeDefined();

		// Act - click close button
		const closeButton = screen.getByRole("button", {
			name: "Close navigation menu",
		});
		fireEvent.click(closeButton);

		// Assert - closed callback called
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("triggers onClose when a navigation link inside the drawer is clicked", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: { user: { id: "u1", name: "Player One" } },
			isPending: false,
		} as never);
		const onClose = vi.fn();
		const onOpenChange = vi.fn();
		render(
			<MobileNavDrawer
				onClose={onClose}
				onOpenChange={onOpenChange}
				open={true}
			/>,
		);

		// Act
		const navLink = screen.getByRole("link", { name: "VOD Catalog" });
		fireEvent.click(navLink);

		// Assert
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("keeps navigation at the top of the full-height drawer", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: { user: { id: "u1", name: "Player One" } },
			isPending: false,
		} as never);

		// Act
		render(
			<MobileNavDrawer onClose={vi.fn()} onOpenChange={vi.fn()} open={true} />,
		);

		// Assert
		const dialog = screen.getByRole("dialog");
		const sidebar = screen.getByRole("complementary", {
			name: "Sidebar Navigation",
		});
		expect(dialog.className.split(/\s+/)).toEqual(
			expect.arrayContaining(["flex", "flex-col", "justify-start", "gap-0"]),
		);
		expect(sidebar.className.split(/\s+/)).toEqual(
			expect.arrayContaining(["flex-1", "min-h-0", "overflow-y-auto"]),
		);
	});

	it("does not render dialog content when open is false", () => {
		// Arrange & Act
		render(
			<MobileNavDrawer onClose={vi.fn()} onOpenChange={vi.fn()} open={false} />,
		);

		// Assert
		expect(screen.queryByRole("dialog")).toBeNull();
	});
});
