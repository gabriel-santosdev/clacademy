/** Configurações do site e status das integrações (admin). Use com await. */
export function useSiteSettings() {
  const query = useFetch('/api/admin/settings', { key: 'admin-settings' })
  const form = reactive(emptySettingsForm())
  watch(query.data, (d) => d && Object.assign(form, d.settings), { immediate: true })

  const save = useAction(async () => {
    await adminApi.saveSettings({ ...form })
    await Promise.all([query.refresh(), refreshNuxtData('public-settings')])
  }, 'Configurações salvas')

  return withAsync(query, { form, save })
}
