/** Tela de integrações: estado do Strava, aparelhos detectados e atividades recebidas. Use com await. */
export function useIntegrations() {
  const notify = useNotify()
  const route = useRoute()
  const query = useFetch('/api/me/integrations', { key: 'me-integrations' })

  onMounted(() => {
    if (route.query.strava === 'ok') notify.success('Strava conectado!', 'Suas atividades recentes foram importadas.')
    if (route.query.strava === 'erro') notify.error('Não foi possível conectar ao Strava.')
    if (route.query.strava) navigateTo({ query: {} }, { replace: true })
  })

  const sync = useAction(async () => {
    const r = await integrationsApi.syncStrava()
    if (!r.imported) notify.info('Tudo em dia', 'Nenhuma atividade nova no Strava.')
    else notify.success(`${r.imported} atividade(s) importada(s)`, r.checkouts ? `${r.checkouts} treino(s) marcado(s) como feito.` : undefined)
    await Promise.all([query.refresh(), refreshNuxtData('me-overview')])
  })

  const disconnect = useAction(async () => {
    await integrationsApi.disconnectStrava()
    await query.refresh()
  }, 'Strava desconectado')

  const rate = useAction(async (id: number, rpe: number) => {
    await integrationsApi.rateActivity(id, { rpe })
    await query.refresh()
  }, 'Esforço registrado')

  return withAsync(query, { sync, disconnect, rate, connectUrl: integrationsApi.stravaConnectUrl })
}
