import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

const body = z.object({
  kind: z.enum(['treino', 'corrida', 'checkin']),
  assignmentId: z.number().int().positive().optional(),
  workoutId: z.number().int().positive().optional(),
  runSessionId: z.number().int().positive().optional(),
  title: z.string().trim().max(160).optional(),
  performedAt: z.string().datetime({ offset: true }).optional(),
  distanceKm: z.number().min(0).max(500).optional(),
  durationMin: z.number().int().min(0).max(1440).optional(),
  avgPace: z.string().max(10).optional(), // "5:30"
  rpe: z.number().int().min(1).max(10).optional(),
  notes: z.string().trim().max(2000).optional(),
  exercises: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(160),
        sets: z.number().int().min(0).max(100).nullable(),
        setsDone: z.number().int().min(0).max(100),
        done: z.boolean(),
      }),
    )
    .max(60)
    .optional(),
})

/** Check-in / registro de treino ou corrida feito pelo aluno. */
export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'aluno')
  const data = await readValidatedBody(event, body.parse)
  const db = await useDb()

  if (data.assignmentId) {
    const a = await db.query.assignments.findFirst({
      where: (x) => and(eq(x.id, data.assignmentId!), eq(x.alunoId, user.id)),
    })
    if (!a) notFound('Atribuição')
  }

  let avgPaceSec = parsePace(data.avgPace)
  if (!avgPaceSec && data.distanceKm && data.durationMin) {
    avgPaceSec = Math.round((data.durationMin * 60) / data.distanceKm)
  }

  const [log] = await db
    .insert(tables.activityLogs)
    .values({
      alunoId: user.id,
      kind: data.kind,
      assignmentId: data.assignmentId,
      workoutId: data.workoutId,
      runSessionId: data.runSessionId,
      title: data.title,
      performedAt: data.performedAt ? new Date(data.performedAt) : new Date(),
      distanceKm: data.distanceKm,
      durationMin: data.durationMin,
      avgPaceSec,
      rpe: data.rpe,
      notes: data.notes,
      exercises: data.kind === 'treino' ? data.exercises : undefined,
    })
    .returning()

  // avisa o professor responsável
  const me = await db.query.users.findFirst({ where: (u) => eq(u.id, user.id), columns: { coachId: true } })
  if (me?.coachId) {
    await notifyUsers([me.coachId], {
      title: `${user.name} registrou um ${data.kind === 'corrida' ? 'treino de corrida' : 'treino'}`,
      body: data.title ?? data.notes?.slice(0, 80),
      url: `/app/professor/alunos/${user.id}`,
    })
  }
  return log
})
