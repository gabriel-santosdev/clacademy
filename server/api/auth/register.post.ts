import { z } from 'zod'
import { eq } from 'drizzle-orm'

const body = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(200),
  phone: z.string().trim().max(30).optional(),
})

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

  await setUserSession(event, { user: { id: user!.id, name: user!.name, email: user!.email, role: user!.role } })
  return { ok: true }
})
