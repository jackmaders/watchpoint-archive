import { createFileRoute } from "@tanstack/react-router";
import { demoRouteOptions } from "@/pages/demo";

export const Route = createFileRoute("/demo")(demoRouteOptions);
