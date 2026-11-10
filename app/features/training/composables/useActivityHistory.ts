/** Histórico do aluno: filtros, totais e evolução semanal. Use com await. */
export function useActivityHistory() {
  const query = useFetch('/api/me/logs', { key: 'me-logs', default: () => [] })
  const filter = ref<'all' | 'treino' | 'corrida'>('all')

  const filtered = computed(() => filterActivities(query.data.value, filter.value))
  const totals = computed(() => summarizeActivities(query.data.value))
  const weekly = computed(() => weeklyActivity(query.data.value))

  return withAsync(query, { filter, filtered, totals, weekly })
}
