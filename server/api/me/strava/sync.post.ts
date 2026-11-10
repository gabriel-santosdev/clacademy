export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'aluno')
  const imported = await syncStravaActivities(user.id)
  return { imported }
})
