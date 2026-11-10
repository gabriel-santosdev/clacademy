import { z } from 'zod'
import { eq } from 'drizzle-orm'

/** Envia o link de redefinição de senha. Responde sempre igual, para não revelar quais e-mails existem. */
export default defineEventHandler(async (event) => {
  const { email } = await readValidatedBody(event, z.object({ email: z.string().trim().toLowerCase().email() }).parse)
  const db = await useDb()
  const user = await db.query.users.findFirst({ where: (u) => eq(u.email, email) })

  if (user && user.active && !(await sentRecently(user.id, 'reset_password'))) {
    const token = await createEmailToken(user.id, 'reset_password')
    await sendEmail({ to: user.email, ...emailTemplates.resetPassword(user.name, siteLink(`/redefinir-senha?token=${token}`)) })
  }
  return { ok: true }
})
