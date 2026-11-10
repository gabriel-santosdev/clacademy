import { z } from 'zod'
import { eq } from 'drizzle-orm'

const body = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(30).nullable().optional(),
  cpf: z
    .string()
    .trim()
    .transform((s) => s.replace(/\D/g, ''))
    .refine((s) => s === '' || s.length === 11, 'CPF deve ter 11 dígitos')
    .nullable()
    .optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  bio: z.string().trim().max(1000).nullable().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).max(200).optional(),
})

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const { currentPassword, newPassword, ...data } = await readValidatedBody(event, body.parse)
  const db = await useDb()

  const patch: Partial<typeof tables.users.$inferInsert> = { ...data, cpf: data.cpf === '' ? null : data.cpf }
  if (newPassword) {
    const u = await db.query.users.findFirst({ where: (x) => eq(x.id, session.user.id) })
    if (!u || !currentPassword || !(await verifyPassword(u.passwordHash, currentPassword))) {
      throw createError({ statusCode: 400, message: 'Senha atual incorreta' })
    }
    patch.passwordHash = await hashPassword(newPassword)
  }

  const [u] = await db.update(tables.users).set(patch).where(eq(tables.users.id, session.user.id)).returning()
  if (data.name) await setUserSession(event, { user: { ...session.user, name: u!.name } })
  return publicUser(u!)
})
