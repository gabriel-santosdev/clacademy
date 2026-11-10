import { and, eq, gte, lt } from 'drizzle-orm'

/**
 * Check-out automático: uma atividade que chega do relógio (via Strava) cumpre
 * a sessão que o professor planejou para aquele dia. Fica vinculada como se o aluno
 * tivesse marcado no app, então aparece como feita em "Hoje" e no painel do professor.
 */

export type PlannedMatch =
  | { kind: 'corrida'; assignmentId: number; runSessionId: number; label: string }
  | { kind: 'treino'; assignmentId: number; workoutId: number; label: string }

/** Início e fim do dia (fuso de São Paulo) que contém `at`. */
function dayRange(at: Date) {
  const { iso } = todaySP(at)
  const start = new Date(`${iso}T03:00:00Z`) // São Paulo é UTC-3 (sem horário de verão desde 2019)
  return { start, end: new Date(start.getTime() + 864e5) }
}

export async function matchPlannedSession(
  alunoId: number,
  kind: 'corrida' | 'treino',
  at: Date,
  distanceKm?: number | null,
): Promise<PlannedMatch | null> {
  const sub = await getCurrentSubscription(alunoId)
  if (!sub || !subscriptionGivesAccess(sub)) return null

  const agenda = await getTodayAgenda(alunoId, at)
  const db = await useDb()
  const { start, end } = dayRange(at)
  const done = await db
    .select({ workoutId: tables.activityLogs.workoutId, runSessionId: tables.activityLogs.runSessionId })
    .from(tables.activityLogs)
    .where(and(eq(tables.activityLogs.alunoId, alunoId), gte(tables.activityLogs.performedAt, start), lt(tables.activityLogs.performedAt, end)))

  if (kind === 'corrida') {
    const doneRuns = new Set(done.map((d) => d.runSessionId).filter(Boolean))
    const open = agenda.runs.filter((r) => !doneRuns.has(r.session.id))
    if (!open.length) return null
    // mais de uma sessão no dia (ex.: dobra): a de distância mais próxima
    const km = distanceKm ?? 0
    const best = [...open].sort(
      (a, b) => Math.abs((a.session.distanceKm ?? km) - km) - Math.abs((b.session.distanceKm ?? km) - km),
    )[0]!
    const type = LABELS.runType[best.session.type as keyof typeof LABELS.runType] ?? 'Corrida'
    return { kind, assignmentId: best.assignmentId, runSessionId: best.session.id, label: type }
  }

  const doneWorkouts = new Set(done.map((d) => d.workoutId).filter(Boolean))
  const open = agenda.workouts.find((w) => !doneWorkouts.has(w.workout.id))
  if (!open) return null
  return { kind, assignmentId: open.assignmentId, workoutId: open.workout.id, label: open.workout.title }
}
