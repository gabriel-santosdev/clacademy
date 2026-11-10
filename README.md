# CL Academy

Plataforma da CL Academy: site institucional, app (PWA) de treinos e assessoria de corrida, e gestão de planos/pagamentos.

**Stack:** Nuxt 4 (Vue 3 + Nitro) · PrimeVue 4 (tema Aura customizado + PrimeIcons) · PostgreSQL + Drizzle ORM · nuxt-auth-utils · @vite-pwa/nuxt · Asaas (opcional) · Vercel

## Áreas

| Rota | Quem | O que faz |
|---|---|---|
| `/` | público | Landing (SSR) + vitrine de planos publicados |
| `/login`, `/cadastro` | público | Acesso e cadastro de alunos |
| `/app/aluno` | aluno | Treino do dia, treinos/planilhas, histórico, plano e pagamentos, perfil (push, Strava) |
| `/app/professor` | professor, admin | Feed de atividades + feedback, alunos, fichas de treino, planilhas de corrida, avisos |
| `/app/admin` | admin | Dashboard (MRR, receita), planos e preços, financeiro, usuários, configurações |

A área `/app/**` roda como SPA instalável (PWA); a landing é renderizada no servidor.

## Rodando localmente

Requer **Node 22.22+** (o projeto tem `.node-version` = 24; com fnm/nvm basta `fnm use`).

```bash
npm install
npm run dev
```

Sem `NUXT_DATABASE_URL`, o app usa um Postgres embutido (PGlite) em `.data/pglite`, aplica as migrations e cria dados de demonstração:

| Login | Senha |
|---|---|
| admin@clacademy.local | clacademy123 |
| professor@clacademy.local | clacademy123 |
| aluno@clacademy.local | clacademy123 |

Para recomeçar do zero, apague a pasta `.data/`.

## Banco de dados

- Schema: `server/db/schema.ts`
- Após alterar o schema: `npm run db:generate` (gera SQL em `server/db/migrations`)
- Produção: `npm run db:migrate` com `NUXT_DATABASE_URL` definido (a Vercel roda isso automaticamente no `vercel-build`)

## Planos, preços e pagamentos

- Planos nascem como **rascunho**; só os **publicados** (com ao menos um preço) aparecem no site e no app.
- Preços são **versionados**: alterar um valor cria nova versão; assinantes antigos continuam no valor contratado.
- `NUXT_PAYMENT_PROVIDER=manual` (padrão): aluno vê chave Pix/instruções; admin dá baixa em **Financeiro**, gera a próxima mensalidade e faz matrículas presenciais.
- `NUXT_PAYMENT_PROVIDER=asaas` (chaves em `NUXT_PAYMENT_ASAAS_API_KEY` = produção e `NUXT_PAYMENT_ASAAS_SANDBOX_API_KEY` = teste; `NUXT_PAYMENT_ASAAS_SANDBOX` escolhe qual usar; webhook na versão **v3**): assinatura recorrente (Pix, boleto, cartão) criada no Asaas; status atualizados pelo webhook `POST /api/webhooks/asaas` (configure o mesmo token de `NUXT_PAYMENT_ASAAS_WEBHOOK_TOKEN` no painel do Asaas, eventos de cobrança).
- Para outro gateway, implemente a interface `PaymentProvider` em `server/utils/payments.ts`.

## Deploy (Vercel + Supabase)

1. No Supabase, botão **Connect**: use o **Transaction pooler** (porta 6543) em `NUXT_DATABASE_URL` e o **Session pooler** (porta 5432) em `NUXT_DATABASE_MIGRATION_URL`.
2. Configure as variáveis do `.env.example` no projeto da Vercel (ambiente Production). No mínimo: as duas URLs do banco, `NUXT_APP_SECRET`, `NUXT_ADMIN_EMAIL`, `NUXT_ADMIN_PASSWORD`, `NUXT_PUBLIC_SITE_URL`.
3. O build (`vercel-build`) aplica as migrations e o primeiro acesso cria o admin.
4. Todas as tabelas têm RLS ligado (migration `0002`): a Data API do Supabase não enxerga nada; o app acessa como dono das tabelas. Em tabelas novas, inclua `ENABLE ROW LEVEL SECURITY` na migration.

## E-mails (Resend)

- `NUXT_EMAIL_RESEND_API_KEY` + `NUXT_EMAIL_FROM` com domínio verificado no Resend. Sem a chave, os e-mails só aparecem no terminal (útil em dev).
- Enviados: confirmação de cadastro (o aluno só entra após clicar no link), redefinição de senha, nova mensalidade (modo manual), pagamento confirmado e mensalidade em atraso.
- Contas criadas pelo admin já nascem confirmadas.

## Integrações opcionais

- **Push:** `npx web-push generate-vapid-keys` → `NUXT_PUBLIC_VAPID_PUBLIC_KEY` / `NUXT_VAPID_PRIVATE_KEY`. No iPhone, push só funciona com o app instalado na tela inicial.
- **Strava:** crie um app em strava.com/settings/api (callback domain = seu domínio) → `NUXT_STRAVA_CLIENT_ID` / `NUXT_STRAVA_CLIENT_SECRET`.

## Estrutura

O front é organizado **por feature/domínio**, com a UI separada das regras de negócio:

```
app/
  features/<domínio>/
    domain/        regras puras (cálculos, validações, conversão form ⇄ API) — sem Vue, sem HTTP
    api/           comandos HTTP ($fetch) do domínio
    composables/   casos de uso: queries (useFetch), estado e orquestração
    components/    UI apresentacional com PrimeVue (prefixo = feature, ex.: TrainingLogDialog)
  components/      composição transversal (AppPageHeader, AppEmptyState, AppStatCard, AppBarChart)
  composables/     transversais (useAction, useNotify, useAppColorMode, useDebouncedRef)
  utils/           formatação, tipos de API (ApiResponse) e withAsync
  theme/           preset PrimeVue (clacademy.ts)
  assets/css/      base.css (reset/fontes), tokens.css (marca + tema Copa), app.css (layout)
  layouts/         auth, app (shell com sidebar/drawer/bottom bar)
  pages/           finas: só compõem composables + componentes
server/
  api/           auth, me (aluno), coach (professor), admin, webhooks
  db/            schema, migrations, seed
  utils/         db, auth, billing, payments, notify, strava, agenda…
shared/utils/    constantes e formatadores usados no app e no server
```

Features: `auth`, `billing` (planos, assinatura, financeiro), `training` (treinos, planilhas, registros, atribuições),
`coaching` (painel do professor, feedback, avisos), `account` (perfil, senha, notificações, Strava), `admin`
(usuários, configurações), `pwa` (instalação e push), `shell` (navegação por papel), `landing` (site).

Tudo em `domain/`, `api/` e `composables/` é auto-importado (ver `nuxt.config.ts`). Composables que fazem query
seguem o padrão do Nuxt e podem ser usados com `await`.

## PWA

- Manifest com atalhos (Hoje, Treinos, Histórico) e ícones maskable; service worker com precache do app,
  cache de páginas visitadas (offline) e de `/api/me` (treino do dia offline).
- Botão "Instalar o app" (`PwaInstallButton`) usa o prompt nativo no Android/Chrome/Edge e mostra o passo a passo
  no iPhone (Safari não tem prompt).
