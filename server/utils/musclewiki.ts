import { eq } from 'drizzle-orm'
import { EXERCISE_SEARCH_EN } from '../db/exercise-catalog'

/*
 * Vídeos licenciados do MuscleWiki (https://api.musclewiki.com).
 * Regras dos termos de uso que este módulo respeita:
 * - a chave nunca vai para o navegador: o servidor troca por um token de 15 min;
 * - vídeos não são baixados nem guardados; só os metadados (≤ 30 dias, renovamos a cada 25);
 * - o vídeo é exibido como entregue (com a marca deles).
 * Cada reprodução de vídeo conta 1 chamada na cota do plano.
 */

const BASE = 'https://api.musclewiki.com'
const STALE_MS = 25 * 864e5

export interface MwVideo {
  url: string
  angle: string
  gender: string
}

interface MwExercise {
  id: number
  name: string
  category?: string
  videos?: { url: string | null; angle: string; gender: string }[]
}

export function musclewikiEnabled() {
  return !!useRuntimeConfig().musclewiki.apiKey
}

// fetch nativo (o $fetch do Nitro confundiria "/search" com as rotas internas do app)
async function mw<T>(path: string, init: { method?: 'GET' | 'POST'; query?: Record<string, string | number> } = {}): Promise<T> {
  const { apiKey } = useRuntimeConfig().musclewiki
  if (!apiKey) throw createError({ statusCode: 503, message: 'MuscleWiki não configurado (NUXT_MUSCLEWIKI_API_KEY).' })
  const url = new URL(path, BASE)
  for (const [k, v] of Object.entries(init.query ?? {})) url.searchParams.set(k, String(v))
  let res: Response
  try {
    res = await fetch(url, { method: init.method ?? 'GET', headers: { 'X-API-Key': apiKey, Accept: 'application/json' } })
  } catch {
    throw createError({ statusCode: 502, message: 'Não foi possível falar com o MuscleWiki.' })
  }
  if (!res.ok) {
    const msg =
      res.status === 401 || res.status === 403
        ? 'Chave do MuscleWiki inválida ou sem acesso a este recurso.'
        : res.status === 429
          ? 'Cota do MuscleWiki esgotada no momento.'
          : `MuscleWiki respondeu ${res.status}.`
    throw createError({ statusCode: 502, message: msg })
  }
  return (await res.json()) as T
}

const toVideos = (ex: MwExercise): MwVideo[] =>
  (ex.videos ?? []).filter((v): v is MwVideo => !!v.url).map((v) => ({ url: v.url, angle: v.angle, gender: v.gender }))

/** Busca por nome (inglês). */
export interface MwSearchResult {
  id: number
  name: string
  category: string | null
  videos: number
}

export async function searchMuscleWiki(q: string, limit = 8): Promise<MwSearchResult[]> {
  const res = await mw<MwExercise[] | { results: MwExercise[] }>('/search', { query: { q, limit } })
  const list = Array.isArray(res) ? res : res.results
  return list.map((e) => ({ id: e.id, name: e.name, category: e.category ?? null, videos: toVideos(e).length }))
}

export async function getMuscleWikiExercise(id: number): Promise<{ id: number; name: string; videos: MwVideo[] }> {
  const ex = await mw<MwExercise>(`/exercises/${id}`)
  return { id: ex.id, name: ex.name, videos: toVideos(ex) }
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

/** Melhor resultado para o termo: nome idêntico > contém todas as palavras > primeiro com vídeo. */
function bestMatch(term: string, results: { id: number; name: string; videos: number }[]) {
  const t = norm(term)
  const words = t.split(' ')
  const withVideo = results.filter((r) => r.videos > 0)
  return (
    withVideo.find((r) => norm(r.name) === t) ??
    withVideo.find((r) => words.every((w) => norm(r.name).includes(w))) ??
    withVideo[0] ??
    null
  )
}

/** Grava o vínculo e os metadados dos vídeos de um exercício. */
export async function linkExercise(exerciseId: number, mwId: number | null): Promise<{ id: number; name: string; videos: MwVideo[] } | null> {
  const db = await useDb()
  if (!mwId) {
    await db
      .update(tables.exercises)
      .set({ externalSource: null, externalId: null, externalMedia: null, externalSyncedAt: null })
      .where(eq(tables.exercises.id, exerciseId))
    return null
  }
  const ex = await getMuscleWikiExercise(mwId)
  await db
    .update(tables.exercises)
    .set({ externalSource: 'musclewiki', externalId: ex.id, externalMedia: ex.videos, externalSyncedAt: new Date() })
    .where(eq(tables.exercises.id, exerciseId))
  return ex
}

/**
 * Vincula automaticamente os exercícios do catálogo ainda sem vídeo.
 * ~2 chamadas por exercício (busca + detalhes); roda só quando o admin pede.
 */
export async function autoLinkCatalog(): Promise<{ linked: number; notFound: string[] }> {
  const db = await useDb()
  const pending = await db.query.exercises.findMany({ where: (e, { and, isNull }) => and(eq(e.active, true), isNull(e.externalId)) })
  const linked: string[] = []
  const notFound: string[] = []
  for (const e of pending) {
    const term = EXERCISE_SEARCH_EN[e.slug]
    if (!term) continue
    const match = bestMatch(term, await searchMuscleWiki(term, 10))
    if (!match) {
      notFound.push(e.name)
      continue
    }
    await linkExercise(e.id, match.id)
    linked.push(e.name)
  }
  return { linked: linked.length, notFound }
}

/** Metadados atualizados (renova se tiverem mais de 25 dias, como pedem os termos). */
export async function freshVideos(e: {
  id: number
  externalId: number | null
  externalMedia: MwVideo[] | null
  externalSyncedAt: Date | null
}): Promise<MwVideo[]> {
  if (!e.externalId) return []
  const stale = !e.externalSyncedAt || Date.now() - new Date(e.externalSyncedAt).getTime() > STALE_MS
  if (!stale && e.externalMedia?.length) return e.externalMedia
  return (await linkExercise(e.id, e.externalId))?.videos ?? []
}

/* token de mídia: um por instância do servidor, reaproveitado até perto de expirar */
let cached: { token: string; until: number } | null = null
export async function mediaToken(): Promise<string> {
  if (cached && cached.until > Date.now() + 60_000) return cached.token
  const r = await mw<{ token: string; expires_in: number }>('/media/token', { method: 'POST' })
  cached = { token: r.token, until: Date.now() + r.expires_in * 1000 }
  return r.token
}

/** URL tocável no navegador (com token de curta duração). */
export function streamUrl(url: string, token: string) {
  const u = new URL(url, BASE)
  u.searchParams.set('token', token)
  return u.toString()
}
