import { inArray } from 'drizzle-orm'
import { sendNotification, setVapidDetails } from 'web-push'

interface NotifyPayload {
  title: string
  body?: string
  url?: string
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
  const dead: number[] = []
  await Promise.all(
    subs.map(async (s) => {
      try {
        await sendNotification({ endpoint: s.endpoint, keys: s.keys }, JSON.stringify(payload))
      } catch (err: unknown) {
        const code = (err as { statusCode?: number }).statusCode
        if (code === 404 || code === 410) dead.push(s.id)
      }
    }),
  )
  if (dead.length) await db.delete(tables.pushSubscriptions).where(inArray(tables.pushSubscriptions.id, dead))
}
