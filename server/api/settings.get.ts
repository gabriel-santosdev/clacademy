/** Configurações públicas (tema da landing, contatos). */
export default defineEventHandler(async () => {
  const s = await getSettings()
  return {
    theme: s.theme,
    showComingSoon: s.showComingSoon,
    gymName: s.gymName,
    whatsapp: s.whatsapp,
    instagram: s.instagram,
  }
})
