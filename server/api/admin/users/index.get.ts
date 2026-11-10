import { asc, eq } from 'drizzle-orm'
import { ROLES, type Role } from '#shared/utils/constants'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { role } = getQuery(event) as { role?: string }
  const db = await useDb()
  return db.query.users.findMany({
    where: role && (ROLES as readonly string[]).includes(role) ? (u) => eq(u.role, role as Role) : undefined,
    orderBy: (u) => [asc(u.role), asc(u.name)],
    columns: { passwordHash: false },
  })
})
