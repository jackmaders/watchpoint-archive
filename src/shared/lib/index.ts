/**
 * Public barrel export for the shared library segment, exposing reusable non-UI infrastructure.
 *
 * Domain-specific APIs, authentication, telemetry, and test fixtures have dedicated shared segments;
 * this barrel keeps the remaining library utilities available through one stable entrypoint.
 */

export * from "./hooks";
export { cn } from "./utils/cn";
export { formatDuration } from "./utils/format-duration";
