import type { TrainingGoal, TrainingLevel } from '#shared/utils/constants'

/** Regras de atribuição de treino/planilha a alunos. Puro. */

export interface TrainingProfile {
  level?: TrainingLevel | null
  goal?: TrainingGoal | null
}

/**
 * Quanto a ficha combina com o perfil do aluno: 2 = nível e objetivo,
 * 1 = um dos dois (ou ficha genérica), 0 = sem perfil para comparar, -1 = conflita.
 */
export function profileMatch(w: TrainingProfile, aluno: TrainingProfile | undefined) {
  if (!aluno?.level && !aluno?.goal) return 0
  let score = 0
  for (const k of ['level', 'goal'] as const) {
    if (!aluno[k] || !w[k]) continue
    if (w[k] !== aluno[k]) return -1
    score++
  }
  return Math.max(score, 1)
}

export type AssignKind = 'workout' | 'run'

export interface AssignForm {
  kind: AssignKind
  workoutId: number | null
  runPlanId: number | null
  alunoIds: number[]
  startDate: string
  endDate: string
  weekdays: number[]
  notes: string
}

export interface AssignPreset {
  /** perfil do aluno (quando atribuindo a um aluno): ordena as fichas compatíveis primeiro */
  profile?: TrainingProfile
  alunoIds?: number[]
  workoutId?: number
  runPlanId?: number
}

export function emptyAssignForm(preset: AssignPreset, today: string): AssignForm {
  return {
    kind: preset.runPlanId ? 'run' : 'workout',
    workoutId: preset.workoutId ?? null,
    runPlanId: preset.runPlanId ?? null,
    alunoIds: [...(preset.alunoIds ?? [])],
    startDate: today,
    endDate: '',
    weekdays: [1, 3, 5],
    notes: '',
  }
}

/** Planilhas de corrida têm dias próprios; treinos de academia usam `weekdays` (vazio = todo dia). */
export function assignFormToPayload(form: AssignForm) {
  return {
    alunoIds: form.alunoIds,
    workoutId: form.kind === 'workout' ? form.workoutId || undefined : undefined,
    runPlanId: form.kind === 'run' ? form.runPlanId || undefined : undefined,
    startDate: form.startDate,
    endDate: form.endDate || null,
    weekdays: form.kind === 'workout' ? [...form.weekdays].sort() : [],
    notes: form.notes || null,
  }
}

export function canSubmitAssignment(form: AssignForm) {
  const hasContent = form.kind === 'workout' ? !!form.workoutId : !!form.runPlanId
  return hasContent && form.alunoIds.length > 0 && !!form.startDate
}
