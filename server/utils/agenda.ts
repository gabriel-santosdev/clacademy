import { and, asc, eq } from 'drizzle-orm'

const TZ = 'America/Sao_Paulo'

/** Data de hoje (YYYY-MM-DD) e dia da semana no fuso de São Paulo. */
export function todaySP(now = new Date()) {
  const iso = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
  const weekday = new Date(`${iso}T12:00:00Z`).getUTCDay()
  return { iso, weekday }
}

function daysBetween(fromIso: string, toIso: string) {
  return Math.floor((Date.parse(`${toIso}T12:00:00Z`) - Date.parse(`${fromIso}T12:00:00Z`)) / 864e5)
}

/** Atribuições ativas do aluno com treinos/planilhas completos e a semana corrente de cada planilha. */
export async function getAlunoAssignments(alunoId: number) {
  const db = await useDb()
  const { iso } = todaySP()
  const list = await db.query.assignments.findMany({
    where: (a) => and(eq(a.alunoId, alunoId), eq(a.active, true)),
    orderBy: (a) => [asc(a.id)],
    with: {
      professor: { columns: { id: true, name: true } },
      workout: { with: { items: { orderBy: (i) => [asc(i.position)] } } },
      runPlan: { with: { sessions: { orderBy: (s) => [asc(s.week), asc(s.weekday)] } } },
    },
  })
  return list
    .filter((a) => !a.endDate || a.endDate >= iso)
    .map((a) => {
      const elapsed = daysBetween(a.startDate, iso)
      const currentWeek = a.runPlan ? Math.min(a.runPlan.weeks, Math.max(1, Math.floor(elapsed / 7) + 1)) : null
      return { ...a, currentWeek, started: elapsed >= 0 }
    })
}

/** O que o aluno tem para hoje. */
export async function getTodayAgenda(alunoId: number) {
  const { weekday } = todaySP()
  const assignments = await getAlunoAssignments(alunoId)
  const workouts = assignments
    .filter((a) => a.started && a.workout && (!a.weekdays.length || a.weekdays.includes(weekday)))
    .map((a) => ({ assignmentId: a.id, workout: a.workout! }))
  const runs = assignments
    .filter((a) => a.started && a.runPlan)
    .flatMap((a) =>
      a.runPlan!.sessions
        .filter((s) => s.week === a.currentWeek && s.weekday === weekday)
        .map((s) => ({ assignmentId: a.id, planTitle: a.runPlan!.title, session: s })),
    )
  return { workouts, runs }
}
