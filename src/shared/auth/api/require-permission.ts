import {
	type AuthenticatedUser,
	hasPermission,
	type Permission,
} from "../model/permissions";
import { getCurrentUser } from "./auth-server";

export async function requirePermission(
	permission: Permission,
	reqHeaders?: Headers | Record<string, string> | null,
): Promise<AuthenticatedUser> {
	const user = await getCurrentUser(reqHeaders);

	if (!user) {
		throw new Response(
			JSON.stringify({
				error: "Unauthorized",
				message: "Authentication required",
			}),
			{
				headers: { "Content-Type": "application/json" },
				status: 401,
			},
		);
	}

	if (!hasPermission(user.role, permission)) {
		throw new Response(
			JSON.stringify({
				error: "Forbidden",
				message: `Missing required capability: ${permission}`,
			}),
			{
				headers: { "Content-Type": "application/json" },
				status: 403,
			},
		);
	}

	return {
		email: user.email,
		id: user.id,
		name: user.name,
		role: user.role as AuthenticatedUser["role"],
	};
}
