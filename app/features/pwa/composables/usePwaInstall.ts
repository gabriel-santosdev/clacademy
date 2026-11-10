import type { InstallPlatform } from '../domain/platform'

/**
 * Instalação do app (PWA).
 * - Android/desktop com Chrome/Edge: usa o prompt nativo (beforeinstallprompt).
 * - iOS/Safari e demais: abre instruções passo a passo.
 */
export function usePwaInstall() {
  const { $pwa } = useNuxtApp()
  const platform = useState<InstallPlatform>('pwa-platform', () => 'desktop')
  const standalone = useState('pwa-standalone', () => false)
  const helpOpen = useState('pwa-help-open', () => false)

  onMounted(() => {
    platform.value = detectPlatform(navigator.userAgent, navigator.maxTouchPoints)
    standalone.value =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true
  })

  const canPrompt = computed(() => !!$pwa?.showInstallPrompt)
  const installed = computed(() => standalone.value || !!$pwa?.isPWAInstalled)
  const steps = computed(() => installSteps(platform.value))

  async function install() {
    if (canPrompt.value) await $pwa?.install()
    else helpOpen.value = true
  }

  return { platform, installed, canPrompt, steps, helpOpen, install }
}
