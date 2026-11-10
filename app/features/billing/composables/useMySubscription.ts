import { useConfirm } from 'primevue/useconfirm'
/** Assinatura do aluno: status, cobrança em aberto, Pix e cancelamento. Use com await. */
export function useMySubscription() {
  const notify = useNotify()
  const confirm = useConfirm()
  const query = useFetch('/api/me/subscription', { key: 'me-subscription' })

  const sub = computed(() => query.data.value?.subscription ?? null)
  const subscribable = computed(() => canSubscribe(sub.value))
  const pendingPayment = computed(() => openPayment(query.data.value?.payments ?? []))
  const receiptLink = computed(() =>
    whatsappUrl(query.data.value?.manual.whatsapp, 'Olá! Segue o comprovante do pagamento do meu plano CL Academy.'),
  )

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(query.data.value?.manual.pixKey ?? '')
      notify.success('Chave Pix copiada')
    } catch {
      notify.error('Não foi possível copiar')
    }
  }

  const cancel = useAction(async () => {
    await billingApi.cancelSubscription()
    await query.refresh()
  }, 'Assinatura cancelada')

  function askCancel() {
    confirm.require({
      header: 'Cancelar assinatura?',
      message: 'A renovação será interrompida. Se você já pagou o período atual, o acesso continua até o fim dele.',
      icon: 'pi pi-exclamation-triangle',
      acceptProps: { label: 'Cancelar assinatura', severity: 'danger' },
      rejectProps: { label: 'Manter plano', severity: 'secondary', text: true },
      accept: () => cancel(),
    })
  }

  return withAsync(query, { sub, subscribable, pendingPayment, receiptLink, copyPix, askCancel })
}
