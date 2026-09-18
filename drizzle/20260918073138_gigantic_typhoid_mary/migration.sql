ALTER TABLE `vod` ADD `end_seconds` integer;--> statement-breakpoint
ALTER TABLE `vod` ADD `start_seconds` integer DEFAULT 0 NOT NULL;