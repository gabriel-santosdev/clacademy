/** Vincula automaticamente os vídeos do MuscleWiki aos exercícios ainda sem vídeo. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return autoLinkCatalog()
})
