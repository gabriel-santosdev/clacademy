ALTER TABLE "activity_logs" ADD COLUMN "device" text;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD COLUMN "avg_hr" integer;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD COLUMN "elevation_m" integer;--> statement-breakpoint
ALTER TABLE "strava_connections" ADD COLUMN "athlete_name" text;--> statement-breakpoint
ALTER TABLE "strava_connections" ADD COLUMN "connected_at" timestamp with time zone DEFAULT now();