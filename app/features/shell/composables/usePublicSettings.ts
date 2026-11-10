import type { ApiResponse } from '~/utils/api'

export type PublicSettings = ApiResponse<'/api/settings'>

/** Configurações públicas do site (tema, "vem aí", contatos). Use com await. */
export function usePublicSettings() {
  return useFetch('/api/settings', { key: 'public-settings' })
}
