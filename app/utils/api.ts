import type { InternalApi } from 'nitropack/types'

/** Tipo da resposta de uma rota da API (inferido do handler no servidor). */
export type ApiResponse<
  P extends keyof InternalApi,
  M extends keyof InternalApi[P] = 'get' extends keyof InternalApi[P] ? 'get' : keyof InternalApi[P],
> = InternalApi[P][M]

/** Extrai a mensagem amigável de um erro de $fetch (h3 / zod). */
export function errorMessage(err: unknown, fallback = 'Algo deu errado. Tente novamente.') {
  const e = err as {
    data?: { statusMessage?: string; message?: string; data?: { issues?: { message: string }[] } }
    statusMessage?: string
    message?: string
  }
  const issue = e?.data?.data?.issues?.[0]?.message
  return issue || e?.data?.message || e?.data?.statusMessage || e?.statusMessage || e?.message || fallback
}
