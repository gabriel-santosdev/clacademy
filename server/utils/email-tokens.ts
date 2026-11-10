import { createHash, randomBytes } from 'node:crypto'
import { and, eq, gt, isNull } from 'drizzle-orm'

type Purpose = 'verify_email' | 'reset_password'

const TTL_MS: Record<Purpose, number> = {
  verify_email: 48 * 3600e3,
  reset_password: 3600e3,
}

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

/** Gera um token de uso único. Só o hash fica no banco; o token vai no link do e-mail. */
export async function createEmailToken(userId: number, purpose: Purpose) {
  const db = await useDb()
  const token = randomBytes(32).toString('base64url')
  // um link novo invalida os anteriores do mesmo tipo
  await db
    .update(tables.emailTokens)
    .set({ usedAt: new Date() })
    .where(and(eq(tables.emailTokens.userId, userId), eq(tables.emailTokens.purpose, purpose), isNull(tables.emailTokens.usedAt)))
  await db.insert(tables.emailTokens).values({
    userId,
    purpose,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + TTL_MS[purpose]),
  })
  return token
}

/** Consome o token (uma única vez) e devolve o usuário dono dele, ou lança 400. */
export async function consumeEmailToken(token: string, purpose: Purpose) {
  const db = await useDb()
  const [row] = await db
    .update(tables.emailTokens)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(tables.emailTokens.tokenHash, hashToken(token)),
        eq(tables.emailTokens.purpose, purpose),
        isNull(tables.emailTokens.usedAt),
        gt(tables.emailTokens.expiresAt, new Date()),
      ),
    )
    .returning()
  const user = row && (await db.query.users.findFirst({ where: (u) => eq(u.id, row.userId) }))
  if (!user) {
    throw createError({ statusCode: 400, message: 'Este link é inválido ou expirou. Peça um novo.' })
  }
  return user
}

/** Evita disparar vários e-mails seguidos para o mesmo usuário. */
export async function sentRecently(userId: number, purpose: Purpose, seconds = 60) {
  const db = await useDb()
  const recent = await db.query.emailTokens.findFirst({
    where: (t) => and(eq(t.userId, userId), eq(t.purpose, purpose), gt(t.createdAt, new Date(Date.now() - seconds * 1000))),
  })
  return !!recent
}

export async function sendVerificationEmail(user: { id: number; name: string; email: string }, planId?: number) {
  const token = await createEmailToken(user.id, 'verify_email')
  const url = siteLink(`/verificar-email?token=${token}${planId ? `&plano=${planId}` : ''}`)
  return sendEmail({ to: user.email, ...emailTemplates.verifyEmail(user.name, url) })
}
