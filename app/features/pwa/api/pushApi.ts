export const pushApi = {
  subscribe: (subscription: PushSubscriptionJSON) => $fetch('/api/me/push', { method: 'POST', body: subscription }),
  unsubscribe: (endpoint: string) => $fetch('/api/me/push', { method: 'DELETE', body: { endpoint } }),
}
