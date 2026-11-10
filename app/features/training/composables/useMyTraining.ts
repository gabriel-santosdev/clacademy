/** Treinos e planilhas atribuídos ao aluno. Use com await. */
export function useMyTraining() {
  const query = useFetch('/api/me/training', { key: 'me-training' })
  const assignments = computed(() => query.data.value?.assignments ?? [])
  const workouts = computed(() => assignments.value.filter((a) => a.workout))
  const runs = computed(() => assignments.value.filter((a) => a.runPlan))
  const locked = computed(() => !!query.data.value?.locked)

  const tab = ref<'academia' | 'corrida'>('academia')
  watchEffect(() => {
    if (!workouts.value.length && runs.value.length) tab.value = 'corrida'
  })

  /** Semana visível de cada planilha (padrão: semana corrente). */
  const weekView = reactive<Record<number, number>>({})
  const visibleWeek = (assignmentId: number, current: number | null) => weekView[assignmentId] ?? current ?? 1

  return withAsync(query, { workouts, runs, locked, tab, weekView, visibleWeek })
}
