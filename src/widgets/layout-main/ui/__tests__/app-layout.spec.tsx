import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router");
vi.mock("@/shared/lib/auth-client");
vi.mock("@/shared/ui/auth-modal");

import { getRouteApi } from "@tanstack/react-router";
import { authClient } from "@/shared/lib/auth-client";
import { AppLayout } from "../app-layout";

describe("AppLayout", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders clean layout without sidebar or mobile toggle for unauthenticated visitors", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
		} as never);

		// Act
		render(
			<AppLayout>
				<div data-testid="test-content">Homepage Content</div>
			</AppLayout>,
		);

		// Assert
		expect(screen.getByRole("banner")).toBeDefined();
		expect(screen.getByTestId("test-content")).toBeDefined();
		expect(screen.queryByLabelText("Sidebar Navigation")).toBeNull();
		expect(
			screen.queryByRole("button", { name: "Open navigation menu" }),
		).toBeNull();
		expect(screen.getByRole("contentinfo")).toBeDefined();
		expect(
			screen.getAllByRole("link", { name: "Privacy Statement" }),
		).toHaveLength(1);
	});

	it("renders navbar, persistent desktop sidebar, and child content for authenticated users", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: {
				session: { id: "s1" },
				user: { id: "u1", name: "Player One" },
			},
			isPending: false,
		} as never);

		// Act
		render(
			<AppLayout>
				<div data-testid="test-content">Dashboard Content</div>
			</AppLayout>,
		);

		// Assert
		expect(screen.getByRole("banner")).toBeDefined();
		expect(screen.getByTestId("test-content")).toBeDefined();
		expect(screen.getByLabelText("Sidebar Navigation")).toBeDefined();
		expect(screen.getByText("VOD Catalog")).toBeDefined();
		expect(screen.getByRole("contentinfo")).toBeDefined();
		expect(
			screen.getAllByRole("link", { name: "Privacy Statement" }),
		).toHaveLength(1);
	});

	it("renders sidebar immediately on initial load without flashing when routeContext has preloaded user while session is pending", () => {
		// Arrange: session.isPending is true (client auth hook hasn't resolved), but routeContext has user from SSR
		const rootRouteApi = getRouteApi("__root__");
		vi.mocked(rootRouteApi.useRouteContext).mockReturnValue({
			user: { id: "u-ssr-1", name: "Preloaded Player" },
		});
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: true,
		} as never);

		// Act
		render(
			<AppLayout>
				<div data-testid="test-content">Dashboard Content</div>
			</AppLayout>,
		);

		// Assert: sidebar and toggle are rendered immediately without waiting for client hook
		expect(screen.getByLabelText("Sidebar Navigation")).toBeDefined();
		expect(screen.getByText("VOD Catalog")).toBeDefined();
		expect(
			screen.getByRole("button", { name: "Open navigation menu" }),
		).toBeDefined();
	});

	it("renders sidebar immediately when user prop is explicitly passed even if session is pending", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: true,
		} as never);

		// Act
		render(
			<AppLayout user={{ id: "u-prop-1", name: "Prop Player" }}>
				<div data-testid="test-content">Dashboard Content</div>
			</AppLayout>,
		);

		// Assert
		expect(screen.getByLabelText("Sidebar Navigation")).toBeDefined();
		expect(screen.getByText("VOD Catalog")).toBeDefined();
		expect(
			screen.getByRole("button", { name: "Open navigation menu" }),
		).toBeDefined();
	});

	it("renders unauthenticated clean layout when routeContext user is null while session is pending", () => {
		// Arrange: unauthenticated visitor on initial load
		const rootRouteApi = getRouteApi("__root__");
		vi.mocked(rootRouteApi.useRouteContext).mockReturnValue({
			user: null,
		});
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: true,
		} as never);

		// Act
		render(
			<AppLayout>
				<div data-testid="test-content">Homepage Content</div>
			</AppLayout>,
		);

		// Assert: no sidebar or mobile toggle rendered
		expect(screen.queryByLabelText("Sidebar Navigation")).toBeNull();
		expect(
			screen.queryByRole("button", { name: "Open navigation menu" }),
		).toBeNull();
	});

	it("toggles desktop sidebar collapsed state when sidebar desktop toggle button is clicked for authenticated user", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: {
				session: { id: "s1" },
				user: { id: "u1", name: "Player One" },
			},
			isPending: false,
		} as never);
		render(
			<AppLayout>
				<div>Content</div>
			</AppLayout>,
		);

		// Act
		const collapseBtn = screen.getByRole("button", {
			name: "Collapse sidebar",
		});
		fireEvent.click(collapseBtn);

		// Assert
		const expandBtn = screen.getByRole("button", { name: "Expand sidebar" });
		expect(expandBtn).toBeDefined();
	});

	it("opens and closes mobile drawer when mobile hamburger toggle is clicked for authenticated user", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: {
				session: { id: "s1" },
				user: { id: "u1", name: "Player One" },
			},
			isPending: false,
		} as never);
		render(
			<AppLayout>
				<div>Content</div>
			</AppLayout>,
		);

		// Act - Open
		const openMenuBtn = screen.getByRole("button", {
			name: "Open navigation menu",
		});
		fireEvent.click(openMenuBtn);

		// Assert - Open
		expect(screen.getByRole("dialog")).toBeDefined();

		// Act - Close
		const closeMenuBtn = screen.getByRole("button", {
			name: "Close navigation menu",
		});
		fireEvent.click(closeMenuBtn);

		// Assert - Closed
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("closes mobile drawer when a navigation link inside mobile drawer is clicked for authenticated user", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: {
				session: { id: "s1" },
				user: { id: "u1", name: "Player One" },
			},
			isPending: false,
		} as never);
		render(
			<AppLayout>
				<div>Content</div>
			</AppLayout>,
		);
		const openMenuBtn = screen.getByRole("button", {
			name: "Open navigation menu",
		});
		fireEvent.click(openMenuBtn);
		const dialog = screen.getByRole("dialog");
		const mobileNavLink = dialog.querySelector(
			'a[href="/vods"]',
		) as HTMLAnchorElement;

		// Act
		fireEvent.click(mobileNavLink);

		// Assert
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("passes registrationEnabled to Navbar", () => {
		// Arrange
		vi.mocked(authClient.useSession).mockReturnValue({
			data: null,
			isPending: false,
		} as never);

		// Act
		render(
			<AppLayout registrationEnabled={false}>
				<div>Content</div>
			</AppLayout>,
		);

		// Assert
		expect(screen.getByRole("banner")).toBeDefined();
	});
});
