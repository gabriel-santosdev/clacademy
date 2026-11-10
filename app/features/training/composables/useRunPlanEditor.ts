/** Criar/editar planilha de corrida semana a semana. `param` é o id da rota ou 'novo'. */
export function useRunPlanEditor(param: string) {
  const isNew = param === 'novo'
  const id = isNew ? 0 : Number(param)
  const form = reactive(emptyRunPlanForm())
  const week = ref(1)

  async function load() {
    if (isNew) return
    const p = await trainingApi.getRunPlan(id).catch(() => null)
    if (!p) throw createError({ statusCode: 404, statusMessage: 'Planilha não encontrada' })
    Object.assign(form, runPlanToForm(p))
  }

  const weekSessions = computed(() => sessionsOfWeek(form.sessions, week.value))
  const weeksList = computed(() => Array.from({ length: form.weeks }, (_, i) => ({ week: i + 1, km: weekKm(form.sessions, i + 1) })))

  watch(
    () => form.weeks,
    (n) => {
      if (week.value > n) week.value = Math.max(1, n)
    },
  )

  function addSession() {
    form.sessions.push(newSession(week.value, weekSessions.value.map((x) => x.s.weekday)))
  }

  function removeSession(index: number) {
    form.sessions.splice(index, 1)
  }

  const canCopyToNext = computed(() => week.value < form.weeks && weekSessions.value.length > 0)
  function copyToNext() {
    if (!canCopyToNext.value) return
    form.sessions = copyWeek(form.sessions, week.value, week.value + 1)
    week.value += 1
  }

  const save = useAction(async () => {
    const body = runPlanFormToPayload(form)
    if (isNew) {
      const p = await trainingApi.createRunPlan(body)
      await navigateTo(`/app/professor/corridas/${p.id}`, { replace: true })
    } else {
      await trainingApi.updateRunPlan(id, body)
    }
  }, 'Planilha salva')

  const remove = useAction(async () => {
    await trainingApi.deleteRunPlan(id)
    await navigateTo('/app/professor/corridas')
  }, 'Planilha excluída')

  return { isNew, id, form, week, weeksList, weekSessions, load, addSession, removeSession, canCopyToNext, copyToNext, save, remove }
}
