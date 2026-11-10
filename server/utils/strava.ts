import { and, eq } from 'drizzle-orm'
import type { PlannedMatch } from './checkout'

/**
 * Integração Strava.
 * O Strava é o "hub" dos relógios: Apple Watch, Garmin, Coros, Polar, Suunto, Samsung, Amazfit e Wahoo
 * sincronizam com ele nativamente. Recebemos cada corrida por webhook (automático) ou por sincronização manual.
 */

const STRAVA = 'https://www.strava.com'
const WEBHOOK_SETTING = 'strava_webhook'

interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_at: number
  athlete?: { id: number; firstname?: string; lastname?: string }
}

/** Atividade do Strava (resumo da lista ou detalhe; `device_name` só vem no detalhe). */
export interface StravaActivity {
  id: number
  name: string
  type: string
  sport_type?: string
  distance: number // metros
  moving_time: number // segundos
  start_date: string
  total_elevation_gain?: number
  average_heartrate?: number
  device_name?: string
  manual?: boolean
}

const RUN_TYPES = new Set(['run', 'trailrun', 'virtualrun'])
export const isRun = (a: Pick<StravaActivity, 'type' | 'sport_type'>) => RUN_TYPES.has((a.sport_type ?? a.type).toLowerCase())

export function stravaConfigured() {
  const { strava } = useRuntimeConfig()
  return !!(strava.clientId && strava.clientSecret)
}

export function stravaAuthorizeUrl(redirectUri: string, state: string) {
  const { strava } = useRuntimeConfig()
  const q = new URLSearchParams({
    client_id: strava.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'read,activity:read_all',
    state,
  })
  return `${STRAVA}/oauth/authorize?${q}`
}

export async function stravaExchangeCode(code: string) {
  const { strava } = useRuntimeConfig()
  return $fetch<TokenResponse>(`${STRAVA}/oauth/token`, {
    method: 'POST',
    body: { client_id: strava.clientId, client_secret: strava.clientSecret, code, grant_type: 'authorization_code' },
  })
}

/** Salva (ou renova) a conexão do aluno depois do OAuth. */
export async function saveStravaConnection(userId: number, token: TokenResponse) {
  const db = await useDb()
  const name = [token.athlete?.firstname, token.athlete?.lastname].filter(Boolean).join(' ') || null
  const values = {
    userId,
    athleteId: String(token.athlete?.id ?? ''),
    athleteName: name,
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    expiresAt: token.expires_at,
    connectedAt: new Date(),
  }
  await db.insert(tables.stravaConnections).values(values).onConflictDoUpdate({ target: tables.stravaConnections.userId, set: values })
}

type Connection = typeof tables.stravaConnections.$inferSelect

async function freshToken(conn: Connection) {
  if (conn.expiresAt - 60 > Date.now() / 1000) return conn.accessToken
  const { strava } = useRuntimeConfig()
  const r = await $fetch<TokenResponse>(`${STRAVA}/oauth/token`, {
    method: 'POST',
    body: { client_id: strava.clientId, client_secret: strava.clientSecret, grant_type: 'refresh_token', refresh_token: conn.refreshToken },
  })
  const db = await useDb()
  await db
    .update(tables.stravaConnections)
    .set({ accessToken: r.access_token, refreshToken: r.refresh_token, expiresAt: r.expires_at })
    .where(eq(tables.stravaConnections.userId, conn.userId))
  return r.access_token
}

async function connectionOf(userId: number) {
  const db = await useDb()
  return db.query.stravaConnections.findFirst({ where: (c) => eq(c.userId, userId) })
}

async function connectionByAthlete(athleteId: string) {
  const db = await useDb()
  return db.query.stravaConnections.findFirst({ where: (c) => eq(c.athleteId, athleteId) })
}

/** Detalhe de uma atividade. `null` se não existe mais (apagada ou privada sem permissão). */
async function fetchActivity(token: string, id: string | number) {
  try {
    return await $fetch<StravaActivity>(`${STRAVA}/api/v3/activities/${id}`, { headers: { Authorization: `Bearer ${token}` } })
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode
    if (status === 404 || status === 403) return null
    throw err
  }
}

type ImportedKind = 'corrida' | 'treino'

/** Tipo do Strava que vira registro no app: corrida sempre; musculação/funcional só se houver treino planejado. */
const STRENGTH_TYPES = new Set(['weighttraining', 'workout', 'crossfit', 'highintensityintervaltraining'])
function kindOf(a: Pick<StravaActivity, 'type' | 'sport_type'>): ImportedKind | null {
  if (isRun(a)) return 'corrida'
  return STRENGTH_TYPES.has((a.sport_type ?? a.type).toLowerCase()) ? 'treino' : null
}

function metricsOf(a: StravaActivity) {
  const km = a.distance / 1000
  return {
    performedAt: new Date(a.start_date),
    distanceKm: km > 0 ? Math.round(km * 100) / 100 : null,
    durationMin: Math.round(a.moving_time / 60),
    avgPaceSec: km > 0 && isRun(a) ? Math.round(a.moving_time / km) : null,
    elevationM: a.total_elevation_gain ? Math.round(a.total_elevation_gain) : null,
    avgHr: a.average_heartrate != null ? Math.round(a.average_heartrate) : null,
    ...(a.device_name ? { device: a.device_name } : {}),
  }
}

const byExternal = (userId: number, activityId: string) =>
  and(eq(tables.activityLogs.source, 'strava'), eq(tables.activityLogs.externalId, activityId), eq(tables.activityLogs.alunoId, userId))

export interface ImportResult {
  isNew: boolean
  kind: ImportedKind
  /** sessão planejada que a atividade cumpriu (check-out automático) */
  match: PlannedMatch | null
}

/**
 * Importa uma atividade do Strava e faz o check-out do treino planejado do dia, se houver.
 * Já importada: atualiza só as métricas (vínculo, esforço, notas e retorno do professor ficam).
 */
async function importActivity(userId: number, a: StravaActivity): Promise<ImportResult | null> {
  const kind = kindOf(a)
  if (!kind) return null
  const db = await useDb()
  const externalId = String(a.id)
  const metrics = metricsOf(a)

  const existing = await db.query.activityLogs.findFirst({ where: () => byExternal(userId, externalId), columns: { id: true, kind: true } })
  if (existing) {
    await db
      .update(tables.activityLogs)
      .set({ ...metrics, ...(existing.kind === 'corrida' ? { title: a.name } : {}) })
      .where(byExternal(userId, externalId))
    return { isNew: false, kind, match: null }
  }

  const match = await matchPlannedSession(userId, kind, metrics.performedAt, metrics.distanceKm)
  // musculação solta (sem treino passado pelo professor) não entra no app
  if (kind === 'treino' && !match) return null

  const inserted = await db
    .insert(tables.activityLogs)
    .values({
      alunoId: userId,
      kind,
      source: 'strava',
      externalId,
      title: kind === 'treino' && match ? match.label : a.name,
      assignmentId: match?.assignmentId,
      runSessionId: match?.kind === 'corrida' ? match.runSessionId : undefined,
      workoutId: match?.kind === 'treino' ? match.workoutId : undefined,
      ...metrics,
    })
    .onConflictDoNothing()
    .returning({ id: tables.activityLogs.id })
  return { isNew: inserted.length > 0, kind, match: inserted.length ? match : null }
}

async function removeImported(userId: number, activityId: string) {
  const db = await useDb()
  await db.delete(tables.activityLogs).where(byExternal(userId, activityId))
}

async function touchSync(userId: number) {
  const db = await useDb()
  await db.update(tables.stravaConnections).set({ lastSyncAt: new Date() }).where(eq(tables.stravaConnections.userId, userId))
}

function formatKm(km: number) {
  return km.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
}

/** Avisa aluno e professor (notificação no app + push na barra do celular). */
async function announceImport(userId: number, a: StravaActivity, r: ImportResult) {
  const db = await useDb()
  const me = await db.query.users.findFirst({ where: (u) => eq(u.id, userId), columns: { name: true, coachId: true } })
  const amount = a.distance > 0 ? `${formatKm(a.distance / 1000)} km` : `${Math.round(a.moving_time / 60)} min`
  const from = a.device_name ? ` pelo ${a.device_name}` : ''
  const tag = `strava-${a.id}`

  await notifyUsers([userId], {
    title: r.match ? `✓ ${r.match.label} concluído` : `Corrida de ${amount} recebida`,
    body: r.match
      ? `${amount}${from}. Check-out feito. Toque para dizer quanto pesou.`
      : `${a.device_name ? `Gravada${from}. ` : ''}Toque para dizer quanto pesou.`,
    url: '/app/aluno/perfil/integracoes',
    tag,
  })

  if (me?.coachId) {
    await notifyUsers([me.coachId], {
      title: r.match ? `${me.name} concluiu: ${r.match.label}` : `${me.name} correu ${amount}`,
      body: `Sincronizado do Strava${from}.`,
      url: `/app/professor/alunos/${userId}`,
      tag: `${tag}-coach`,
    })
  }
}

/** Máximo de detalhes buscados por sincronização manual (limite de requisições do Strava). */
const DETAIL_BUDGET = 15

/** Sincronização manual: importa atividades recentes (com check-out). Retorna quantas são novas e quantos check-outs. */
export async function syncStravaActivities(userId: number) {
  const conn = await connectionOf(userId)
  if (!conn) throw createError({ statusCode: 400, message: 'Strava não conectado' })
  const token = await freshToken(conn)

  const after = conn.lastSyncAt
    ? Math.floor(new Date(conn.lastSyncAt).getTime() / 1000) - 3 * 86400
    : Math.floor(Date.now() / 1000) - 30 * 86400

  const list = await $fetch<StravaActivity[]>(`${STRAVA}/api/v3/athlete/activities`, {
    headers: { Authorization: `Bearer ${token}` },
    query: { after, per_page: 100 },
  })

  const db = await useDb()
  const known = new Set(
    (
      await db
        .select({ externalId: tables.activityLogs.externalId })
        .from(tables.activityLogs)
        .where(and(eq(tables.activityLogs.alunoId, userId), eq(tables.activityLogs.source, 'strava')))
    ).map((r) => r.externalId),
  )

  let imported = 0
  let checkouts = 0
  let budget = DETAIL_BUDGET
  // do mais antigo para o mais novo: o check-out de cada dia pega a sessão certa
  const candidates = list.filter((a) => kindOf(a)).sort((a, b) => a.start_date.localeCompare(b.start_date))
  for (const summary of candidates) {
    // atividades novas ganham o detalhe (aparelho, FC); o resto usa o resumo da lista
    const isNew = !known.has(String(summary.id))
    const detail = isNew && budget-- > 0 ? await fetchActivity(token, summary.id).catch(() => null) : null
    const r = await importActivity(userId, detail ?? summary)
    if (r?.isNew) imported++
    if (r?.match) checkouts++
  }
  await touchSync(userId)
  return { imported, checkouts }
}

/** Desconecta: revoga o acesso no Strava (melhor esforço) e apaga os tokens. As atividades importadas ficam. */
export async function disconnectStrava(userId: number) {
  const conn = await connectionOf(userId)
  if (!conn) return
  try {
    const token = await freshToken(conn)
    await $fetch(`${STRAVA}/oauth/deauthorize`, { method: 'POST', body: { access_token: token } })
  } catch (e) {
    console.warn('[strava] não foi possível revogar no Strava', e)
  }
  const db = await useDb()
  await db.delete(tables.stravaConnections).where(eq(tables.stravaConnections.userId, userId))
}

/* ── webhook (sincronização automática) ─────────────────────────────── */

export interface StravaWebhookEvent {
  object_type: 'activity' | 'athlete'
  object_id: number
  aspect_type: 'create' | 'update' | 'delete'
  owner_id: number
  subscription_id: number
  event_time: number
  updates?: Record<string, string>
}

/**
 * Processa um evento do webhook. Nunca confia no payload: os dados vêm sempre da API do Strava
 * com o token do próprio atleta (um evento forjado não consegue inserir nem apagar nada falso).
 */
export async function handleStravaEvent(evt: StravaWebhookEvent) {
  const conn = await connectionByAthlete(String(evt.owner_id))
  if (!conn) return

  if (evt.object_type === 'athlete') {
    // o atleta revogou o acesso pelo site do Strava
    if (evt.updates?.authorized === 'false') {
      const db = await useDb()
      await db.delete(tables.stravaConnections).where(eq(tables.stravaConnections.userId, conn.userId))
    }
    return
  }

  const token = await freshToken(conn)
  const activity = await fetchActivity(token, evt.object_id)

  if (!activity || !kindOf(activity)) {
    // apagada, ficou privada sem permissão ou mudou para um tipo que não importamos
    await removeImported(conn.userId, String(evt.object_id))
    return
  }

  const r = await importActivity(conn.userId, activity)
  await touchSync(conn.userId)
  if (r?.isNew) await announceImport(conn.userId, activity, r)
}

/** Token que o Strava devolve na verificação do webhook. Derivado do segredo do app (não precisa de outra variável). */
export function stravaVerifyToken() {
  const { strava } = useRuntimeConfig()
  return `cl-${strava.clientId}-${strava.clientSecret.slice(-8)}`
}

export interface StravaWebhookState {
  subscriptionId: number | null
  callbackUrl: string | null
}

export async function getStravaWebhook(): Promise<StravaWebhookState> {
  const db = await useDb()
  const row = await db.query.settings.findFirst({ where: (s) => eq(s.key, WEBHOOK_SETTING) })
  return (row?.value as StravaWebhookState | undefined) ?? { subscriptionId: null, callbackUrl: null }
}

async function saveStravaWebhook(state: StravaWebhookState) {
  const db = await useDb()
  await db
    .insert(tables.settings)
    .values({ key: WEBHOOK_SETTING, value: state })
    .onConflictDoUpdate({ target: tables.settings.key, set: { value: state } })
}

/**
 * Cria a assinatura do webhook no Strava (uma por app). O Strava chama o GET de verificação
 * durante esta requisição, então o endereço precisa ser público (não funciona em localhost).
 */
export async function subscribeStravaWebhook(callbackUrl: string) {
  const { strava } = useRuntimeConfig()
  const auth = { client_id: strava.clientId, client_secret: strava.clientSecret }

  // já existe uma assinatura para este app? (ex.: criada em outro deploy) → reaproveita ou troca
  const existing = await $fetch<{ id: number; callback_url: string }[]>(`${STRAVA}/api/v3/push_subscriptions`, { query: auth })
  for (const sub of existing) {
    if (sub.callback_url === callbackUrl) {
      await saveStravaWebhook({ subscriptionId: sub.id, callbackUrl })
      return sub.id
    }
    await $fetch(`${STRAVA}/api/v3/push_subscriptions/${sub.id}`, { method: 'DELETE', query: auth })
  }

  const created = await $fetch<{ id: number }>(`${STRAVA}/api/v3/push_subscriptions`, {
    method: 'POST',
    body: { ...auth, callback_url: callbackUrl, verify_token: stravaVerifyToken() },
  })
  await saveStravaWebhook({ subscriptionId: created.id, callbackUrl })
  return created.id
}

export async function unsubscribeStravaWebhook() {
  const { strava } = useRuntimeConfig()
  const state = await getStravaWebhook()
  if (state.subscriptionId) {
    await $fetch(`${STRAVA}/api/v3/push_subscriptions/${state.subscriptionId}`, {
      method: 'DELETE',
      query: { client_id: strava.clientId, client_secret: strava.clientSecret },
    }).catch((e) => console.warn('[strava] falha ao remover assinatura', e))
  }
  await saveStravaWebhook({ subscriptionId: null, callbackUrl: null })
}
