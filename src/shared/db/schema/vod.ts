/**
 * Defines database schemas, enumerations, and type definitions for Overwatch 2 gameplay VODs.
 *
 * Implements the core content domain schema for ADR-0002, ADR-0003, and ADR-0010. Configures
 * Drizzle ORM table for `vods`, exporting `heroRoleEnum` alongside publication indexes.
 */

import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const heroRoleEnum = ["TANK", "DAMAGE", "SUPPORT"] as const;
export type HeroRole = (typeof heroRoleEnum)[number];

export const vods = sqliteTable(
	"vod",
	{
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		durationSeconds: integer("duration_seconds").notNull(),
		endSeconds: integer("end_seconds"),
		heroName: text("hero_name").notNull(),
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		isDemo: integer("is_demo", { mode: "boolean" }).notNull().default(false),
		isPublished: integer("is_published", { mode: "boolean" })
			.notNull()
			.default(false),
		mapName: text("map_name").notNull(),
		rankTier: text("rank_tier").notNull(),
		role: text("role", { enum: heroRoleEnum }).notNull(),
		startSeconds: integer("start_seconds").notNull().default(0),
		title: text("title").notNull(),
		youtubeVideoId: text("youtube_video_id").notNull(),
	},
	(table) => ({
		publishedCreatedAtIdx: index("vod_published_created_at_idx").on(
			table.isPublished,
			table.createdAt,
		),
		publishedRoleIdx: index("vod_published_role_idx").on(
			table.isPublished,
			table.role,
		),
	}),
);

export type VodRecord = typeof vods.$inferSelect;

/**
 * Transport projection for manifests created before the trim columns existed. Database queries
 * retain the strict `VodRecord` type while application boundaries can normalize these fields.
 */
export type VodTransportRecord = Omit<
	VodRecord,
	"endSeconds" | "startSeconds"
> & {
	endSeconds?: number | null;
	startSeconds?: number;
};
