import { createFileRoute } from "@tanstack/react-router";
import { mediaApiRouteOptions } from "@/shared/media/index.server";

export const Route = createFileRoute("/api/media/$")(mediaApiRouteOptions);
