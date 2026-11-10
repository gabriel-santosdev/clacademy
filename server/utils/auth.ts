import type { H3Event } from 'h3'
import type { Role } from '#shared/utils/constants'

/** Garante sessão válida e (opcionalmente) um dos papéis informados. */
export async function requireRole(event: H3Event, ...roles: Role[]) {
  const { user } = await requireUserSession(event)
  if (roles.length && !roles.includes(user.role)) {
    throw createError({ statusCode: 403, message: 'Acesso negado' })
  }
  return user
}

export const requireStaff = (event: H3Event) => requireRole(event, 'admin', 'professor')
export const requireAdmin = (event: H3Event) => requireRole(event, 'admin')

export function publicUser<T extends { passwordHash?: string }>(u: T) {
  const { passwordHash: _, ...rest } = u
  return rest
}

export function getIdParam(event: H3Event, name = 'id') {
  const id = Number(getRouterParam(event, name))
  if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, message: 'ID inválido' })
  return id
}

export function notFound(what = 'Registro'): never {
  throw createError({ statusCode: 404, message: `${what} não encontrado` })
}
