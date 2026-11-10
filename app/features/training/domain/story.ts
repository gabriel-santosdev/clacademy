import type { ActivityLike, LoggedExercise, LogContext, LogForm } from './activity'

/** Card de Stories ("compartilhar treino"): o que mostrar e como rotular. Puro. */

export type StoryStyle = 'dark' | 'light' | 'photo' | 'sticker'

export const STORY_STYLES: { label: string; value: StoryStyle; icon: string }[] = [
  { label: 'Escuro', value: 'dark', icon: 'pi-moon' },
  { label: 'Claro', value: 'light', icon: 'pi-sun' },
  { label: 'Foto', value: 'photo', icon: 'pi-image' },
  { label: 'Figurinha', value: 'sticker', icon: 'pi-clone' },
]

export interface StoryData {
  kind: string
  title: string
  /** ISO */
  date: string
  durationMin: number | null
  distanceKm: number | null
  avgPaceSec: number | null
  rpe: number | null
  exercises: LoggedExercise[] | null
  notes: string | null
  /** primeiro nome de quem treinou */
  athlete: string
}

export interface StoryStat {
  label: string
  value: string
  unit?: string
}

export function storyFromLog(log: ActivityLike, athlete: string): StoryData {
  return {
    kind: log.kind,
    title: activityTitle(log),
    date: log.performedAt,
    durationMin: log.durationMin,
    distanceKm: log.distanceKm,
    avgPaceSec: log.avgPaceSec,
    rpe: log.rpe,
    exercises: log.exercises ?? null,
    notes: log.notes,
    athlete,
  }
}

/** A partir do formulário recém-salvo (para abrir o compartilhamento logo após concluir). */
export function storyFromForm(ctx: LogContext, form: LogForm, athlete: string): StoryData {
  return {
    kind: ctx.kind,
    title: form.title.trim() || ctx.title || (ctx.kind === 'corrida' ? 'Corrida' : 'Treino'),
    date: new Date().toISOString(),
    durationMin: form.durationMin != null ? Math.round(form.durationMin) : null,
    distanceKm: ctx.kind === 'corrida' ? form.distanceKm : null,
    avgPaceSec: ctx.kind === 'corrida' ? parsePace(form.avgPace) : null,
    rpe: form.rpe,
    exercises: ctx.kind === 'treino' ? (ctx.exercises ?? null) : null,
    notes: form.notes.trim() || null,
    athlete,
  }
}

export function storyKicker(kind: string) {
  return kind === 'corrida' ? 'Corrida concluída' : kind === 'treino' ? 'Treino concluído' : 'Atividade concluída'
}

/** 52 → "52 min" · 75 → "1h15" */
export function storyDuration(min: number): { value: string; unit?: string } {
  if (min < 60) return { value: String(min), unit: 'min' }
  const h = Math.floor(min / 60)
  const m = min % 60
  return { value: m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h` }
}

const km = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 })

/** Número principal (grande) e os secundários, conforme o tipo de atividade. */
export function storyStats(d: StoryData): { hero: StoryStat | null; stats: StoryStat[] } {
  const stats: StoryStat[] = []
  const duration = d.durationMin ? { label: 'Tempo', ...storyDuration(d.durationMin) } : null
  const effort = d.rpe ? { label: rpeLabel(d.rpe), value: String(d.rpe), unit: '/10' } : null
  const ex = exercisesSummary(d.exercises)
  const exStat = ex ? { label: 'Exercícios', value: `${ex.done}/${ex.total}` } : null

  if (d.kind === 'corrida' && d.distanceKm) {
    if (d.avgPaceSec) stats.push({ label: 'Pace', value: formatPace(d.avgPaceSec).replace('/km', ''), unit: '/km' })
    if (duration) stats.push(duration)
    if (effort) stats.push(effort)
    return { hero: { label: 'Distância', value: km(d.distanceKm), unit: 'km' }, stats }
  }
  if (exStat) stats.push(exStat)
  if (effort) stats.push(effort)
  if (duration) return { hero: { ...duration, label: 'Duração' }, stats }
  return { hero: stats.shift() ?? null, stats }
}

/** "10 NOV 2026" */
export function storyDate(iso: string) {
  return new Date(iso)
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'America/Sao_Paulo' })
    .replace(/\./g, '')
    .replace(/ de /g, ' ')
    .toUpperCase()
}

export function storyFileName(d: StoryData) {
  return `clacademy-${slugify(d.title) || d.kind}.png`
}
