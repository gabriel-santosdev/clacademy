export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'aluno')
  return syncStravaActivities(user.id)
})
