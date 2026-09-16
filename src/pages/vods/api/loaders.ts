/**
 * Data loader and navigation guards for the public VOD catalog browsing page.
 *
 * Implements `vodsBeforeLoad` to enforce active session authentication and `loadVodsPage`
 * by fetching published training VODs and platform registration status via server function.
 */
import { redirect } from "@tanstack/react-router";
import { getPublishedVods } from "@/entities/vod";
import { getRegistrationStatus, getSessionUser } from "@/shared/lib/auth";

export async function vodsBeforeLoad() {
	const user = await getSessionUser().catch(() => null);
	if (!user) {
		throw redirect({ to: "/" });
	}
	return { user };
}

export async function loadVodsPage() {
	const [vods, registrationEnabled] = await Promise.all([
		getPublishedVods(),
		getRegistrationStatus(),
	]);
	return { registrationEnabled, vods };
}
