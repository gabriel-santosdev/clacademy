/** Todos os treinos e planilhas atribuídos ao aluno. */
export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'aluno')
  if (!(await userHasAccess(user.id))) return { locked: true, assignments: [] }
  return { locked: false, assignments: await getAlunoAssignments(user.id) }
})
