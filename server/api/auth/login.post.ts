import { z } from 'zod'
import { eq } from 'drizzle-orm'

const body = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, body.parse)
  const db = await useDb()
  const user = await db.query.users.findFirst({ where: (u) => eq(u.email, email) })

  if (!user || !(await verifyPassword(user.passwordHash, password))) {
    throw createError({ statusCode: 401, message: 'E-mail ou senha inválidos' })
  }
  if (!user.active) throw createError({ statusCode: 403, message: 'Conta desativada. Fale com a CL Academy.' })
  if (!user.emailVerifiedAt) {
    throw createError({
      statusCode: 403,
      message: 'Confirme seu e-mail para entrar. Enviamos um link para a sua caixa de entrada.',
      data: { code: 'EMAIL_NOT_VERIFIED' },
    })
  }

  await setUserSession(event, { user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  return { role: user.role }
})
