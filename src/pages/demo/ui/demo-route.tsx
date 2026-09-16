/**
 * Route presentation component for the public interactive demo training session.
 *
 * Implements `DemoRouteComponent` subscribing to live cache data from `demoPageQueryOptions` and rendering `DemoPage`.
 */
import { useSuspenseQuery } from "@tanstack/react-query";
import { demoPageQueryOptions } from "../api/loaders";
import { DemoPage } from "./demo-page";

export function DemoRouteComponent() {
	const { data } = useSuspenseQuery(demoPageQueryOptions());
	return (
		<DemoPage registrationEnabled={data?.registrationEnabled} vod={data.vod} />
	);
}
