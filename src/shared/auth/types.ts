import type { UserRole } from "../db";

export interface CurrentUser {
	email?: string;
	id: string;
	name?: string;
	role?: UserRole;
}
