export interface ProfilePatch {
  name?: string
  phone?: string | null
  cpf?: string | null
  birthDate?: string | null
  bio?: string | null
}

export interface PasswordChange {
  currentPassword: string
  newPassword: string
}

export const accountApi = {
  updateProfile: (body: ProfilePatch) => $fetch('/api/me/profile', { method: 'PATCH', body }),
  changePassword: (body: PasswordChange) => $fetch('/api/me/profile', { method: 'PATCH', body }),
  markNotificationsRead: () => $fetch('/api/me/notifications/read', { method: 'POST' }),
  syncStrava: () => $fetch('/api/me/strava/sync', { method: 'POST' }),
  disconnectStrava: () => $fetch('/api/me/strava', { method: 'DELETE' }),
  stravaConnectUrl: '/api/me/strava/connect',
}
