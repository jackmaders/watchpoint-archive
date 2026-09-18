import type { UserRole } from "@/shared/db";

export interface CurrentUser {
	email?: string;
	id: string;
	name?: string;
	role?: UserRole;
}
