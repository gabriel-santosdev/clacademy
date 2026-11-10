import type { ApiResponse } from '~/utils/api'
import type { ProfilePatch } from '../api/accountApi'

export type Profile = ApiResponse<'/api/me/profile'>
export type AppNotification = ApiResponse<'/api/me/notifications'>[number]

export interface ProfileForm {
  name: string
  phone: string
  cpf: string
  birthDate: string
  bio: string
}

export function profileToForm(p: Profile | null | undefined): ProfileForm {
  return {
    name: p?.name ?? '',
    phone: p?.phone ?? '',
    cpf: p?.cpf ?? '',
    birthDate: p?.birthDate ?? '',
    bio: p?.bio ?? '',
  }
}

/** Monta o PATCH só com os campos que o papel edita; vazio vira null. */
export function profileFormToPatch(form: ProfileForm, kind: 'aluno' | 'staff'): ProfilePatch {
  const base = { name: form.name, phone: form.phone || null }
  return kind === 'aluno'
    ? { ...base, cpf: form.cpf || null, birthDate: form.birthDate || null }
    : { ...base, bio: form.bio || null }
}

export function unreadCount(items: { readAt: string | null }[]) {
  return items.filter((n) => !n.readAt).length
}
