import { and, count, inArray, isNull } from 'drizzle-orm'
import { sendNotification, setVapidDetails } from 'web-push'

interface NotifyPayload {
  title: string
  body?: string
  url?: string
  /** notificações com a mesma tag se substituem na barra do celular (não empilham repetidas) */
  tag?: string
}

let vapidReady: boolean | null = null

function ensureVapid() {
  if (vapidReady !== null) return vapidReady
  const config = useRuntimeConfig()
  if (config.vapidPrivateKey && config.public.vapidPublicKey) {
    setVapidDetails(config.vapidSubject, config.public.vapidPublicKey, config.vapidPrivateKey)
    vapidReady = true
  } else {
    vapidReady = false
  }
  return vapidReady
}

/** Cria notificações no app e envia web push (se VAPID estiver configurado). */
export async function notifyUsers(userIds: number[], payload: NotifyPayload) {
  if (!userIds.length) return
  const db = await useDb()
  await db.insert(tables.notifications).values(
    userIds.map((userId) => ({ userId, title: payload.title, body: payload.body, url: payload.url })),
  )

  if (!ensureVapid()) return
  const subs = await db.select().from(tables.pushSubscriptions).where(inArray(tables.pushSubscriptions.userId, userIds))
  if (!subs.length) return

  // número de não lidas de cada usuário: vira o badge no ícone do app instalado
  const unreadRows = await db
    .select({ userId: tables.notifications.userId, unread: count() })
    .from(tables.notifications)
    .where(and(inArray(tables.notifications.userId, userIds), isNull(tables.notifications.readAt)))
    .groupBy(tables.notifications.userId)
  const unread = new Map(unreadRows.map((r) => [r.userId, r.unread]))

  const dead: number[] = []
  await Promise.all(
    subs.map(async (s) => {
      try {
        const body = JSON.stringify({ ...payload, badgeCount: unread.get(s.userId) ?? 0 })
        // urgência alta: o Android entrega mesmo em economia de energia; TTL de 1 dia se o celular estiver offline
        await sendNotification({ endpoint: s.endpoint, keys: s.keys }, body, { TTL: 86400, urgency: 'high', topic: payload.tag?.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32) || undefined })
      } catch (err: unknown) {
        const code = (err as { statusCode?: number }).statusCode
        if (code === 404 || code === 410) dead.push(s.id)
      }
    }),
  )
  if (dead.length) await db.delete(tables.pushSubscriptions).where(inArray(tables.pushSubscriptions.id, dead))
}
