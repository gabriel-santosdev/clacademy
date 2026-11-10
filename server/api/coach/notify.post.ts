import { z } from 'zod'
import { and, eq, inArray } from 'drizzle-orm'

const body = z.object({
  audience: z.enum(['all', 'mine', 'selected']),
  userIds: z.array(z.number().int().positive()).optional(),
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().max(500).optional(),
  url: z.string().trim().max(300).optional(),
})

/** Envia aviso (notificação no app + push) para alunos. */
export default defineEventHandler(async (event) => {
  const me = await requireStaff(event)
  const data = await readValidatedBody(event, body.parse)
  const db = await useDb()

  let where = eq(tables.users.role, 'aluno')
  if (data.audience === 'mine') where = and(where, eq(tables.users.coachId, me.id))!
  if (data.audience === 'selected') {
    if (!data.userIds?.length) throw createError({ statusCode: 400, message: 'Selecione ao menos um aluno' })
    where = and(where, inArray(tables.users.id, data.userIds))!
  }
  const targets = await db.select({ id: tables.users.id }).from(tables.users).where(and(where, eq(tables.users.active, true)))
  await notifyUsers(
    targets.map((t) => t.id),
    { title: data.title, body: data.body, url: data.url || '/app/aluno' },
  )
  return { sent: targets.length }
})
