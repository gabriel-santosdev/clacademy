/** Biblioteca de fichas de treino do professor. Use com await. */
export function useWorkoutLibrary() {
  const query = useFetch('/api/coach/workouts', { key: 'coach-workouts', default: () => [] })
  const search = ref('')
  const list = computed(() => {
    const t = search.value.trim().toLowerCase()
    return query.data.value.filter((w) => !t || w.title.toLowerCase().includes(t))
  })
  return withAsync(query, { search, list })
}

