export type PushPermission = NotificationPermission | 'unsupported'

/** Chave VAPID (base64url) → bytes para o PushManager. */
export function vapidKeyToBytes(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

/** Texto de status das notificações para o usuário. */
export function pushStatusText(state: { supported: boolean; available: boolean; permission: PushPermission }) {
  if (!state.supported) return 'Seu navegador não suporta notificações. No iPhone, instale o app na tela inicial primeiro.'
  if (!state.available) return 'Notificações ainda não configuradas pela academia.'
  if (state.permission === 'denied') return 'Bloqueadas nas configurações do navegador.'
  return 'Receba avisos de novos treinos, feedbacks e pagamentos.'
}
