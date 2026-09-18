/**
 * Public API for the reusable authentication interaction feature.
 *
 * Exposes the sign-in and registration dialog, account controls, and result helper as a reusable
 * user-flow composition built from shared authentication services and UI primitives.
 */

export {
	AccountControls,
	AuthModal,
	resolveAuthResult,
} from "./ui/auth-modal";
