import { z } from 'zod'

const body = z.object({
  endpoint: z.string().url(),
  keys: z.object({ p256dh: z.string(), auth: z.string() }),
})

/** Registra o navegador/dispositivo para receber push. */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const sub = await readValidatedBody(event, body.parse)
  const db = await useDb()
  await db
    .insert(tables.pushSubscriptions)
    .values({ userId: user.id, endpoint: sub.endpoint, keys: sub.keys })
    .onConflictDoUpdate({ target: tables.pushSubscriptions.endpoint, set: { userId: user.id, keys: sub.keys } })
  return { ok: true }
})
