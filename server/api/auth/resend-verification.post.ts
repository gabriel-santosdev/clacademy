import { z } from 'zod'
import { eq } from 'drizzle-orm'

/** Reenvia o link de confirmação. Responde sempre igual, para não revelar quais e-mails existem. */
export default defineEventHandler(async (event) => {
  const { email } = await readValidatedBody(event, z.object({ email: z.string().trim().toLowerCase().email() }).parse)
  const db = await useDb()
  const user = await db.query.users.findFirst({ where: (u) => eq(u.email, email) })

  if (user && user.active && !user.emailVerifiedAt && !(await sentRecently(user.id, 'verify_email'))) {
    await sendVerificationEmail(user)
  }
  return { ok: true }
})
