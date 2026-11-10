import { count, eq } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as t from './schema'

interface SeedOptions {
  adminEmail?: string
  adminPassword?: string
  /** dados de demonstração (apenas banco local) */
  demo: boolean
}

/** Cria o primeiro admin (e dados demo em dev) quando o banco está vazio. */
export async function seedDatabase(db: PostgresJsDatabase<typeof t>, opts: SeedOptions) {
  const total = (await db.select({ value: count() }).from(t.users))[0]?.value ?? 0
  if (total > 0) return

  if (!opts.demo) {
    if (!opts.adminEmail || !opts.adminPassword) {
      console.warn('[seed] Banco vazio: defina NUXT_ADMIN_EMAIL e NUXT_ADMIN_PASSWORD para criar o admin.')
      return
    }
    await db.insert(t.users).values({
      name: 'Administrador',
      email: opts.adminEmail.toLowerCase(),
      passwordHash: await hashPassword(opts.adminPassword),
      role: 'admin',
    })
    console.info(`[seed] Admin criado: ${opts.adminEmail}`)
    return
  }

  // ── Demo local ──
  const pass = await hashPassword('clacademy123')
  const [, prof, aluno] = await db
    .insert(t.users)
    .values([
      { name: 'Carla (Admin)', email: 'admin@clacademy.local', passwordHash: pass, role: 'admin' },
      { name: 'Professor Demo', email: 'professor@clacademy.local', passwordHash: pass, role: 'professor' },
      { name: 'Aluno Demo', email: 'aluno@clacademy.local', passwordHash: pass, role: 'aluno' },
    ])
    .returning()
  await db.update(t.users).set({ coachId: prof!.id }).where(eq(t.users.id, aluno!.id))

  const plans = await db
    .insert(t.plans)
    .values([
      {
        name: 'Personal Trainer',
        slug: 'personal-trainer',
        description: 'Treino individual para o seu objetivo, com ajuste semanal pelo app.',
        modality: 'academia',
        features: ['Ficha individual', 'Retorno do professor em cada treino', 'Ajuste de carga semanal', 'Convite para os eventos CL'],
        status: 'published',
        sortOrder: 1,
        publishedAt: new Date(),
      },
      {
        name: 'Assessoria CL Run',
        slug: 'assessoria-cl-run',
        description: 'Planilha de corrida individual e acompanhamento do professor.',
        modality: 'assessoria',
        features: ['Planilha personalizada', 'Feedback semanal', 'Integração com Strava', 'Convite para os eventos CL'],
        status: 'published',
        highlight: true,
        trialDays: 7,
        sortOrder: 2,
        publishedAt: new Date(),
      },
    ])
    .returning()

  await db.insert(t.planPrices).values([
    { planId: plans[0]!.id, interval: 'monthly', amountCents: 14990 },
    { planId: plans[0]!.id, interval: 'quarterly', amountCents: 39990 },
    { planId: plans[1]!.id, interval: 'monthly', amountCents: 17990 },
    { planId: plans[1]!.id, interval: 'semiannual', amountCents: 95990 },
  ])

  const [workout] = await db
    .insert(t.workouts)
    .values({ title: 'Treino A — Inferiores', tag: 'A', description: 'Foco em força de pernas.', createdBy: prof!.id })
    .returning()
  await db.insert(t.workoutItems).values([
    { workoutId: workout!.id, position: 0, name: 'Agachamento livre', sets: 4, reps: '10', load: 'moderada', restSeconds: 90 },
    { workoutId: workout!.id, position: 1, name: 'Leg press 45°', sets: 3, reps: '12', restSeconds: 60 },
    { workoutId: workout!.id, position: 2, name: 'Cadeira extensora', sets: 3, reps: '15', restSeconds: 45 },
    { workoutId: workout!.id, position: 3, name: 'Panturrilha em pé', sets: 4, reps: '20', restSeconds: 30 },
  ])

  const [runPlan] = await db
    .insert(t.runPlans)
    .values({ title: 'Base 10K', goal: '10K confortável', weeks: 4, createdBy: prof!.id })
    .returning()
  const sessions: (typeof t.runSessions.$inferInsert)[] = []
  for (let w = 1; w <= 4; w++) {
    sessions.push(
      { runPlanId: runPlan!.id, week: w, weekday: 2, type: 'rodagem', distanceKm: 5 + w * 0.5, targetPaceSec: 390 },
      { runPlanId: runPlan!.id, week: w, weekday: 4, type: 'intervalado', durationMin: 40, description: '6x 400m forte / 200m trote', targetPaceSec: 300 },
      { runPlanId: runPlan!.id, week: w, weekday: 6, type: 'longao', distanceKm: 7 + w, targetPaceSec: 420 },
    )
  }
  await db.insert(t.runSessions).values(sessions)

  const today = new Date().toISOString().slice(0, 10)
  await db.insert(t.assignments).values([
    { alunoId: aluno!.id, professorId: prof!.id, workoutId: workout!.id, startDate: today, weekdays: [1, 3, 5] },
    { alunoId: aluno!.id, professorId: prof!.id, runPlanId: runPlan!.id, startDate: today },
  ])

  const [sub] = await db
    .insert(t.subscriptions)
    .values({
      userId: aluno!.id,
      planId: plans[1]!.id,
      planPriceId: (await db.query.planPrices.findFirst({ where: (p, { eq }) => eq(p.planId, plans[1]!.id) }))!.id,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 864e5),
    })
    .returning()
  await db.insert(t.payments).values({
    subscriptionId: sub!.id,
    userId: aluno!.id,
    amountCents: 17990,
    method: 'PIX',
    status: 'paid',
    dueDate: today,
    paidAt: new Date(),
  })

  console.info('[seed] Dados demo criados. Logins: admin|professor|aluno@clacademy.local / clacademy123')
}

