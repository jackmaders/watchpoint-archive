/**
 * Owns the desktop navigation sidebar's layout preference so route remounts do not reset a player's chosen width.
 *
 * Implements a browser-backed collapsed-state store for the `layout-main` widget. Reads use a server snapshot for
 * hydration safety, writes notify mounted sidebars in the same tab, storage events synchronize other tabs, and
 * unavailable browser storage falls back to an in-memory value for the current runtime.
 */

import { useCallback, useSyncExternalStore } from "react";

export const SIDEBAR_COLLAPSED_STORAGE_KEY = "watchpoint:sidebar-collapsed";

type SidebarStateListener = () => void;

const listeners = new Set<SidebarStateListener>();
let fallbackCollapsedState: boolean | undefined;

function readStoredSidebarState(defaultCollapsed: boolean): boolean {
	try {
		const storedValue = window.localStorage.getItem(
			SIDEBAR_COLLAPSED_STORAGE_KEY,
		);
		if (storedValue === "true") {
			return true;
		}
		if (storedValue === "false") {
			return false;
		}
		return defaultCollapsed;
	} catch {
		return fallbackCollapsedState ?? defaultCollapsed;
	}
}

function subscribeToSidebarState(listener: SidebarStateListener): () => void {
	const handleStorageChange = (event: StorageEvent) => {
		if (event.key === null || event.key === SIDEBAR_COLLAPSED_STORAGE_KEY) {
			listener();
		}
	};

	listeners.add(listener);
	window.addEventListener("storage", handleStorageChange);

	return () => {
		listeners.delete(listener);
		window.removeEventListener("storage", handleStorageChange);
	};
}

function notifySidebarStateListeners() {
	for (const listener of listeners) {
		listener();
	}
}

function writeSidebarState(isCollapsed: boolean) {
	try {
		window.localStorage.setItem(
			SIDEBAR_COLLAPSED_STORAGE_KEY,
			String(isCollapsed),
		);
		fallbackCollapsedState = undefined;
	} catch {
		fallbackCollapsedState = isCollapsed;
	}

	notifySidebarStateListeners();
}

export function useSidebarCollapsedState(
	defaultCollapsed: boolean,
	persistState: boolean,
) {
	const getSnapshot = useCallback(
		() =>
			persistState
				? readStoredSidebarState(defaultCollapsed)
				: defaultCollapsed,
		[persistState, defaultCollapsed],
	);
	const getServerSnapshot = useCallback(
		() => defaultCollapsed,
		[defaultCollapsed],
	);
	const subscribe = useCallback(
		(listener: SidebarStateListener) =>
			persistState ? subscribeToSidebarState(listener) : () => undefined,
		[persistState],
	);
	const isCollapsed = useSyncExternalStore(
		subscribe,
		getSnapshot,
		getServerSnapshot,
	);
	const setCollapsed = useCallback(
		(nextCollapsed: boolean) => {
			if (persistState) {
				writeSidebarState(nextCollapsed);
			}
		},
		[persistState],
	);

	return [isCollapsed, setCollapsed] as const;
}
