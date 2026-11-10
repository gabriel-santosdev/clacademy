import { z } from 'zod'
import { eq } from 'drizzle-orm'

/**
 * Confirma o e-mail pelo token do link e já deixa o aluno logado.
 * É POST (chamado pela página /verificar-email) para que leitores de link
 * de antivírus, que só fazem GET, não consumam o token antes do aluno.
 */
export default defineEventHandler(async (event) => {
  const { token } = await readValidatedBody(event, z.object({ token: z.string().min(10).max(200) }).parse)
  const user = await consumeEmailToken(token, 'verify_email')
  if (!user.active) throw createError({ statusCode: 403, message: 'Conta desativada. Fale com a CL Academy.' })

  if (!user.emailVerifiedAt) {
    const db = await useDb()
    await db.update(tables.users).set({ emailVerifiedAt: new Date() }).where(eq(tables.users.id, user.id))
  }
  await setUserSession(event, { user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  return { role: user.role }
})
