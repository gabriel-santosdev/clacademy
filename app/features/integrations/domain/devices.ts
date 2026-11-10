/**
 * Relógios e apps que chegam na CL Academy pelo Strava. Puro, sem Vue.
 *
 * Por que via Strava: a Apple não libera os dados do Saúde/Apple Watch para sites (só para apps
 * nativos de iPhone), e Garmin, Coros, Polar e Suunto só abrem API direta para parceiros aprovados.
 * Todos sincronizam com o Strava nativamente, e o Strava avisa a CL Academy na hora (webhook).
 */

export interface DeviceGuide {
  id: string
  name: string
  /** monograma do bloco (sem logos de terceiros) */
  mono: string
  /** reconhece o aparelho pelo nome que o Strava informa (device_name) */
  match: RegExp
  steps: string[]
  tip?: string
}

export const STRAVA_FIRST_STEP = 'Conecte o Strava aqui na CL Academy (botão no topo desta tela).'

export const DEVICES: DeviceGuide[] = [
  {
    id: 'apple',
    name: 'Apple Watch',
    mono: '',
    match: /apple|watch\s?(series|ultra|se)/i,
    steps: [
      STRAVA_FIRST_STEP,
      'Instale o app Strava no iPhone e entre com a mesma conta.',
      'No Strava do iPhone: Você → Configurações (engrenagem) → Aplicativos, serviços e dispositivos → Saúde.',
      'Ative a sincronização de atividades. Pronto: o que você gravar no app Exercício do relógio vai para o Strava.',
    ],
    tip: 'Prefere gravar direto pelo Strava? Ele também tem app no Apple Watch.',
  },
  {
    id: 'garmin',
    name: 'Garmin',
    mono: 'G',
    match: /garmin|forerunner|fenix|f[eē]nix|venu|vivoactive|epix|instinct|enduro|edge/i,
    steps: [
      STRAVA_FIRST_STEP,
      'Abra o app Garmin Connect no celular.',
      'Toque em Mais (☰) → Configurações → Aplicativos conectados → Strava.',
      'Entre na sua conta Strava e autorize. Cada atividade que o relógio sincronizar vai para o Strava.',
    ],
  },
  {
    id: 'coros',
    name: 'COROS',
    mono: 'C',
    match: /coros|pace\s?\d|apex|vertix/i,
    steps: [
      STRAVA_FIRST_STEP,
      'Abra o app COROS no celular.',
      'Vá em Perfil → Configurações → Aplicativos de terceiros → Strava.',
      'Autorize com a sua conta Strava.',
    ],
  },
  {
    id: 'polar',
    name: 'Polar',
    mono: 'P',
    match: /polar|vantage|grit|pacer|ignite/i,
    steps: [
      STRAVA_FIRST_STEP,
      'Abra o app Polar Flow (ou flow.polar.com).',
      'Vá em Configurações → Serviços parceiros (ou Parceiros) → Strava.',
      'Conecte e autorize com a sua conta Strava.',
    ],
  },
  {
    id: 'suunto',
    name: 'Suunto',
    mono: 'S',
    match: /suunto/i,
    steps: [
      STRAVA_FIRST_STEP,
      'Abra o app Suunto no celular.',
      'Toque no seu perfil → Configurações → Serviços parceiros → Strava.',
      'Conecte e autorize com a sua conta Strava.',
    ],
  },
  {
    id: 'samsung',
    name: 'Galaxy Watch',
    mono: 'GW',
    match: /samsung|galaxy|wear\s?os/i,
    steps: [
      STRAVA_FIRST_STEP,
      'No relógio (Wear OS), instale o app Strava pela Play Store.',
      'Grave as corridas pelo Strava no relógio: elas sincronizam sozinhas.',
    ],
    tip: 'Corridas gravadas só no Samsung Health podem não ir para o Strava. Use o app Strava no relógio.',
  },
  {
    id: 'amazfit',
    name: 'Amazfit',
    mono: 'A',
    match: /amazfit|zepp|huami/i,
    steps: [
      STRAVA_FIRST_STEP,
      'Abra o app Zepp no celular.',
      'Vá em Perfil → Adicionar contas (ou Contas vinculadas) → Strava.',
      'Autorize com a sua conta Strava.',
    ],
  },
  {
    id: 'wahoo',
    name: 'Wahoo',
    mono: 'W',
    match: /wahoo|elemnt/i,
    steps: [
      STRAVA_FIRST_STEP,
      'Abra o app Wahoo (ELEMNT ou Wahoo Fitness).',
      'Vá em Perfil → Apps autorizados (ou Integrações) → Strava.',
      'Autorize com a sua conta Strava.',
    ],
  },
  {
    id: 'phone',
    name: 'Só o celular',
    mono: '',
    match: /strava\s?(iphone|android)|iphone|android/i,
    steps: [STRAVA_FIRST_STEP, 'Grave a corrida pelo app Strava com o GPS do celular. Ela chega aqui assim que você salvar.'],
  },
]

export const GUIDE_DISCLAIMER = 'Os nomes dos menus podem mudar um pouco conforme a versão do app. Procure por "Strava" nas configurações de apps conectados.'

export interface DetectedDevice {
  name: string
  runs: number
  lastAt: string | Date | null
}

/** Aparelhos detectados que pertencem a uma marca do catálogo. */
export function detectedFor(guide: DeviceGuide, devices: DetectedDevice[]) {
  return devices.filter((d) => guide.match.test(d.name))
}

/** Ordena o catálogo: marcas já detectadas primeiro. */
export function sortByDetected(devices: DetectedDevice[]) {
  return [...DEVICES].sort((a, b) => Number(detectedFor(b, devices).length > 0) - Number(detectedFor(a, devices).length > 0))
}
