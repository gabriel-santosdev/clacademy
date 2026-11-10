import type { Role } from '#shared/utils/constants'

/** Regras do acompanhamento professor ↔ aluno. Puro. */

/** Professor começa vendo só os próprios alunos; admin começa vendo todos. */
export function defaultScope(role: Role | undefined): '1' | '0' {
  return role === 'professor' ? '1' : '0'
}

export const SCOPE_OPTIONS = [
  { label: 'Meus alunos', value: '1' },
  { label: 'Todos', value: '0' },
]

export function coachLabel(coachId: number | null, myId: number | undefined) {
  if (!coachId) return 'Nenhum'
  return coachId === myId ? 'Você' : 'Outro professor'
}

export function emptyStudentsText(scope: '1' | '0') {
  return scope === '1'
    ? 'Nenhum aluno vinculado a você ainda. Veja em Todos e assuma alunos.'
    : 'Ainda não há alunos cadastrados.'
}

export const AUDIENCE_OPTIONS = [
  { label: 'Meus alunos', value: 'mine' },
  { label: 'Todos', value: 'all' },
  { label: 'Selecionar', value: 'selected' },
] as const
