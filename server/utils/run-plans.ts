import { eq } from 'drizzle-orm'
import type { z } from 'zod'

type RunPlanInput = z.infer<typeof runPlanSchema>

/** Cria ou substitui uma planilha de corrida com todas as sessões. */
export async function saveRunPlan(input: RunPlanInput, opts: { id?: number; createdBy?: number }) {
  const { sessions, ...data } = input
  const db = await useDb()
  return db.transaction(async (tx) => {
    let planId = opts.id
    let plan
    if (planId) {
      ;[plan] = await tx.update(tables.runPlans).set(data).where(eq(tables.runPlans.id, planId)).returning()
      if (!plan) notFound('Planilha')
      await tx.delete(tables.runSessions).where(eq(tables.runSessions.runPlanId, planId))
    } else {
      ;[plan] = await tx.insert(tables.runPlans).values({ ...data, createdBy: opts.createdBy }).returning()
      planId = plan!.id
    }
    const valid = sessions.filter((s) => s.week <= data.weeks)
    if (valid.length) {
      await tx.insert(tables.runSessions).values(
        valid.map(({ targetPace, ...s }) => ({ ...s, runPlanId: planId!, targetPaceSec: parsePace(targetPace) })),
      )
    }
    return plan!
  })
}
