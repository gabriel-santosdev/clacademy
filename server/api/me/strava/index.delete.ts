export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'aluno')
  await disconnectStrava(user.id)
  return { ok: true }
})
