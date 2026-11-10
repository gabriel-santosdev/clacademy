import { z } from 'zod'
import { eq } from 'drizzle-orm'

const body = z.object({
  token: z.string().min(10).max(200),
  password: z.string().min(8).max(200),
})

/** Troca a senha pelo link do e-mail e já deixa o usuário logado. */
export default defineEventHandler(async (event) => {
  const { token, password } = await readValidatedBody(event, body.parse)
  const user = await consumeEmailToken(token, 'reset_password')
  if (!user.active) throw createError({ statusCode: 403, message: 'Conta desativada. Fale com a CL Academy.' })

  const db = await useDb()
  await db
    .update(tables.users)
    // quem recebeu o link no e-mail provou que o e-mail é dele
    .set({ passwordHash: await hashPassword(password), emailVerifiedAt: user.emailVerifiedAt ?? new Date() })
    .where(eq(tables.users.id, user.id))

  await setUserSession(event, { user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  return { role: user.role }
})
