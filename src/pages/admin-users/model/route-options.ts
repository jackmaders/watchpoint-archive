/**
 * Route options and loader bindings for the admin user management view.
 *
 * Configures the eager `adminUsersRouteOptions` loader while the user-management UI loads lazily.
 */
import { loadAdminUsers } from "../api/loaders";

export const adminUsersRouteOptions = {
	loader: loadAdminUsers,
};
