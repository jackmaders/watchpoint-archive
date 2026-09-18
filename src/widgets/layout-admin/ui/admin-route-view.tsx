import { Outlet } from "@tanstack/react-router";
import type { AuthenticatedUser } from "@/shared/auth";
import { AccessDeniedPage } from "./access-denied-page";
import { AdminLayout } from "./admin-layout";

export function AdminRouteView({
	unauthorized,
	user,
}: {
	unauthorized?: boolean;
	user?: AuthenticatedUser | null;
}) {
	if (unauthorized) {
		return <AccessDeniedPage />;
	}
	return (
		<AdminLayout user={user}>
			<Outlet />
		</AdminLayout>
	);
}
