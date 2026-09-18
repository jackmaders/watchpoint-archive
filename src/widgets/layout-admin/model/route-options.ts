import { adminBeforeLoad } from "../api/admin-guard";

export const adminRouteOptions = {
	beforeLoad: adminBeforeLoad,
};
