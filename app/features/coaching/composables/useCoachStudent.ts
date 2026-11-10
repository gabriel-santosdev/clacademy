import { useConfirm } from 'primevue/useconfirm'

/** Ficha de um aluno para o professor: plano, atribuições, histórico e feedback. Use com await. */
export function useCoachStudent(id: number) {
  const { user } = useUserSession()
  const confirm = useConfirm()
  const query = useFetch(`/api/coach/students/${id}`, { key: `coach-student-${id}` })
  const data = query.data

  const stats = computed(() => recentStats(data.value?.logs ?? []))
  const whatsapp = computed(() => whatsappUrl(data.value?.aluno.phone))
  const isMine = computed(() => data.value?.aluno.coachId === user.value?.id)
  const coach = computed(() => coachLabel(data.value?.aluno.coachId ?? null, user.value?.id))
  const feedback = useFeedback(() => query.refresh())

  const setCoach = useAction(async (coachId: number | null) => {
    await coachingApi.setCoach(id, coachId)
    await query.refresh()
  }, 'Professor responsável atualizado')
  const takeOver = () => setCoach(user.value!.id)
  const release = () => setCoach(null)

  const endAssignment = useAction(async (assignmentId: number) => {
    await trainingApi.removeAssignment(assignmentId)
    await query.refresh()
  }, 'Atribuição encerrada')

  function askEndAssignment(assignmentId: number, title: string) {
    confirm.require({
      header: 'Encerrar atribuição?',
      message: `"${title}" deixará de aparecer para o aluno. O histórico é mantido.`,
      icon: 'pi pi-exclamation-triangle',
      acceptProps: { label: 'Encerrar', severity: 'danger' },
      rejectProps: { label: 'Cancelar', severity: 'secondary', text: true },
      accept: () => endAssignment(assignmentId),
    })
  }

  return withAsync(query, { stats, whatsapp, isMine, coach, feedback, setCoach, takeOver, release, askEndAssignment })
}
