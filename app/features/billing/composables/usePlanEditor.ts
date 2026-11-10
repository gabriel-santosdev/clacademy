import { useConfirm } from 'primevue/useconfirm'
import type { BillingInterval } from '#shared/utils/constants'

interface PriceVersion {
  id: number
  interval: BillingInterval
  amountCents: number
  version: number
  active: boolean
  createdAt: string
}

/** Criar/editar plano com preços versionados. `param` é o id da rota ou 'novo'. */
export function usePlanEditor(param: string) {
  const notify = useNotify()
  const confirm = useConfirm()
  const isNew = param === 'novo'
  const id = isNew ? 0 : Number(param)

  const form = reactive(emptyPlanForm())
  const prices = reactive(emptyPriceForm())
  const history = ref<PriceVersion[]>([])

  async function load() {
    if (isNew) return
    const p = await billingApi.getPlan(id).catch(() => null)
    if (!p) throw createError({ statusCode: 404, statusMessage: 'Plano não encontrado' })
    const parsed = planToForm(p)
    Object.assign(form, parsed.form)
    Object.assign(prices, parsed.prices)
    history.value = p.prices
  }

  const hasPrice = computed(() => priceFormToList(prices).length > 0)
  const monthlyEquivalent = (i: BillingInterval) => monthlyEquivalentLabel(prices, i)

  const save = useAction(async (publish?: boolean) => {
    const body = planFormToPayload(form, prices, publish)
    if (isNew) {
      const p = await billingApi.createPlan(body)
      await navigateTo(`/app/admin/planos/${p!.id}`, { replace: true })
    } else {
      await billingApi.updatePlan(id, body)
      if (publish) form.status = 'published'
      history.value = (await billingApi.getPlan(id)).prices
    }
  }, 'Plano salvo')

  const remove = useAction(async () => {
    const r = await billingApi.deletePlan(id)
    notify.success('archived' in r ? 'Plano arquivado' : 'Plano excluído', 'archived' in r ? 'Ele possui assinaturas.' : undefined)
    await navigateTo('/app/admin/planos')
  })

  function askRemove() {
    confirm.require({
      header: 'Excluir plano?',
      message: 'Se o plano já tiver assinaturas, ele será arquivado em vez de excluído.',
      icon: 'pi pi-trash',
      acceptProps: { label: 'Excluir', severity: 'danger' },
      rejectProps: { label: 'Cancelar', severity: 'secondary', text: true },
      accept: () => remove(),
    })
  }

  return {
    isNew,
    form,
    prices,
    history,
    hasPrice,
    monthlyEquivalent,
    load,
    save,
    askRemove,
    addFeature: () => form.features.push(''),
    removeFeature: (i: number) => form.features.splice(i, 1),
  }
}
