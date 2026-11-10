import { z } from 'zod'
import { eq } from 'drizzle-orm'

const body = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(200),
  phone: z.string().trim().max(30).optional(),
  /** plano escolhido na landing, para o link de confirmação levar direto a ele */
  planId: z.number().int().positive().optional(),
})

/** Cria a conta do aluno e envia o link de confirmação. O login só é liberado após confirmar. */
export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, body.parse)
  const db = await useDb()

  const exists = await db.query.users.findFirst({ where: (u) => eq(u.email, data.email) })
  if (exists) throw createError({ statusCode: 409, message: 'E-mail já cadastrado' })

  const [user] = await db
    .insert(tables.users)
    .values({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      passwordHash: await hashPassword(data.password),
      role: 'aluno',
    })
    .returning()

  await sendVerificationEmail(user!, data.planId)
  return { ok: true, email: user!.email }
})
