/** Configurações do site e status das integrações (admin). Use com await. */
export function useSiteSettings() {
  const query = useFetch('/api/admin/settings', { key: 'admin-settings' })
  const form = reactive(emptySettingsForm())
  watch(query.data, (d) => d && Object.assign(form, d.settings), { immediate: true })

  const save = useAction(async () => {
    await adminApi.saveSettings({ ...form })
    await Promise.all([query.refresh(), refreshNuxtData('public-settings')])
  }, 'Configurações salvas')

  /** Sincronização automática do Strava (webhook): corridas do relógio chegam sem o aluno abrir o app. */
  const stravaAutoSync = useAction(async (on: boolean) => {
    await (on ? adminApi.enableStravaAutoSync() : adminApi.disableStravaAutoSync())
    await query.refresh()
  }, 'Sincronização do Strava atualizada')

  return withAsync(query, { form, save, stravaAutoSync })
}
