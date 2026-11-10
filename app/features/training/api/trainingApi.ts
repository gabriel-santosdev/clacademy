/** Payloads derivados das regras de conversão do domínio. */
type WorkoutPayload = ReturnType<typeof workoutFormToPayload>
type RunPlanPayload = ReturnType<typeof runPlanFormToPayload>
type AssignPayload = ReturnType<typeof assignFormToPayload>
type LogPayload = ReturnType<typeof logFormToPayload>

export const trainingApi = {
  // aluno
  logActivity: (body: LogPayload) => $fetch('/api/me/logs', { method: 'POST', body }),

  // fichas de treino (professor)
  getWorkout: (id: number) => $fetch(`/api/coach/workouts/${id}`),
  createWorkout: (body: WorkoutPayload) => $fetch('/api/coach/workouts', { method: 'POST', body }),
  updateWorkout: (id: number, body: WorkoutPayload) => $fetch(`/api/coach/workouts/${id}`, { method: 'PUT', body }),
  deleteWorkout: (id: number) => $fetch(`/api/coach/workouts/${id}`, { method: 'DELETE' }),

  // planilhas de corrida (professor)
  getRunPlan: (id: number) => $fetch(`/api/coach/run-plans/${id}`),
  createRunPlan: (body: RunPlanPayload) => $fetch('/api/coach/run-plans', { method: 'POST', body }),
  updateRunPlan: (id: number, body: RunPlanPayload) => $fetch(`/api/coach/run-plans/${id}`, { method: 'PUT', body }),
  deleteRunPlan: (id: number) => $fetch(`/api/coach/run-plans/${id}`, { method: 'DELETE' }),

  // atribuições
  assign: (body: AssignPayload) => $fetch('/api/coach/assignments', { method: 'POST', body }),
  removeAssignment: (id: number) => $fetch(`/api/coach/assignments/${id}`, { method: 'DELETE' }),
}
