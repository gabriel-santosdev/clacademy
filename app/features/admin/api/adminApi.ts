import type { NewUserForm } from '../domain/users'
import type { SettingsForm } from '../domain/settings'

type UserPatch = ReturnType<typeof editFormToPatch>

export const adminApi = {
  createUser: (f: NewUserForm) =>
    $fetch('/api/admin/users', {
      method: 'POST',
      body: { name: f.name, email: f.email, password: f.password, role: f.role, phone: f.phone || undefined },
    }),
  updateUser: (id: number, body: UserPatch) => $fetch(`/api/admin/users/${id}`, { method: 'PATCH', body }),
  saveSettings: (body: SettingsForm) => $fetch('/api/admin/settings', { method: 'PUT', body }),
  enableStravaAutoSync: () => $fetch('/api/admin/strava/webhook', { method: 'POST' }),
  disableStravaAutoSync: () => $fetch('/api/admin/strava/webhook', { method: 'DELETE' }),
}
