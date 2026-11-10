type Mode = 'light' | 'dark'
const KEY = 'cl-color-mode'
const DARK_CLASS = 'app-dark'

/** Modo claro/escuro da área logada (preferência por dispositivo). */
export function useAppColorMode() {
  const mode = useState<Mode>('color-mode', () => 'light')

  function apply(m: Mode) {
    mode.value = m
    if (!import.meta.client) return
    document.documentElement.classList.toggle(DARK_CLASS, m === 'dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', m === 'dark' ? '#141414' : '#EEEDEB')
    try {
      localStorage.setItem(KEY, m)
    } catch {}
  }

  function init() {
    if (!import.meta.client) return
    let saved: string | null = null
    try {
      saved = localStorage.getItem(KEY)
    } catch {}
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    apply(saved === 'dark' || saved === 'light' ? saved : prefersDark ? 'dark' : 'light')
  }

  /** A landing é sempre clara: remove o modo escuro ao sair do app. */
  function reset() {
    if (import.meta.client) document.documentElement.classList.remove(DARK_CLASS)
  }

  return { mode, toggle: () => apply(mode.value === 'dark' ? 'light' : 'dark'), init, reset }
}
