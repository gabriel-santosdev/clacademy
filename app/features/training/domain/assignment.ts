/** Regras de atribuição de treino/planilha a alunos. Puro. */

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
