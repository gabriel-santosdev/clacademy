/**
 * Executa uma ação assíncrona com estado de loading e toast de sucesso/erro.
 * const save = useAction(async () => {...}, 'Salvo!')
 * save()  ·  save.loading.value
 */
export function useAction<A extends unknown[], R>(fn: (...args: A) => Promise<R>, successMessage?: string) {
  const loading = ref(false)
  const notify = useNotify()
  async function run(...args: A): Promise<R | undefined> {
    loading.value = true
    try {
      const r = await fn(...args)
      if (successMessage) notify.success(successMessage)
      return r
    } catch (err) {
      notify.error(errorMessage(err))
      return undefined
    } finally {
      loading.value = false
    }
  }
  return Object.assign(run, { loading })
}
