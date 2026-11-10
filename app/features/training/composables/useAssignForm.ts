import type { AssignPreset } from '../domain/assignment'

/**
 * Atribuir treino/planilha a alunos.
 * Pode vir com aluno(s) OU com treino/planilha pré-selecionados; carrega só o que falta escolher.
 */
export function useAssignForm(preset: () => AssignPreset, onSaved: () => void) {
  const form = reactive(emptyAssignForm(preset(), todayISO()))
  const search = ref('')

  const needsAlunos = computed(() => !preset().alunoIds?.length)
  const needsContent = computed(() => !preset().workoutId && !preset().runPlanId)

  const workouts = useFetch('/api/coach/workouts', { key: 'assign-workouts', default: () => [], immediate: false })
  const runPlans = useFetch('/api/coach/run-plans', { key: 'assign-run-plans', default: () => [], immediate: false })
  const alunos = useFetch('/api/coach/students', { key: 'assign-students', default: () => [], immediate: false })

  /** Chamado ao abrir o diálogo. */
  function reset() {
    Object.assign(form, emptyAssignForm(preset(), todayISO()))
    search.value = ''
    if (needsContent.value) {
      workouts.execute()
      runPlans.execute()
    }
    if (needsAlunos.value) alunos.execute()
  }

  const workoutOptions = computed(() =>
    workouts.data.value
      .map((w) => ({
        value: w.id,
        label: w.tag ? `[${w.tag}] ${w.title}` : w.title,
        level: w.level,
        goal: w.goal,
        match: profileMatch(w, preset().profile),
      }))
      .sort((a, b) => b.match - a.match),
  )
  const runPlanOptions = computed(() => runPlans.data.value.map((p) => ({ value: p.id, label: `${p.title} (${p.weeks} semanas)` })))
  const alunoOptions = computed(() =>
    alunos.data.value.map((a) => ({ value: a.id, label: a.name, inactive: !!a.subscription && !a.subscription.hasAccess })),
  )
  const canSubmit = computed(() => canSubmitAssignment(form))

  const submit = useAction(async () => {
    await trainingApi.assign(assignFormToPayload(form))
    onSaved()
  }, 'Enviado para o(s) aluno(s)!')

  return { form, search, needsAlunos, needsContent, workoutOptions, runPlanOptions, alunoOptions, canSubmit, reset, submit }
}
