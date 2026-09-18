/**
 * Public barrel export for the shared library segment, exposing reusable non-UI infrastructure.
 *
 * Domain-specific APIs, authentication, telemetry, and test fixtures have dedicated shared segments;
 * this barrel keeps the remaining library utilities available through one stable entrypoint.
 */

export * from "./audit";
export * from "./hooks";
export * from "./math";
export * from "./metrics";
export * from "./permissions";
export * from "./sentry";
export * from "./utils";
