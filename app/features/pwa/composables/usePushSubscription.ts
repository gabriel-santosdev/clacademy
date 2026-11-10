import type { PushPermission } from '../domain/push'

/** Assinatura de notificações push (Web Push via service worker do PWA). */
export function usePushSubscription() {
  const config = useRuntimeConfig()
  const supported = ref(false)
  const enabled = ref(false)
  const permission = ref<PushPermission>('unsupported')
  const available = computed(() => supported.value && !!config.public.vapidPublicKey)
  const statusText = computed(() =>
    pushStatusText({ supported: supported.value, available: available.value, permission: permission.value }),
  )
  const canToggle = computed(() => available.value && permission.value !== 'denied')

  async function refresh() {
    supported.value = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
    if (!supported.value) return
    permission.value = Notification.permission
    try {
      const reg = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<null>((r) => setTimeout(() => r(null), 3000)),
      ])
      enabled.value = !!(reg && (await reg.pushManager.getSubscription()))
    } catch {
      enabled.value = false
    }
  }

  async function enable() {
    const perm = await Notification.requestPermission()
    permission.value = perm
    if (perm !== 'granted') throw new Error('Permissão de notificação negada')
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKeyToBytes(config.public.vapidPublicKey),
    })
    await pushApi.subscribe(sub.toJSON())
    enabled.value = true
  }

  async function disable() {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (sub) {
      await pushApi.unsubscribe(sub.endpoint)
      await sub.unsubscribe()
    }
    enabled.value = false
  }

  const toggle = useAction(async () => (enabled.value ? disable() : enable()))

  onMounted(refresh)
  return { supported, available, enabled, permission, statusText, canToggle, toggle }
}
