import { z } from 'zod'
import { EXERCISE_CATALOG } from '../db/exercise-catalog'

/**
 * Garante o catálogo de exercícios no banco. Insere só os que faltam (pelo slug),
 * então editar um exercício do catálogo pelo app não é desfeito, e novos itens
 * adicionados ao catálogo em versões futuras aparecem sozinhos.
 */
export async function ensureExerciseCatalog(db: Db) {
  const existing = await db.select({ slug: tables.exercises.slug }).from(tables.exercises)
  const have = new Set(existing.map((e) => e.slug))
  const missing = EXERCISE_CATALOG.filter((e) => !have.has(e.slug))
  if (!missing.length) return
  await db
    .insert(tables.exercises)
    .values(
      missing.map((e) => ({
        slug: e.slug,
        name: e.name,
        muscleGroup: e.group,
        equipment: e.equipment,
        level: e.level,
        instructions: e.tip,
        source: 'catalogo' as const,
      })),
    )
    .onConflictDoNothing()
  console.info(`[exercícios] ${missing.length} exercícios do catálogo adicionados`)
}

/** Campos editáveis de um exercício (criar/editar pela equipe). */
export const exerciseSchema = z.object({
  name: z.string().trim().min(2).max(120),
  muscleGroup: z.enum(MUSCLE_GROUPS),
  equipment: z.enum(EQUIPMENTS),
  level: z.enum(TRAINING_LEVELS),
  instructions: z.string().trim().max(2000).nullish(),
  images: z.array(z.string().trim().max(500)).max(6).default([]),
  videoUrl: z.string().trim().url().max(500).nullish().or(z.literal('')),
})
