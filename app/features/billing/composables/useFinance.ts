/** Financeiro (admin): indicadores, cobranças, baixa manual e matrícula presencial. Use com await. */
export function useFinance() {
  const status = ref('')
  const query = useFetch('/api/admin/finance', { query: { status }, key: 'admin-finance' })

  const updatePayment = useAction(async (id: number, action: 'confirm' | 'cancel') => {
    await billingApi.updatePayment(id, action)
    await query.refresh()
  }, 'Cobrança atualizada')

  const chargeNext = useAction(async (subscriptionId: number) => {
    await billingApi.chargeNext(subscriptionId)
    await query.refresh()
  }, 'Nova cobrança gerada')

  // matrícula presencial
  const enrollOpen = ref(false)
  const enrollForm = reactive({ userId: null as number | null, planPriceId: null as number | null, markPaid: true, method: 'PIX' })
  const alunos = useFetch('/api/admin/users', { query: { role: 'aluno' }, key: 'enroll-alunos', immediate: false, default: () => [] })
  const plans = useFetch('/api/admin/plans', { key: 'enroll-plans', immediate: false, default: () => [] })

  const alunoOptions = computed(() => alunos.data.value.map((a) => ({ value: a.id, label: `${a.name} — ${a.email}` })))
  const priceOptions = computed(() =>
    plans.data.value
      .filter((p) => p.status !== 'archived')
      .flatMap((p) =>
        p.prices
          .filter((pr) => pr.active)
          .map((pr) => ({ value: pr.id, label: `${p.name} — ${LABELS.interval[pr.interval]} (${formatBRL(pr.amountCents)})` })),
      ),
  )

  function openEnroll() {
    Object.assign(enrollForm, { userId: null, planPriceId: null, markPaid: true, method: 'PIX' })
    enrollOpen.value = true
    alunos.execute()
    plans.execute()
  }

  const enroll = useAction(async () => {
    if (!enrollForm.userId || !enrollForm.planPriceId) return
    await billingApi.enroll({ ...enrollForm, userId: enrollForm.userId, planPriceId: enrollForm.planPriceId })
    enrollOpen.value = false
    await query.refresh()
  }, 'Matrícula registrada')

  return withAsync(query, { status, updatePayment, chargeNext, enrollOpen, enrollForm, alunoOptions, priceOptions, openEnroll, enroll })
}
