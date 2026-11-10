ALTER TABLE "exercises" ADD COLUMN "external_source" text;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "external_id" integer;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "external_media" jsonb;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "external_synced_at" timestamp with time zone;