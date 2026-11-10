/** Notificações do usuário (sino do topo + página de notificações). */
export function useNotifications() {
  const query = useFetch('/api/me/notifications', { key: 'notifications', default: () => [] })
  const unread = computed(() => unreadCount(query.data.value))

  // badge no ícone do app instalado acompanha o sino (zera quando o aluno lê)
  if (import.meta.client && 'setAppBadge' in navigator) {
    watch(unread, (n) => (n ? navigator.setAppBadge(n) : navigator.clearAppBadge()).catch(() => {}), { immediate: true })
  }

  async function markAllRead() {
    if (!unread.value) return
    await accountApi.markNotificationsRead()
    setTimeout(() => query.refresh(), 1500)
  }

  return withAsync(query, { unread, markAllRead })
}
