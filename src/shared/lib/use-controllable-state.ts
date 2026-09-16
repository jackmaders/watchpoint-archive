/**
 * Provides a hook for synchronizing controlled and uncontrolled component state with unified setters.
 *
 * Implements `useControllableState` in `src/shared/lib` following Radix UI controllable state patterns.
 * Allows components to seamlessly operate in either controlled mode (via `prop` and `onChange`) or
 * uncontrolled mode (via `defaultProp` and internal state), preserving callback reference stability.
 */

import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

export interface UseControllableStateParams<T> {
	prop?: T | undefined;
	defaultProp?: T | undefined;
	onChange?: ((state: T) => void) | undefined;
}

export function useControllableState<T>({
	prop,
	defaultProp,
	onChange,
}: UseControllableStateParams<T>): [
	T | undefined,
	Dispatch<SetStateAction<T | undefined>>,
] {
	const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({
		defaultProp,
		onChange,
	});
	const isControlled = prop !== undefined;
	const value = isControlled ? prop : uncontrolledProp;
	const handleChange = useCallbackRef(onChange);

	const setValue: Dispatch<SetStateAction<T | undefined>> = useCallback(
		(nextValue) => {
			if (isControlled) {
				const setter = nextValue as (prevState?: T) => T;
				const evaluatedValue =
					typeof nextValue === "function" ? setter(prop) : nextValue;
				if (evaluatedValue !== prop && evaluatedValue !== undefined) {
					handleChange(evaluatedValue);
				}
			} else {
				setUncontrolledProp(nextValue);
			}
		},
		[isControlled, prop, setUncontrolledProp, handleChange],
	);

	return [value, setValue];
}

function useUncontrolledState<T>({
	defaultProp,
	onChange,
}: Omit<UseControllableStateParams<T>, "prop">) {
	const uncontrolledState = useState<T | undefined>(defaultProp);
	const [value] = uncontrolledState;
	const prevValueRef = useRef(value);
	const handleChange = useCallbackRef(onChange);

	useEffect(() => {
		if (prevValueRef.current !== value) {
			handleChange(value as T);
			prevValueRef.current = value;
		}
	}, [value, handleChange]);

	return uncontrolledState;
}

function useCallbackRef<T extends ((...args: never[]) => unknown) | undefined>(
	callback: T,
): (
	...args: Parameters<NonNullable<T>>
) => ReturnType<NonNullable<T>> | undefined {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	});

	return useMemo(
		() =>
			((...args: Parameters<NonNullable<T>>) => {
				return callbackRef.current?.(...args) as
					| ReturnType<NonNullable<T>>
					| undefined;
			}) as (
				...args: Parameters<NonNullable<T>>
			) => ReturnType<NonNullable<T>> | undefined,
		[],
	);
}
