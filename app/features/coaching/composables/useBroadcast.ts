import type { Audience } from '../api/coachingApi'

/** Avisos do professor para os alunos (notificação no app + push). Use com await. */
export function useBroadcast() {
  const notify = useNotify()
  const form = reactive({ audience: 'mine' as Audience, title: '', body: '', userIds: [] as number[] })
  const alunos = useFetch('/api/coach/students', { key: 'coach-students-all', default: () => [] })
  const alunoOptions = computed(() => alunos.data.value.map((a) => ({ value: a.id, label: a.name })))
  const canSend = computed(() => !!form.title.trim() && (form.audience !== 'selected' || form.userIds.length > 0))

  const send = useAction(async () => {
    const r = await coachingApi.broadcast({
      audience: form.audience,
      title: form.title,
      body: form.body || undefined,
      userIds: form.audience === 'selected' ? form.userIds : undefined,
    })
    notify.success(`Aviso enviado para ${r.sent} aluno(s)`)
    Object.assign(form, { title: '', body: '', userIds: [] })
  })

  return withAsync(alunos, { form, alunoOptions, canSend, send })
}
