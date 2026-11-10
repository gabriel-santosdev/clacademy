/** Notificações do usuário (sino do topo + página de notificações). */
export function useNotifications() {
  const query = useFetch('/api/me/notifications', { key: 'notifications', default: () => [] })
  const unread = computed(() => unreadCount(query.data.value))

  async function markAllRead() {
    if (!unread.value) return
    await accountApi.markNotificationsRead()
    setTimeout(() => query.refresh(), 1500)
  }

  return withAsync(query, { unread, markAllRead })
}
