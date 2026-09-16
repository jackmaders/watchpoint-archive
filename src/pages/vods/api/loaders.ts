/**
 * Data loader for the public VOD catalog browsing page.
 *
 * Implements `loadVodsPage` by fetching published training VODs and platform registration status via server function.
 */
import { getPublishedVods } from "@/entities/vod";
import { getRegistrationStatus } from "@/shared/lib/auth";

export async function loadVodsPage() {
	const [vods, registrationStatus] = await Promise.all([
		getPublishedVods(),
		getRegistrationStatus().catch(() => ({ registrationEnabled: false })),
	]);
	return {
		registrationEnabled: registrationStatus.registrationEnabled,
		vods,
	};
}
