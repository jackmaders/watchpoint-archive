/**
 * Specifies the public persistence behavior of the layout-main sidebar state seam across browser lifecycles.
 *
 * Exercises same-tab updates, cross-tab storage events, unavailable storage fallback, disabled persistence, and the
 * server snapshot through the exported hook contract without coupling assertions to its internal store mechanics.
 */

import { act, fireEvent, render, screen } from "@testing-library/react";
import { useCallback } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	SIDEBAR_COLLAPSED_STORAGE_KEY,
	useSidebarCollapsedState,
} from "../sidebar-state";

function SidebarStateProbe({
	defaultCollapsed = false,
	persistState = true,
}: {
	defaultCollapsed?: boolean;
	persistState?: boolean;
}) {
	const [isCollapsed, setIsCollapsed] = useSidebarCollapsedState(
		defaultCollapsed,
		persistState,
	);
	const toggleCollapsed = useCallback(
		() => setIsCollapsed(!isCollapsed),
		[isCollapsed, setIsCollapsed],
	);

	return (
		<button
			aria-label={isCollapsed ? "collapsed" : "expanded"}
			onClick={toggleCollapsed}
			type="button"
		>
			{isCollapsed ? "collapsed" : "expanded"}
		</button>
	);
}

describe("useSidebarCollapsedState", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("updates mounted state when another tab changes the stored preference", () => {
		// Arrange
		render(<SidebarStateProbe />);

		// Act
		act(() => {
			localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, "true");
			window.dispatchEvent(
				new StorageEvent("storage", {
					key: SIDEBAR_COLLAPSED_STORAGE_KEY,
					newValue: "true",
				}),
			);
		});

		// Assert
		expect(screen.getByRole("button", { name: "collapsed" })).toBeDefined();
	});

	it("ignores storage events for unrelated keys", () => {
		// Arrange
		render(<SidebarStateProbe />);

		// Act
		window.dispatchEvent(
			new StorageEvent("storage", {
				key: "watchpoint:unrelated-preference",
				newValue: "true",
			}),
		);

		// Assert
		expect(screen.getByRole("button", { name: "expanded" })).toBeDefined();
	});

	it("keeps the toggle functional when browser storage is unavailable", () => {
		// Arrange
		vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
			throw new Error("storage unavailable");
		});
		vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
			throw new Error("storage unavailable");
		});
		render(<SidebarStateProbe />);

		// Act
		fireEvent.click(screen.getByRole("button", { name: "expanded" }));

		// Assert
		expect(screen.getByRole("button", { name: "collapsed" })).toBeDefined();
	});

	it("does not persist state when persistence is disabled", () => {
		// Arrange
		render(<SidebarStateProbe persistState={false} />);

		// Act
		fireEvent.click(screen.getByRole("button", { name: "expanded" }));

		// Assert
		expect(screen.getByRole("button", { name: "expanded" })).toBeDefined();
	});

	it("uses the default value in the server snapshot", () => {
		// Arrange & Act
		const markup = renderToString(<SidebarStateProbe defaultCollapsed />);

		// Assert
		expect(markup).toContain("collapsed");
	});
});
