/**
 * Route presentation component for the public Privacy Statement page.
 *
 * Implements `PrivacyRouteComponent` subscribing to live cache data from `privacyPageQueryOptions` and rendering `PrivacyPage`.
 */
import { useSuspenseQuery } from "@tanstack/react-query";
import { privacyPageQueryOptions } from "../api/loaders";
import { PrivacyPage } from "./privacy-page";

export function PrivacyRouteComponent() {
	const { data } = useSuspenseQuery(privacyPageQueryOptions());
	return <PrivacyPage registrationEnabled={data?.registrationEnabled} />;
}
