/** Lista de alunos do professor com busca e seleção para atribuição em massa. Use com await. */
export function useCoachStudents() {
  const { user } = useUserSession()
  const scope = ref(defaultScope(user.value?.role))
  const search = ref('')
  const q = useDebouncedRef(search, 300)
  const query = useFetch('/api/coach/students', { query: { mine: scope, q }, key: 'coach-students', default: () => [] })

  const selected = ref<{ id: number }[]>([])
  const selectedIds = computed(() => selected.value.map((s) => s.id))
  const emptyText = computed(() => emptyStudentsText(scope.value))

  async function afterAssign() {
    selected.value = []
    await query.refresh()
  }

  return withAsync(query, { scope, search, selected, selectedIds, emptyText, afterAssign })
}
