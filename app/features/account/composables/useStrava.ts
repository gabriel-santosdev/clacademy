/** Integração Strava: conectar, sincronizar e desconectar. */
export function useStrava(onChange: () => Promise<unknown>) {
  const notify = useNotify()
  const route = useRoute()

  onMounted(() => {
    if (route.query.strava === 'ok') notify.success('Strava conectado!', 'Suas corridas foram importadas.')
    if (route.query.strava === 'erro') notify.error('Não foi possível conectar ao Strava.')
  })

  const sync = useAction(async () => {
    const r = await accountApi.syncStrava()
    notify.success(r.imported ? `${r.imported} corrida(s) importada(s)` : 'Nenhuma corrida nova')
    await onChange()
  })

  const disconnect = useAction(async () => {
    await accountApi.disconnectStrava()
    await onChange()
  }, 'Strava desconectado')

  return { sync, disconnect, connectUrl: accountApi.stravaConnectUrl }
}
