/**
 * Defines database schemas, enumerations, and type definitions for interactive decision scenarios.
 *
 * Implements the core scenario domain schema for ADR-0002, ADR-0003, and ADR-0010. Configures
 * Drizzle ORM table for `scenarios`, exporting `moduleTypeEnum` and `inputTypeEnum` alongside polymorphic
 * JSON input configuration definitions.
 */

import {
	index,
	integer,
	real,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import { inputTypeEnum, moduleTypeEnum } from "../database-contracts";

export {
	type InputType,
	inputTypeEnum,
	type ModuleType,
	moduleTypeEnum,
} from "../database-contracts";

import type { JsonValue } from "../types";
import { vods } from "./vod";

export const scenarios = sqliteTable(
	"scenario",
	{
		explanationText: text("explanation_text").notNull(),
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		imageUrl: text("image_url"),
		inputConfig: text("input_config", { mode: "json" })
			.$type<Record<string, JsonValue>>()
			.notNull(),
		inputType: text("input_type", { enum: inputTypeEnum }).notNull(),
		moduleType: text("module_type", { enum: moduleTypeEnum }).notNull(),
		promptText: text("prompt_text").notNull(),
		timeLimitSeconds: integer("time_limit_seconds"),
		timestampSeconds: real("timestamp_seconds").notNull(),
		vodId: text("vod_id")
			.notNull()
			.references(() => vods.id, { onDelete: "cascade" }),
	},
	(table) => ({
		moduleTypeIdx: index("scenario_module_type_idx").on(table.moduleType),
		vodTimestampIdx: index("scenario_vod_timestamp_idx").on(
			table.vodId,
			table.timestampSeconds,
		),
	}),
);
