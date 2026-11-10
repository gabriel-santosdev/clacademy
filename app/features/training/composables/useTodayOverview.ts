/** Tela "Hoje" do aluno: agenda do dia, mês e atividade recente. Use com await. */
export function useTodayOverview() {
  const query = useFetch('/api/me/overview', { key: 'me-overview' })
  const data = query.data

  const name = computed(() => firstName(data.value?.user.name))
  const nothingToday = computed(() => !data.value?.today.workouts.length && !data.value?.today.runs.length)
  const pendingPayment = computed(() => data.value?.subscription?.status === 'pending')
  const isWorkoutDone = (workoutId: number) => !!data.value?.done.workoutIds.includes(workoutId)
  const isRunDone = (sessionId: number) => !!data.value?.done.runSessionIds.includes(sessionId)

  return withAsync(query, { name, nothingToday, pendingPayment, isWorkoutDone, isRunDone })
}
