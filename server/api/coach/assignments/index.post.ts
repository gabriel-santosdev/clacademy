import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

const body = z
  .object({
    alunoIds: z.array(z.number().int().positive()).min(1).max(500),
    workoutId: z.number().int().positive().optional(),
    runPlanId: z.number().int().positive().optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
    weekdays: z.array(z.number().int().min(0).max(6)).default([]),
    notes: z.string().trim().max(1000).nullish(),
  })
  .refine((b) => !!b.workoutId !== !!b.runPlanId, 'Informe um treino OU uma planilha')

/** Atribui um treino ou planilha a um ou mais alunos. */
export default defineEventHandler(async (event) => {
  const me = await requireStaff(event)
  const { alunoIds, ...data } = await readValidatedBody(event, body.parse)
  const db = await useDb()

  const title = data.workoutId
    ? (await db.query.workouts.findFirst({ where: (w) => eq(w.id, data.workoutId!) }))?.title
    : (await db.query.runPlans.findFirst({ where: (p) => eq(p.id, data.runPlanId!) }))?.title
  if (!title) notFound(data.workoutId ? 'Treino' : 'Planilha')

  // desativa atribuição anterior do mesmo treino/planilha para os mesmos alunos
  for (const alunoId of alunoIds) {
    await db
      .update(tables.assignments)
      .set({ active: false })
      .where(
        and(
          eq(tables.assignments.alunoId, alunoId),
          data.workoutId ? eq(tables.assignments.workoutId, data.workoutId) : eq(tables.assignments.runPlanId, data.runPlanId!),
        ),
      )
  }

  const rows = await db
    .insert(tables.assignments)
    .values(alunoIds.map((alunoId) => ({ ...data, alunoId, professorId: me.id })))
    .returning()

  await notifyUsers(alunoIds, {
    title: data.workoutId ? 'Novo treino disponível 💪' : 'Nova planilha de corrida 🏃',
    body: `${me.name} enviou: ${title}`,
    url: '/app/aluno/treinos',
  })
  return rows
})
