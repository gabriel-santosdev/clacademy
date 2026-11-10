type ExercisePayload = ReturnType<typeof exerciseFormToPayload>

export const exercisesApi = {
  create: (body: ExercisePayload) => $fetch('/api/coach/exercises', { method: 'POST', body }),
  update: (id: number, body: ExercisePayload) => $fetch(`/api/coach/exercises/${id}`, { method: 'PUT', body }),
  archive: (id: number) => $fetch(`/api/coach/exercises/${id}`, { method: 'DELETE' }),

  // vídeo próprio (Storage)
  mediaUploadLinks: (id: number, videoExt: 'mp4' | 'webm') =>
    $fetch(`/api/coach/exercises/${id}/media/upload`, { method: 'POST', body: { videoExt } }),
  saveMedia: (id: number, body: { videoUrl: string | null; posterUrl: string | null }) =>
    $fetch(`/api/coach/exercises/${id}/media`, { method: 'PUT', body }),

  // vídeos licenciados (MuscleWiki)
  videos: (id: number) => $fetch(`/api/exercises/${id}/videos`),
  licensedStatus: () => $fetch('/api/coach/musclewiki/status'),
  searchLicensed: (q: string) => $fetch('/api/coach/musclewiki/search', { query: { q } }),
  linkLicensed: (id: number, externalId: number | null) => $fetch(`/api/coach/exercises/${id}/musclewiki`, { method: 'PUT', body: { externalId } }),
  autoLinkLicensed: () => $fetch('/api/coach/musclewiki/sync', { method: 'POST' }),
}
