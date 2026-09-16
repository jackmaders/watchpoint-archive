import { createFileRoute } from "@tanstack/react-router";
import { privacyRouteOptions } from "@/pages/privacy";

export const Route = createFileRoute("/privacy")(privacyRouteOptions);
