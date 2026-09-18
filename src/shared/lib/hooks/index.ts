/**
 * Public entrypoint for reusable React hooks that provide infrastructure-level state behavior.
 *
 * Exports hooks without coupling consumers to their implementation files, while keeping domain-specific
 * state and user flows in their owning FSD slices.
 */

export {
	type UseControllableStateParams,
	useControllableState,
} from "./use-controllable-state";
