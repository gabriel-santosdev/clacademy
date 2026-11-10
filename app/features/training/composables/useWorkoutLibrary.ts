import type { TrainingGoal, TrainingLevel } from '#shared/utils/constants'

/** Biblioteca de fichas de treino (modelos por perfil). Use com await. */
export function useWorkoutLibrary() {
  const query = useFetch('/api/coach/workouts', { key: 'coach-workouts', default: () => [] })
  const search = ref('')
  const level = ref<TrainingLevel | null>(null)
  const goal = ref<TrainingGoal | null>(null)
  const list = computed(() => {
    const t = normalizeText(search.value)
    return query.data.value.filter(
      (w) =>
        (!t || normalizeText(w.title).includes(t)) &&
        // ficha sem perfil definido serve para qualquer um
        (!level.value || !w.level || w.level === level.value) &&
        (!goal.value || !w.goal || w.goal === goal.value),
    )
  })
  return withAsync(query, { search, level, goal, list })
}
