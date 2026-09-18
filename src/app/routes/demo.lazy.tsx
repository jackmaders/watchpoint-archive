/**
 * Lazy presentation adapter for the unauthenticated training demo.
 *
 * Binds `DemoRouteComponent` to `/demo` while keeping the demo player UI out of the eager
 * route tree and delegating presentation to the `pages/demo` slice.
 */
import { createLazyFileRoute } from "@tanstack/react-router";
import { DemoRouteComponent } from "@/pages/demo";

export const Route = createLazyFileRoute("/demo")({
	component: DemoRouteComponent,
});
