/** Só aceita redirecionamentos internos (evita open redirect via ?next=//site.com). */
export function safeRedirect(next: unknown, fallback: string) {
  return typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : fallback
}

/** Login recusado porque o aluno ainda não clicou no link de confirmação. */
export function isEmailNotVerified(err: unknown) {
  return (err as { data?: { data?: { code?: string } } })?.data?.data?.code === 'EMAIL_NOT_VERIFIED'
}

/** Destino após o cadastro: tela de plano, já com o plano escolhido na landing. */
export function afterSignupPath(planId: unknown) {
  const id = Number(planId)
  return Number.isInteger(id) && id > 0 ? `/app/aluno/plano?plano=${id}` : '/app/aluno/plano'
}
