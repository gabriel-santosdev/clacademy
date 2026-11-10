import type { RunType } from '#shared/utils/constants'

/** Regras da planilha de corrida (periodização semanal). Puro. */

export interface RunSessionForm {
  week: number
  weekday: number
  type: RunType
  distanceKm: number | null
  durationMin: number | null
  targetPace: string
  description: string
}

export interface RunPlanForm {
  title: string
  goal: string
  description: string
  weeks: number
  sessions: RunSessionForm[]
}

interface RunPlanLike {
  title: string
  goal: string | null
  description: string | null
  weeks: number
  sessions: {
    week: number
    weekday: number
    type: RunType
    distanceKm: number | null
    durationMin: number | null
    targetPaceSec: number | null
    description: string | null
  }[]
}

/** Ordem preferida para sugerir o dia de uma nova sessão (ter, qui, sáb…). */
const PREFERRED_DAYS = [2, 4, 6, 1, 3, 5, 0]

export const emptyRunPlanForm = (): RunPlanForm => ({ title: '', goal: '', description: '', weeks: 4, sessions: [] })

export function runPlanToForm(p: RunPlanLike): RunPlanForm {
  return {
    title: p.title,
    goal: p.goal ?? '',
    description: p.description ?? '',
    weeks: p.weeks,
    sessions: p.sessions.map((s) => ({
      week: s.week,
      weekday: s.weekday,
      type: s.type,
      distanceKm: s.distanceKm,
      durationMin: s.durationMin,
      targetPace: s.targetPaceSec ? formatPace(s.targetPaceSec).replace('/km', '') : '',
      description: s.description ?? '',
    })),
  }
}

/** Descarta sessões de semanas removidas e converte vazios em null. */
export function runPlanFormToPayload(form: RunPlanForm) {
  return {
    title: form.title,
    goal: form.goal || null,
    description: form.description || null,
    weeks: form.weeks,
    sessions: form.sessions
      .filter((s) => s.week <= form.weeks)
      .map((s) => ({ ...s, targetPace: s.targetPace || null, description: s.description || null })),
  }
}

/** Sessões de uma semana, com o índice original (para editar/remover no array). */
export function sessionsOfWeek(sessions: RunSessionForm[], week: number) {
  return sessions
    .map((s, idx) => ({ s, idx }))
    .filter(({ s }) => s.week === week)
    .sort((a, b) => a.s.weekday - b.s.weekday)
}

export function weekKm(sessions: { week: number; distanceKm: number | null }[], week: number) {
  return Math.round(sessions.filter((s) => s.week === week).reduce((t, s) => t + (s.distanceKm ?? 0), 0) * 10) / 10
}

export function totalKm(sessions: { distanceKm: number | null }[]) {
  return Math.round(sessions.reduce((s, x) => s + (x.distanceKm ?? 0), 0))
}

export function newSession(week: number, usedWeekdays: number[]): RunSessionForm {
  const weekday = PREFERRED_DAYS.find((d) => !usedWeekdays.includes(d)) ?? 1
  return { week, weekday, type: 'rodagem', distanceKm: 5, durationMin: null, targetPace: '', description: '' }
}

/** Substitui a semana `to` por uma cópia da semana `from`. */
export function copyWeek(sessions: RunSessionForm[], from: number, to: number) {
  return [...sessions.filter((s) => s.week !== to), ...sessions.filter((s) => s.week === from).map((s) => ({ ...s, week: to }))]
}
