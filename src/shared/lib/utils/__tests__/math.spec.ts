/**
 * Unit test suite verifying fundamental mathematical helper functions.
 *
 * Tests the `add` utility function using Vitest assertion primitives to ensure deterministic arithmetic results.
 */

import { describe, expect, it } from "vitest";
import { add } from "../math";

describe("math", () => {
	it("adds two numbers correctly", () => {
		// Arrange
		const a = 2;
		const b = 3;

		// Act
		const result = add(a, b);

		// Assert
		expect(result).toBe(5);
	});
});
