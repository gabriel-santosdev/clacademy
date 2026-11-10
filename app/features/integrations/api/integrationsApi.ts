/** Comandos HTTP das integrações (Strava como hub dos relógios). */
export const integrationsApi = {
  stravaConnectUrl: '/api/me/strava/connect',
  syncStrava: () => $fetch<{ imported: number; checkouts: number }>('/api/me/strava/sync', { method: 'POST' }),
  disconnectStrava: () => $fetch('/api/me/strava', { method: 'DELETE' }),
  /** completa uma atividade importada: esforço (1-10) e observação */
  rateActivity: (id: number, body: { rpe?: number | null; notes?: string | null }) =>
    $fetch(`/api/me/logs/${id}`, { method: 'PATCH', body }),
}
