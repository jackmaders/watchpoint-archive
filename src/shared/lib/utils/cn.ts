/**
 * Provides Tailwind CSS class composition helpers.
 *
 * Exports the `cn` utility combining `clsx` and `tailwind-merge` for conflict-free className resolution.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
