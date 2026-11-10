/** Feedback do professor em um registro do aluno. */
export function useFeedback(onSent: () => Promise<unknown>) {
  const drafts = reactive<Record<number, string>>({})
  const openId = ref<number | null>(null)

  const send = useAction(async (logId: number) => {
    const text = drafts[logId]?.trim()
    if (!text) return
    await coachingApi.sendFeedback(logId, text)
    delete drafts[logId]
    openId.value = null
    await onSent()
  }, 'Feedback enviado')

  return { drafts, openId, send }
}
