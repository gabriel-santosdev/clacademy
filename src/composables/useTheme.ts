type Theme = 'default' | 'brasil'

export function useTheme(theme: Theme) {
  if (theme === 'brasil') {
    document.documentElement.setAttribute('data-theme', 'brasil')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}
