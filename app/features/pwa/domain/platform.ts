/** Regras de instalação do PWA por plataforma (puro, testável). */

export type InstallPlatform = 'ios' | 'android' | 'desktop'

export function detectPlatform(userAgent: string, maxTouchPoints = 0): InstallPlatform {
  const ua = userAgent.toLowerCase()
  // iPadOS 13+ se apresenta como Mac, mas tem touch
  const isIos = /iphone|ipad|ipod/.test(ua) || (ua.includes('macintosh') && maxTouchPoints > 1)
  if (isIos) return 'ios'
  if (ua.includes('android')) return 'android'
  return 'desktop'
}

export interface InstallStep {
  icon: string
  text: string
}

/** Passo a passo manual quando o navegador não oferece o prompt nativo. */
export function installSteps(platform: InstallPlatform): InstallStep[] {
  if (platform === 'ios') {
    return [
      { icon: 'pi-compass', text: 'Abra clacademy.com.br no Safari' },
      { icon: 'pi-upload', text: 'Toque em Compartilhar, na barra inferior' },
      { icon: 'pi-plus-circle', text: 'Escolha "Adicionar à Tela de Início"' },
      { icon: 'pi-check-circle', text: 'Toque em "Adicionar" e pronto: o app aparece na sua tela' },
    ]
  }
  if (platform === 'android') {
    return [
      { icon: 'pi-compass', text: 'Abra clacademy.com.br no Chrome' },
      { icon: 'pi-ellipsis-v', text: 'Toque no menu ⋮ no canto superior' },
      { icon: 'pi-download', text: 'Escolha "Instalar app" ou "Adicionar à tela inicial"' },
      { icon: 'pi-check-circle', text: 'Confirme e o app fica junto com os outros' },
    ]
  }
  return [
    { icon: 'pi-compass', text: 'Abra clacademy.com.br no Chrome ou Edge' },
    { icon: 'pi-download', text: 'Clique no ícone de instalar na barra de endereço' },
    { icon: 'pi-check-circle', text: 'Confirme em "Instalar" e o app abre em janela própria' },
  ]
}
