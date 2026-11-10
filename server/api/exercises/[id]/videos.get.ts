import { eq } from 'drizzle-orm'

/**
 * Vídeos de execução de um exercício, com URLs tocáveis (token de curta duração).
 * Qualquer usuário logado (o aluno vê na ficha). Sem vínculo/sem chave: lista vazia.
 */
export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = getIdParam(event)
  const db = await useDb()
  const ex = await db.query.exercises.findFirst({ where: (e) => eq(e.id, id) })
  if (!ex) notFound('Exercício')
  if (!ex.externalId || !musclewikiEnabled()) return { provider: null, videos: [] }

  const videos = await freshVideos(ex)
  if (!videos.length) return { provider: null, videos: [] }
  const token = await mediaToken()
  // URLs com token não podem ficar em cache compartilhado
  setHeader(event, 'Cache-Control', 'private, max-age=600')
  return {
    provider: 'musclewiki' as const,
    videos: videos.map((v) => ({ angle: v.angle, gender: v.gender, src: streamUrl(v.url, token) })),
  }
})
