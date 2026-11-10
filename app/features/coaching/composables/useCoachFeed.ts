/** Painel do professor: atividade dos alunos e pendências de feedback. Use com await. */
export function useCoachFeed() {
  const { user } = useUserSession()
  const scope = ref(defaultScope(user.value?.role))
  const query = useFetch('/api/coach/feed', { query: { mine: scope }, key: 'coach-feed' })
  const feedback = useFeedback(() => query.refresh())
  const name = computed(() => firstName(user.value?.name))

  return withAsync(query, { scope, feedback, name })
}
