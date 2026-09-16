/**
 * Route presentation component for the public VOD training catalog.
 *
 * Implements `VodsRouteComponent` extracting loader data from `routeApi` and rendering `VodsPage`.
 */
import { getRouteApi } from "@tanstack/react-router";
import { useCallback } from "react";
import type { VodsSearchParams } from "../model/search-params";
import { VodsPage } from "./vods-page";

const routeApi = getRouteApi("/vods/");

export function VodsRouteComponent() {
	const search = routeApi.useSearch() as VodsSearchParams;
	const { registrationEnabled, vods } = routeApi.useLoaderData();
	const navigate = routeApi.useNavigate();

	const handleFilterChange = useCallback(
		(newParams: VodsSearchParams) => {
			navigate({
				search: (prev: Record<string, unknown>) => ({
					...prev,
					...newParams,
				}),
				to: ".",
			});
		},
		[navigate],
	);

	return (
		<VodsPage
			onFilterChange={handleFilterChange}
			registrationEnabled={registrationEnabled}
			searchParams={search}
			vods={vods}
		/>
	);
}
