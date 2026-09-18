import { createFileRoute } from "@tanstack/react-router";
import { authApiRouteOptions } from "@/shared/auth/index.server";

export const Route = createFileRoute("/api/auth/$")(authApiRouteOptions);
