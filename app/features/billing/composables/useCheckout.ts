import type { Ref } from 'vue'
import type { PublicPlan } from '../domain/pricing'
import type { BillingType } from '../domain/status'

/** Contratação de um plano pelo aluno. */
export function useCheckout(plans: Ref<PublicPlan[]>, defaultCpf: () => string, onDone: () => Promise<unknown>) {
  const notify = useNotify()
  const visible = ref(false)
  const form = reactive({ planId: 0, priceId: 0, billingType: 'PIX' as BillingType, cpf: '' })
  const plan = computed(() => plans.value.find((p) => p.id === form.planId))

  function start(planId: number) {
    const p = plans.value.find((x) => x.id === planId)
    if (!p) return
    Object.assign(form, { planId, priceId: p.prices[0]?.id ?? 0, cpf: defaultCpf() })
    visible.value = true
  }

  const submit = useAction(async () => {
    const r = await billingApi.subscribe({ planPriceId: form.priceId, billingType: form.billingType, cpf: form.cpf || undefined })
    visible.value = false
    await onDone()
    if (r.invoiceUrl) window.open(r.invoiceUrl, '_blank')
    notify.success(r.status === 'trialing' ? 'Período de teste iniciado! 🎉' : 'Assinatura criada!', r.status === 'trialing' ? undefined : 'Conclua o pagamento.')
  })

  return { visible, form, plan, start, submit }
}
