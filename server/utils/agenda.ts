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

/** Atribuições ativas do aluno com treinos/planilhas completos e a semana corrente de cada planilha (em `at`, padrão: agora). */
export async function getAlunoAssignments(alunoId: number, at = new Date()) {
  const db = await useDb()
  const { iso } = todaySP(at)
  const list = await db.query.assignments.findMany({
    where: (a) => and(eq(a.alunoId, alunoId), eq(a.active, true)),
    orderBy: (a) => [asc(a.id)],
    with: {
      professor: { columns: { id: true, name: true } },
      workout: { with: { items: { orderBy: (i) => [asc(i.position)], with: { exercise: true } } } },
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

/** O que o aluno tem para hoje (ou para o dia de `at`, usado no check-out automático do relógio). */
export async function getTodayAgenda(alunoId: number, at = new Date()) {
  const { weekday } = todaySP(at)
  const assignments = await getAlunoAssignments(alunoId, at)
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
