import type { Role } from '#shared/utils/constants'

/** Regras de navegação por papel (quem vê o quê e onde cada um "mora"). */

export interface NavItem {
  to: string
  label: string
  /** classe primeicons, ex.: 'pi-home' */
  icon: string
  exact?: boolean
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

export function homeFor(role: Role | undefined) {
  if (role === 'admin') return '/app/admin'
  if (role === 'professor') return '/app/professor'
  return '/app/aluno'
}

/** Rota da tela de conta/perfil de cada papel. */
export function accountPathFor(role: Role | undefined) {
  return role === 'aluno' ? '/app/aluno/perfil' : '/app/conta'
}

/** O papel pode acessar o caminho? (usado pelo middleware de rotas) */
export function canAccess(role: Role | undefined, path: string) {
  if (path.startsWith('/app/admin')) return role === 'admin'
  if (path.startsWith('/app/professor')) return role === 'admin' || role === 'professor'
  if (path.startsWith('/app/aluno')) return role === 'aluno'
  return true
}

const ALUNO: NavItem[] = [
  { to: '/app/aluno', label: 'Hoje', icon: 'pi-home', exact: true },
  { to: '/app/aluno/treinos', label: 'Treinos', icon: 'pi-bolt' },
  { to: '/app/aluno/historico', label: 'Histórico', icon: 'pi-chart-line' },
  { to: '/app/aluno/plano', label: 'Plano', icon: 'pi-credit-card' },
  { to: '/app/aluno/perfil', label: 'Perfil', icon: 'pi-user' },
]

const COACH: NavItem[] = [
  { to: '/app/professor', label: 'Painel', icon: 'pi-home', exact: true },
  { to: '/app/professor/alunos', label: 'Alunos', icon: 'pi-users' },
  { to: '/app/professor/treinos', label: 'Treinos', icon: 'pi-bolt' },
  { to: '/app/professor/corridas', label: 'Corridas', icon: 'pi-map' },
  { to: '/app/professor/exercicios', label: 'Exercícios', icon: 'pi-images' },
  { to: '/app/professor/avisos', label: 'Avisos', icon: 'pi-megaphone' },
]

const ADMIN: NavItem[] = [
  { to: '/app/admin', label: 'Dashboard', icon: 'pi-chart-bar', exact: true },
  { to: '/app/admin/planos', label: 'Planos & preços', icon: 'pi-tags' },
  { to: '/app/admin/financeiro', label: 'Financeiro', icon: 'pi-wallet' },
  { to: '/app/admin/usuarios', label: 'Usuários', icon: 'pi-id-card' },
  { to: '/app/admin/configuracoes', label: 'Configurações', icon: 'pi-cog' },
]

export function navFor(role: Role | undefined): { sections: NavSection[]; primary: NavItem[] } {
  if (role === 'admin') {
    return {
      sections: [
        { title: 'Gestão', items: ADMIN },
        { title: 'Treinamento', items: COACH.map((i) => (i.exact ? { ...i, label: 'Painel do professor' } : i)) },
      ],
      primary: [ADMIN[0]!, ADMIN[1]!, ADMIN[2]!, COACH[1]!],
    }
  }
  if (role === 'professor') return { sections: [{ items: COACH }], primary: COACH.slice(0, 4) }
  return {
    sections: [{ items: ALUNO }, { title: 'Conectar', items: [{ to: '/app/aluno/perfil/integracoes', label: 'Relógio e apps', icon: 'pi-link' }] }],
    primary: ALUNO,
  }
}

export function isNavActive(item: NavItem, path: string) {
  return item.exact ? path === item.to : path.startsWith(item.to)
}

/** Entre várias seções, só o item mais específico que casa com o caminho fica ativo. */
export function activeNavTarget(sections: NavSection[], path: string) {
  let best: string | null = null
  for (const item of sections.flatMap((s) => s.items)) {
    if (isNavActive(item, path) && item.to.length > (best?.length ?? -1)) best = item.to
  }
  return best
}
