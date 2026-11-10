import type { Role } from '#shared/utils/constants'
import type { ApiResponse } from '~/utils/api'

/** Regras de gestão de usuários. Puro. */

export type AdminUser = ApiResponse<'/api/admin/users'>[number]

export interface NewUserForm {
  name: string
  email: string
  password: string
  role: Role
  phone: string
}

export interface EditUserForm {
  id: number
  name: string
  role: Role
  active: boolean
  coachId: number | null
  password: string
}

export const emptyNewUser = (): NewUserForm => ({ name: '', email: '', password: '', role: 'professor', phone: '' })

export function userToEditForm(u: AdminUser): EditUserForm {
  return { id: u.id, name: u.name, role: u.role, active: u.active, coachId: u.coachId, password: '' }
}

export function editFormToPatch(f: EditUserForm) {
  return { name: f.name, role: f.role, active: f.active, coachId: f.coachId, password: f.password || undefined }
}

export function searchUsers<T extends { name: string; email: string }>(users: T[], term: string) {
  const t = term.trim().toLowerCase()
  return t ? users.filter((u) => u.name.toLowerCase().includes(t) || u.email.toLowerCase().includes(t)) : users
}

export function roleSeverity(role: Role) {
  return role === 'admin' ? 'contrast' : role === 'professor' ? 'info' : 'secondary'
}
