import { z } from 'zod'
import { and, count, eq, ne } from 'drizzle-orm'

const body = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  role: z.enum(ROLES).optional(),
  active: z.boolean().optional(),
  phone: z.string().trim().max(30).nullish(),
  coachId: z.number().int().positive().nullish(),
  password: z.string().min(8).max(200).optional(),
})

export default defineEventHandler(async (event) => {
  const me = await requireAdmin(event)
  const id = getIdParam(event)
  const { password, ...data } = await readValidatedBody(event, body.parse)
  const db = await useDb()

  // nunca deixar o sistema sem admin ativo
  if ((data.role && data.role !== 'admin') || data.active === false) {
    const target = await db.query.users.findFirst({ where: (u) => eq(u.id, id) })
    if (target?.role === 'admin') {
      const n = (await db
        .select({ n: count() })
        .from(tables.users)
        .where(and(eq(tables.users.role, 'admin'), eq(tables.users.active, true), ne(tables.users.id, id))))[0]?.n ?? 0
      if (!n) throw createError({ statusCode: 422, message: 'É preciso manter ao menos um admin ativo' })
    }
  }
  if (id === me.id && data.active === false) {
    throw createError({ statusCode: 422, message: 'Você não pode desativar a própria conta' })
  }

  const patch: Partial<typeof tables.users.$inferInsert> = { ...data }
  if (password) patch.passwordHash = await hashPassword(password)
  const [u] = await db.update(tables.users).set(patch).where(eq(tables.users.id, id)).returning()
  if (!u) notFound('Usuário')
  return publicUser(u)
})
