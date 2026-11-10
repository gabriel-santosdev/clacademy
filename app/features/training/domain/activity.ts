import type { RunType } from '#shared/utils/constants'

/** Regras de registros de atividade (treino, corrida, check-in). Puro. */

export type ActivityKind = 'treino' | 'corrida' | 'checkin'

/** Forma mínima de um registro, compatível com todas as rotas que devolvem logs. */
export interface ActivityLike {
  id: number
  kind: string
  title: string | null
  performedAt: string
  distanceKm: number | null
  durationMin: number | null
  avgPaceSec: number | null
  rpe: number | null
  notes: string | null
  exercises?: LoggedExercise[] | null
  feedback: string | null
  source: string
  workout?: { title: string } | null
  runSession?: { type: RunType } | null
  aluno?: { id: number; name: string } | null
}

/** Exercício marcado durante a execução do treino. */
export interface LoggedExercise {
  name: string
  sets: number | null
  setsDone: number
  done: boolean
}

/** "4/5 exercícios" e quais ficaram de fora. */
export function exercisesSummary(list: LoggedExercise[] | null | undefined) {
  if (!list?.length) return null
  const done = list.filter((e) => e.done).length
  return { done, total: list.length, skipped: list.filter((e) => !e.done).map((e) => e.name) }
}

export function activityTitle(log: Pick<ActivityLike, 'kind' | 'title' | 'workout' | 'runSession'>) {
  if (log.title) return log.title
  if (log.workout?.title) return log.workout.title
  if (log.runSession) return LABELS.runType[log.runSession.type]
  return log.kind === 'checkin' ? 'Check-in' : 'Treino'
}

export function activityIcon(kind: string) {
  return kind === 'corrida' ? 'pi-map' : kind === 'treino' ? 'pi-bolt' : 'pi-check'
}

export function rpeLabel(rpe: number) {
  return rpe <= 3 ? 'Leve' : rpe <= 6 ? 'Moderado' : rpe <= 8 ? 'Forte' : 'Máximo'
}

const round1 = (n: number) => Math.round(n * 10) / 10

/** Totais do histórico: registros, km corridos e pace médio. */
export function summarizeActivities(logs: ActivityLike[]) {
  const runs = logs.filter((l) => l.kind === 'corrida')
  const paced = runs.filter((l) => l.avgPaceSec)
  return {
    count: logs.length,
    km: round1(runs.reduce((s, l) => s + (l.distanceKm ?? 0), 0)),
    pace: paced.length ? Math.round(paced.reduce((s, l) => s + l.avgPaceSec!, 0) / paced.length) : null,
  }
}

/** Indicadores dos últimos N dias (painel do professor). */
export function recentStats(logs: ActivityLike[], days = 30, now = Date.now()) {
  const recent = logs.filter((l) => now - new Date(l.performedAt).getTime() < days * 864e5)
  const withRpe = recent.filter((l) => l.rpe)
  return {
    sessions: recent.length,
    km: round1(recent.reduce((s, l) => s + (l.distanceKm ?? 0), 0)),
    rpe: withRpe.length ? (withRpe.reduce((s, l) => s + (l.rpe ?? 0), 0) / withRpe.length).toFixed(1) : '—',
  }
}

/** Treinos e km por semana (domingo a sábado), das mais antigas para a atual. */
export function weeklyActivity(logs: ActivityLike[], weeks = 8, now = new Date()) {
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - start.getDay())
  const out: { label: string; km: number; count: number }[] = []
  for (let i = weeks - 1; i >= 0; i--) {
    const from = new Date(start.getTime() - i * 7 * 864e5)
    const to = new Date(from.getTime() + 7 * 864e5)
    const inWeek = logs.filter((l) => {
      const d = new Date(l.performedAt)
      return d >= from && d < to
    })
    out.push({
      label: from.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      km: round1(inWeek.reduce((s, l) => s + (l.distanceKm ?? 0), 0)),
      count: inWeek.length,
    })
  }
  return out
}

export function filterActivities<T extends { kind: string }>(logs: T[], filter: 'all' | 'treino' | 'corrida') {
  if (filter === 'all') return logs
  if (filter === 'treino') return logs.filter((l) => l.kind === 'treino' || l.kind === 'checkin')
  return logs.filter((l) => l.kind === 'corrida')
}

/* ── formulário de registro ─────────────────────────── */

/** De onde o registro está sendo feito (treino do dia, sessão da planilha ou livre). */
export interface LogContext {
  kind: ActivityKind
  title?: string
  assignmentId?: number
  workoutId?: number
  runSessionId?: number
  suggestedKm?: number | null
  /** vindos da execução do treino (iniciar → finalizar) */
  durationMin?: number
  exercises?: LoggedExercise[]
  /** sessão a encerrar quando o registro for salvo */
  sessionKey?: string
}

export interface LogForm {
  title: string
  distanceKm: number | null
  durationMin: number | null
  avgPace: string
  rpe: number
  notes: string
}

export function emptyLogForm(ctx: LogContext): LogForm {
  return { title: ctx.title ?? '', distanceKm: ctx.suggestedKm ?? null, durationMin: ctx.durationMin ?? null, avgPace: '', rpe: 6, notes: '' }
}

export function isFreeLog(ctx: LogContext) {
  return !ctx.workoutId && !ctx.runSessionId
}

export function logDialogTitle(kind: ActivityKind) {
  return kind === 'corrida' ? 'Registrar corrida' : kind === 'treino' ? 'Concluir treino' : 'Registrar atividade'
}

export function logFormToPayload(ctx: LogContext, form: LogForm) {
  return {
    kind: ctx.kind,
    assignmentId: ctx.assignmentId,
    workoutId: ctx.workoutId,
    runSessionId: ctx.runSessionId,
    title: form.title.trim() || undefined,
    distanceKm: ctx.kind === 'corrida' && form.distanceKm != null ? form.distanceKm : undefined,
    durationMin: form.durationMin != null ? Math.round(form.durationMin) : undefined,
    avgPace: ctx.kind === 'corrida' ? form.avgPace || undefined : undefined,
    rpe: form.rpe,
    notes: form.notes.trim() || undefined,
    exercises: ctx.kind === 'treino' ? ctx.exercises : undefined,
  }
}
