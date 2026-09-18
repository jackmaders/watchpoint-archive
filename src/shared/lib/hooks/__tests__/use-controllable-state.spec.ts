import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useControllableState } from "../use-controllable-state";

describe("useControllableState", () => {
	it("returns defaultProp and updates uncontrolled state with literal value", () => {
		// Arrange
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useControllableState({ defaultProp: "initial", onChange }),
		);

		// Assert - initial
		expect(result.current[0]).toBe("initial");

		// Act
		act(() => {
			result.current[1]("updated");
		});

		// Assert - updated
		expect(result.current[0]).toBe("updated");
		expect(onChange).toHaveBeenCalledWith("updated");
	});

	it("updates uncontrolled state with functional updater", () => {
		// Arrange
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useControllableState({ defaultProp: 10, onChange }),
		);

		// Act
		act(() => {
			result.current[1]((prev) => (prev ?? 0) + 5);
		});

		// Assert
		expect(result.current[0]).toBe(15);
		expect(onChange).toHaveBeenCalledWith(15);
	});

	it("respects controlled prop over defaultProp", () => {
		// Arrange
		const onChange = vi.fn();
		const { result, rerender } = renderHook(
			({ prop }) =>
				useControllableState({
					defaultProp: "uncontrolled",
					onChange,
					prop,
				}),
			{ initialProps: { prop: "controlled-1" } },
		);

		// Assert - initial
		expect(result.current[0]).toBe("controlled-1");

		// Act
		rerender({ prop: "controlled-2" });

		// Assert - rerendered
		expect(result.current[0]).toBe("controlled-2");
	});

	it("calls onChange when controlled state is updated with literal value", () => {
		// Arrange
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useControllableState({
				onChange,
				prop: "current",
			}),
		);

		// Act
		act(() => {
			result.current[1]("new-value");
		});

		// Assert
		expect(onChange).toHaveBeenCalledWith("new-value");
	});

	it("calls onChange when controlled state is updated with functional updater", () => {
		// Arrange
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useControllableState({
				onChange,
				prop: "base",
			}),
		);

		// Act
		act(() => {
			result.current[1]((prev) => `${prev}-extended`);
		});

		// Assert
		expect(onChange).toHaveBeenCalledWith("base-extended");
	});

	it("does not call onChange in controlled mode when value is unchanged or undefined", () => {
		// Arrange
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useControllableState({
				onChange,
				prop: "same",
			}),
		);

		// Act
		act(() => {
			result.current[1]("same");
			result.current[1](undefined);
		});

		// Assert
		expect(onChange).not.toHaveBeenCalled();
	});

	it("operates cleanly when onChange callback is omitted", () => {
		// Arrange
		const { result } = renderHook(() =>
			useControllableState({
				defaultProp: "safe",
			}),
		);

		// Act
		act(() => {
			result.current[1]("safe-updated");
		});

		// Assert
		expect(result.current[0]).toBe("safe-updated");
	});
});
