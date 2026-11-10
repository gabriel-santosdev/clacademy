import { z } from 'zod'
import { eq } from 'drizzle-orm'

const body = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(200),
  role: z.enum(ROLES),
  phone: z.string().trim().max(30).optional(),
  coachId: z.number().int().positive().nullish(),
})

/** Admin cadastra professores, outros admins ou alunos (matrícula presencial). */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { password, ...data } = await readValidatedBody(event, body.parse)
  const db = await useDb()
  if (await db.query.users.findFirst({ where: (u) => eq(u.email, data.email) })) {
    throw createError({ statusCode: 409, message: 'E-mail já cadastrado' })
  }
  const [u] = await db
    .insert(tables.users)
    // conta criada pelo admin já nasce confirmada
    .values({ ...data, passwordHash: await hashPassword(password), emailVerifiedAt: new Date() })
    .returning()
  return publicUser(u!)
})
