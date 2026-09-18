import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router");
vi.mock("@/shared/lib/auth-client");

import { authClient } from "@/shared/lib/auth-client";
import { Sidebar } from "../sidebar";

describe("Sidebar", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("renders public navigation links with accessible labels", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
		} as never);

		// Act
		render(<Sidebar />);

		// Assert
		expect(screen.getByRole("navigation")).toBeDefined();
		expect(screen.getByText("VOD Catalog")).toBeDefined();
		expect(screen.getByText("Training History")).toBeDefined();
		expect(screen.queryByText("Privacy Statement")).toBeNull();
		expect(screen.queryByText("Admin Panel")).toBeNull();
	});

	it("renders admin link when authenticated user has ADMIN role", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: {
				session: { id: "s1" },
				user: { email: "admin@example.com", id: "u1", role: "ADMIN" },
			},
			isPending: false,
		} as never);

		// Act
		render(<Sidebar />);

		// Assert
		expect(screen.getByText("Admin Panel")).toBeDefined();
	});

	it("renders admin link when user prop with ADMIN role is provided directly", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: true,
		} as never);

		// Act
		render(<Sidebar user={{ role: "ADMIN" }} />);

		// Assert
		expect(screen.getByText("Admin Panel")).toBeDefined();
	});

	it("renders in collapsed mode without text labels on desktop when defaultCollapsed is true", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
		} as never);

		// Act
		render(<Sidebar defaultCollapsed={true} />);

		// Assert
		const catalogLink = screen.getByRole("link", { name: "VOD Catalog" });
		expect(catalogLink).toBeDefined();
		expect(catalogLink.getAttribute("title")).toBe("VOD Catalog");
	});

	it("calls onNavClick callback when link is clicked", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
		} as never);
		const onNavClick = vi.fn();
		render(<Sidebar onNavClick={onNavClick} />);

		// Act
		const link = screen.getByText("VOD Catalog");
		fireEvent.click(link);

		// Assert
		expect(onNavClick).toHaveBeenCalledTimes(1);
	});

	it("renders collapse toggle button in header and toggles collapse state internally", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
		} as never);
		render(<Sidebar />);

		// Act - Collapse
		const collapseBtn = screen.getByRole("button", {
			name: "Collapse sidebar",
		});
		fireEvent.click(collapseBtn);

		// Assert - Collapsed
		const expandBtn = screen.getByRole("button", { name: "Expand sidebar" });
		expect(expandBtn).toBeDefined();

		// Act - Expand
		fireEvent.click(expandBtn);

		// Assert - Expanded again
		expect(
			screen.getByRole("button", { name: "Collapse sidebar" }),
		).toBeDefined();
	});

	it("persists collapsed preference when the collapse toggle is used", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
		} as never);
		render(<Sidebar />);

		// Act
		fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));

		// Assert
		expect(localStorage.getItem("watchpoint:sidebar-collapsed")).toBe("true");
	});

	it("persists expanded preference when the expand toggle is used", () => {
		// Arrange
		localStorage.setItem("watchpoint:sidebar-collapsed", "true");
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
		} as never);
		render(<Sidebar />);

		// Act
		fireEvent.click(screen.getByRole("button", { name: "Expand sidebar" }));

		// Assert
		expect(localStorage.getItem("watchpoint:sidebar-collapsed")).toBe("false");
	});

	it("restores a stored collapsed preference on mount", () => {
		// Arrange
		localStorage.setItem("watchpoint:sidebar-collapsed", "true");
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
		} as never);

		// Act
		render(<Sidebar />);

		// Assert
		expect(
			screen.getByRole("button", { name: "Expand sidebar" }),
		).toBeDefined();
		expect(screen.queryByText("Navigation")).toBeNull();
	});

	it("hides collapse toggle button when showCollapseToggle is false", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
		} as never);

		// Act
		render(<Sidebar showCollapseToggle={false} />);

		// Assert
		expect(
			screen.queryByRole("button", { name: "Collapse sidebar" }),
		).toBeNull();
		expect(screen.queryByRole("button", { name: "Expand sidebar" })).toBeNull();
	});
});
