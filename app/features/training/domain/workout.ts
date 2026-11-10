import type { MuscleGroup, TrainingGoal, TrainingLevel } from '#shared/utils/constants'
import type { ExerciseLike } from '~/features/exercises/domain/exercise'

/** Regras da ficha de treino (montagem e conversão para a API). Puro. */

/** Dados do banco que a tela usa para mostrar a miniatura (não vão para a API). */
type LinkedExercise = Pick<ExerciseLike, 'id' | 'images' | 'instructions' | 'videoUrl' | 'muscleGroup' | 'equipment' | 'level'>

export interface ExerciseForm {
  /** chave estável na tela (reordenar/arrastar); não vai para a API */
  uid: string
  exerciseId: number | null
  /** só para exibição (miniatura, "como fazer") */
  exercise: LinkedExercise | null
  name: string
  sets: number | null
  reps: string
  load: string
  restSeconds: number | null
  notes: string
  videoUrl: string
}

export interface WorkoutForm {
  title: string
  description: string
  tag: string
  level: TrainingLevel | null
  goal: TrainingGoal | null
  items: ExerciseForm[]
}

interface WorkoutLike {
  title: string
  description: string | null
  tag: string | null
  level?: TrainingLevel | null
  goal?: TrainingGoal | null
  items: {
    exerciseId?: number | null
    exercise?: LinkedExercise | null
    name: string
    sets: number | null
    reps: string | null
    load: string | null
    restSeconds: number | null
    notes: string | null
    videoUrl: string | null
  }[]
}

let uidSeq = 0
const nextUid = () => `ex${Date.now().toString(36)}${(uidSeq++).toString(36)}`

export const blankExercise = (): ExerciseForm => ({
  uid: nextUid(),
  exerciseId: null,
  exercise: null,
  name: '',
  sets: 3,
  reps: '12',
  load: '',
  restSeconds: 60,
  notes: '',
  videoUrl: '',
})

const TIMED_GROUPS: MuscleGroup[] = ['cardio']

/** Item da ficha a partir de um exercício do banco, com prescrição padrão sensata. */
export function exerciseFromLibrary(e: LinkedExercise & { name: string }): ExerciseForm {
  const timed = TIMED_GROUPS.includes(e.muscleGroup)
  return {
    ...blankExercise(),
    exerciseId: e.id,
    exercise: e,
    name: e.name,
    ...(timed ? { sets: 1, reps: '10 min', restSeconds: null } : {}),
    ...(e.muscleGroup === 'abdomen' && /prancha/i.test(e.name) ? { reps: '30s', restSeconds: 30 } : {}),
  }
}

export const emptyWorkoutForm = (): WorkoutForm => ({ title: '', description: '', tag: '', level: null, goal: null, items: [] })

export function workoutToForm(w: WorkoutLike): WorkoutForm {
  return {
    title: w.title,
    description: w.description ?? '',
    tag: w.tag ?? '',
    level: w.level ?? null,
    goal: w.goal ?? null,
    items: w.items.map((i) => ({
      uid: nextUid(),
      exerciseId: i.exerciseId ?? null,
      exercise: i.exercise ?? null,
      name: i.name,
      sets: i.sets,
      reps: i.reps ?? '',
      load: i.load ?? '',
      restSeconds: i.restSeconds,
      notes: i.notes ?? '',
      videoUrl: i.videoUrl ?? '',
    })),
  }
}

/** Remove exercícios sem nome e converte vazios em null. */
export function workoutFormToPayload(form: WorkoutForm) {
  return {
    title: form.title,
    description: form.description || null,
    tag: form.tag || null,
    level: form.level,
    goal: form.goal,
    items: form.items
      .filter((i) => i.name.trim())
      .map(({ exercise: _, uid: __, ...i }) => ({ ...i, reps: i.reps || null, load: i.load || null, notes: i.notes || null, videoUrl: i.videoUrl || null })),
  }
}

/** Move um item da lista uma posição para cima (-1) ou para baixo (+1). */
export function moveItem<T>(list: T[], index: number, delta: -1 | 1) {
  const j = index + delta
  if (j < 0 || j >= list.length) return
  const [it] = list.splice(index, 1)
  list.splice(j, 0, it!)
}

/** Leva o item da posição `from` para `to` (arrastar e soltar). */
export function reorder<T>(list: T[], from: number, to: number) {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return
  const [it] = list.splice(from, 1)
  list.splice(to, 0, it!)
}

/** Cópia do exercício logo abaixo dele. */
export function duplicateItem(list: ExerciseForm[], index: number) {
  const src = list[index]
  if (!src) return
  list.splice(index + 1, 0, { ...src, uid: nextUid() })
}

/* ── atalhos de prescrição ───────────────────────────── */

export const PRESCRIPTION_PRESETS = [
  { label: '3×12', sets: 3, reps: '12' },
  { label: '3×10', sets: 3, reps: '10' },
  { label: '4×10', sets: 4, reps: '10' },
  { label: '4×8', sets: 4, reps: '8' },
  { label: '3×15', sets: 3, reps: '15' },
  { label: '4×12', sets: 4, reps: '12' },
  { label: '5×5', sets: 5, reps: '5' },
  { label: '3×30s', sets: 3, reps: '30s' },
] as const

export const REST_PRESETS = [30, 45, 60, 90, 120] as const

/** Aplica séries/reps/descanso a todos os exercícios (menos os de tempo, como cardio). */
export function applyToAll(list: ExerciseForm[], patch: Partial<Pick<ExerciseForm, 'sets' | 'reps' | 'restSeconds'>>) {
  for (const it of list) {
    if (it.exercise?.muscleGroup === 'cardio') continue
    Object.assign(it, patch)
  }
}

/** Segundos de execução de uma série: "12" → 36s · "8-12" → 30s · "30s" → 30 · "10 min" → 600. */
export function seriesSeconds(reps: string) {
  const r = reps.trim().toLowerCase()
  const min = r.match(/^(\d+(?:[.,]\d+)?)\s*min/)
  if (min) return Number(min[1]!.replace(',', '.')) * 60
  const sec = r.match(/^(\d+)\s*s/)
  if (sec) return Number(sec[1])
  const range = r.match(/^(\d+)\s*[-a]\s*(\d+)/)
  if (range) return ((Number(range[1]) + Number(range[2])) / 2) * 3
  const n = r.match(/^(\d+)/)
  return n ? Number(n[1]) * 3 : 40
}

/** Duração estimada da ficha em minutos (execução + descanso + troca de aparelho). */
export function estimateMinutes(list: Pick<ExerciseForm, 'sets' | 'reps' | 'restSeconds'>[]) {
  const total = list.reduce((acc, it) => {
    const sets = Math.max(1, it.sets ?? 1)
    return acc + sets * seriesSeconds(it.reps || '') + Math.max(0, sets - 1) * (it.restSeconds ?? 60) + 45
  }, 0)
  return Math.max(1, Math.round(total / 60))
}

/** Grupos musculares trabalhados (mais frequentes primeiro). */
export function groupsWorked(list: Pick<ExerciseForm, 'exercise'>[]) {
  const counts = new Map<MuscleGroup, number>()
  for (const it of list) {
    const g = it.exercise?.muscleGroup
    if (g) counts.set(g, (counts.get(g) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([group, count]) => ({ group, count }))
}

/** "Tem alteração não salva?" — compara com um retrato tirado ao carregar/salvar. */
export function workoutSnapshot(form: WorkoutForm) {
  return JSON.stringify(workoutFormToPayload(form))
}
