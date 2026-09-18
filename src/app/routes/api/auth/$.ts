import { createFileRoute } from "@tanstack/react-router";
import { authApiRouteOptions } from "@/shared/auth";

export const Route = createFileRoute("/api/auth/$")(authApiRouteOptions);
