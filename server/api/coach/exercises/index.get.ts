import { asc, eq } from 'drizzle-orm'

/** Banco de exercícios ativos (o filtro por grupo/busca é feito na tela, a lista é pequena). */
export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const db = await useDb()
  return db.query.exercises.findMany({
    where: (e) => eq(e.active, true),
    orderBy: (e) => [asc(e.muscleGroup), asc(e.name)],
  })
})
