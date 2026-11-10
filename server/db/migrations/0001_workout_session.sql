ALTER TABLE "activity_logs" ADD COLUMN "exercises" jsonb;--> statement-breakpoint
-- A CL Academy vende só personal ('academia') e assessoria de corrida ('assessoria').
UPDATE "plans" SET "modality" = 'assessoria' WHERE "modality" = 'corrida';--> statement-breakpoint
-- Combo sai da vitrine; assinaturas existentes continuam apontando para o plano.
UPDATE "plans" SET "status" = 'archived', "highlight" = false WHERE "modality" = 'combo' AND "status" <> 'archived';
