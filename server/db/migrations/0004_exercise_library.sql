CREATE TABLE "exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"muscle_group" text NOT NULL,
	"equipment" text DEFAULT 'outros' NOT NULL,
	"level" text DEFAULT 'iniciante' NOT NULL,
	"instructions" text,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"video_url" text,
	"source" text DEFAULT 'equipe' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exercises_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "training_level" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "training_goal" text;--> statement-breakpoint
ALTER TABLE "workout_items" ADD COLUMN "exercise_id" integer;--> statement-breakpoint
ALTER TABLE "workouts" ADD COLUMN "level" text;--> statement-breakpoint
ALTER TABLE "workouts" ADD COLUMN "goal" text;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "exercises_group_idx" ON "exercises" USING btree ("muscle_group");--> statement-breakpoint
ALTER TABLE "workout_items" ADD CONSTRAINT "workout_items_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
-- mesma proteção da 0002: bloqueia a Data API do Supabase
ALTER TABLE "exercises" ENABLE ROW LEVEL SECURITY;
