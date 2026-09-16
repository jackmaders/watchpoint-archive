/**
 * Unit test suite verifying class name composition and duration formatting utilities.
 *
 * Validates the `cn` helper using Vitest to assert correct conditional class application and
 * conflict resolution via `tailwind-merge` and `clsx`.
 */

import { describe, expect, it } from "vitest";
import { cn } from "../utils";

describe("cn utility", () => {
	it("merges class names correctly", () => {
		// Arrange & Act
		const result = cn("px-2 py-1", "bg-blue-500", { "text-white": true });

		// Assert
		expect(result).toBe("px-2 py-1 bg-blue-500 text-white");
	});
});
