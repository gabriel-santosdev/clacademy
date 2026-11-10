// https://nuxt.com/docs/api/configuration/nuxt-config
import type { PrimeVueLocaleOptions } from 'primevue/config'

const title = 'CL Academy | Personal trainer e assessoria de corrida com app próprio'
const description =
  'CL Academy: personal trainer e assessoria de corrida CL Run, com app próprio. Ficha, planilha, esforço e retorno do professor no celular. Eventos com aulões para a comunidade.'

/** Rótulos pt-BR do PrimeVue (mesclados em profundidade com os padrões da lib). */
const primeLocale = {
  accept: 'Sim',
  reject: 'Não',
  choose: 'Escolher',
  cancel: 'Cancelar',
  clear: 'Limpar',
  apply: 'Aplicar',
  emptyMessage: 'Nenhuma opção disponível',
  emptyFilterMessage: 'Nenhum resultado encontrado',
  emptySearchMessage: 'Nenhum resultado encontrado',
  searchMessage: '{0} resultados disponíveis',
  selectionMessage: '{0} itens selecionados',
  emptySelectionMessage: 'Nenhum item selecionado',
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  today: 'Hoje',
  firstDayOfWeek: 0,
  dateFormat: 'dd/mm/yy',
  weak: 'Fraca',
  medium: 'Média',
  strong: 'Forte',
  passwordPrompt: 'Digite uma senha',
  aria: { close: 'Fechar', previous: 'Anterior', next: 'Próximo' },
}

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },

  modules: ['nuxt-auth-utils', '@vite-pwa/nuxt', '@primevue/nuxt-module'],

  css: ['primeicons/primeicons.css', '~/assets/css/base.css', '~/assets/css/tokens.css', '~/assets/css/app.css'],

  /**
   * Arquitetura por feature (app/features/<domínio>):
   *   domain/       regras de negócio puras (sem Vue, sem HTTP)
   *   api/          comandos HTTP (mutations) do domínio
   *   composables/  casos de uso: estado, queries (useFetch) e orquestração
   *   components/   UI apresentacional (PrimeVue), sem regra de negócio
   * app/composables, app/utils e app/components guardam só o que é transversal.
   */
  components: [
    { path: '~/components', pathPrefix: false },
    { path: '~/features', pattern: '*/components/**/*.vue', pathPrefix: false },
  ],
  imports: {
    dirs: ['features/*/domain', 'features/*/api', 'features/*/composables'],
  },

  primevue: {
    importTheme: { from: '~/theme/clacademy.ts', as: 'ClAcademyTheme' },
    options: { ripple: true, locale: primeLocale as PrimeVueLocaleOptions },
  },

  // Landing e vitrine de planos são renderizadas no servidor (SEO);
  // a área logada roda como SPA (PWA), sem SSR.
  routeRules: {
    '/': { prerender: false },
    '/app/**': { ssr: false },
  },

  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24 * 30, // 30 dias — app instalado não deve deslogar toda semana
      cookie: { sameSite: 'lax', secure: process.env.NODE_ENV === 'production' },
    },
    databaseUrl: '', // NUXT_DATABASE_URL — vazio = PGlite local em .data/
    adminEmail: '', // NUXT_ADMIN_EMAIL — cria o primeiro admin se o banco estiver vazio
    adminPassword: '', // NUXT_ADMIN_PASSWORD
    payment: {
      provider: 'manual', // NUXT_PAYMENT_PROVIDER: 'manual' | 'asaas'
      asaasApiKey: '', // NUXT_PAYMENT_ASAAS_API_KEY — chave de produção ($aact_prod_…)
      asaasSandboxApiKey: '', // NUXT_PAYMENT_ASAAS_SANDBOX_API_KEY — chave de teste ($aact_hmlg_…)
      asaasSandbox: true, // NUXT_PAYMENT_ASAAS_SANDBOX — true usa o sandbox e a chave de teste
      asaasWebhookToken: '', // NUXT_PAYMENT_ASAAS_WEBHOOK_TOKEN
    },
    email: {
      resendApiKey: '', // NUXT_EMAIL_RESEND_API_KEY — vazio = e-mails só aparecem no terminal
      from: 'CL Academy <nao-responda@clacademy.com.br>', // NUXT_EMAIL_FROM (domínio verificado no Resend)
      replyTo: '', // NUXT_EMAIL_REPLY_TO — para onde vão as respostas dos alunos
    },
    supabase: {
      serviceKey: '', // NUXT_SUPABASE_SERVICE_KEY — chave secreta (sb_secret_…): gera links de envio de vídeo
    },
    musclewiki: {
      apiKey: '', // NUXT_MUSCLEWIKI_API_KEY — vídeos licenciados de execução (api.musclewiki.com)
    },
    vapidPrivateKey: '', // NUXT_VAPID_PRIVATE_KEY
    vapidSubject: 'mailto:contato@clacademy.com.br', // NUXT_VAPID_SUBJECT
    strava: {
      clientId: '', // NUXT_STRAVA_CLIENT_ID
      clientSecret: '', // NUXT_STRAVA_CLIENT_SECRET
    },
    public: {
      siteUrl: 'https://clacademy.com.br', // NUXT_PUBLIC_SITE_URL
      vapidPublicKey: '', // NUXT_PUBLIC_VAPID_PUBLIC_KEY
      whatsapp: '', // NUXT_PUBLIC_WHATSAPP (ex: 5511999999999)
      supabaseUrl: '', // NUXT_PUBLIC_SUPABASE_URL — ex.: https://xxxx.supabase.co (Storage dos vídeos)
      supabaseKey: '', // NUXT_PUBLIC_SUPABASE_KEY — chave publicável (sb_publishable_…)
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      title,
      meta: [
        { name: 'description', content: description },
        {
          name: 'keywords',
          content:
            'personal trainer, assessoria de corrida, CL Run, planilha de corrida, treino de força, app de treino, CL Academy, eventos fitness',
        },
        { name: 'author', content: 'CL Academy' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#f0f0f0' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'CL Academy' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'CL Academy' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: 'https://clacademy.com.br/' },
        { property: 'og:image', content: 'https://clacademy.com.br/og-image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'pt_BR' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: 'https://clacademy.com.br/og-image.jpg' },
      ],
      link: [
        { rel: 'canonical', href: 'https://clacademy.com.br/' },
        { rel: 'icon', type: 'image/svg+xml', href: '/brand/cl-monogram.svg' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/pwa-192.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,700;1,800&family=Manrope:wght@400..800&display=swap',
        },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SportsActivityLocation',
            name: 'CL Academy',
            description,
            url: 'https://clacademy.com.br',
            logo: 'https://clacademy.com.br/cl_academy_logo.png',
            image: 'https://clacademy.com.br/og-image.jpg',
            priceRange: '$$',
            currenciesAccepted: 'BRL',
            paymentAccepted: 'Cash, Credit Card, Pix',
            sameAs: ['https://www.instagram.com/clacademyy'],
          }),
        },
      ],
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      id: '/app',
      name: 'CL Academy',
      short_name: 'CL Academy',
      description: 'Treinos, planilhas de corrida, evolução e plano da CL Academy no seu celular.',
      lang: 'pt-BR',
      dir: 'ltr',
      start_url: '/app?source=pwa',
      scope: '/',
      display: 'standalone',
      display_override: ['standalone', 'minimal-ui'],
      orientation: 'portrait',
      background_color: '#f0f0f0',
      theme_color: '#f0f0f0',
      categories: ['health', 'fitness', 'sports', 'lifestyle'],
      shortcuts: [
        { name: 'Treino de hoje', short_name: 'Hoje', url: '/app/aluno', icons: [{ src: '/pwa-192.png', sizes: '192x192' }] },
        { name: 'Meus treinos', short_name: 'Treinos', url: '/app/aluno/treinos', icons: [{ src: '/pwa-192.png', sizes: '192x192' }] },
        { name: 'Histórico', short_name: 'Histórico', url: '/app/aluno/historico', icons: [{ src: '/pwa-192.png', sizes: '192x192' }] },
      ],
      icons: [
        { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/pwa-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      navigateFallback: null,
      globPatterns: ['**/*.{js,css,woff,woff2,ttf,otf,svg,png,ico}'],
      // vídeos e fotos grandes da landing ficam fora do precache
      maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      importScripts: ['/push-sw.js'],
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          // páginas já visitadas abrem offline (landing SSR e shell do app)
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: { cacheName: 'pages', networkTimeoutSeconds: 3, expiration: { maxEntries: 30 } },
        },
        {
          urlPattern: ({ url }) => url.pathname.startsWith('/_nuxt/') || /\.(?:png|jpe?g|webp|svg|woff2?)$/.test(url.pathname),
          handler: 'StaleWhileRevalidate',
          options: { cacheName: 'assets', expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 } },
        },
        {
          // treino do dia / dados do aluno disponíveis offline
          urlPattern: ({ url }) => url.pathname.startsWith('/api/me'),
          handler: 'NetworkFirst',
          options: { cacheName: 'api-me', networkTimeoutSeconds: 4, expiration: { maxEntries: 50 } },
        },
      ],
    },
    client: { installPrompt: true },
    devOptions: { enabled: false },
  },

  nitro: {
    // PGlite (WASM) só é usado em desenvolvimento; não deve ser empacotado
    externals: { external: ['@electric-sql/pglite'] },
  },

  typescript: { strict: true },
})
