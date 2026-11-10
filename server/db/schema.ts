import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  date,
  real,
  serial,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { EQUIPMENTS, MUSCLE_GROUPS, TRAINING_GOALS, TRAINING_LEVELS } from '../../shared/utils/constants'

const id = () => serial('id').primaryKey()
const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
const updatedAt = () =>
  timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())

// ── Usuários ────────────────────────────────────────────────
export const users = pgTable('users', {
  id: id(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['admin', 'professor', 'aluno'] }).notNull().default('aluno'),
  phone: text('phone'),
  cpf: text('cpf'),
  birthDate: date('birth_date'),
  bio: text('bio'),
  active: boolean('active').notNull().default(true),
  /** professor responsável pelo aluno */
  coachId: integer('coach_id'),
  /** perfil de treino (alunos): usado para sugerir fichas compatíveis */
  trainingLevel: text('training_level', { enum: TRAINING_LEVELS }),
  trainingGoal: text('training_goal', { enum: TRAINING_GOALS }),
  /** null = cadastro ainda não confirmado pelo link enviado por e-mail */
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

/** Links enviados por e-mail (confirmação de conta, redefinição de senha). Guarda só o hash do token. */
export const emailTokens = pgTable(
  'email_tokens',
  {
    id: id(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    purpose: text('purpose', { enum: ['verify_email', 'reset_password'] }).notNull(),
    tokenHash: text('token_hash').notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index('email_tokens_user_idx').on(t.userId)],
)

// ── Planos e preços ─────────────────────────────────────────
export const plans = pgTable('plans', {
  id: id(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  /** 'academia' = Personal · 'assessoria' = assessoria de corrida. 'corrida'/'combo' são legados. */
  modality: text('modality', { enum: ['academia', 'assessoria', 'corrida', 'combo'] }).notNull(),
  features: jsonb('features').$type<string[]>().notNull().default([]),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).notNull().default('draft'),
  highlight: boolean('highlight').notNull().default(false),
  trialDays: integer('trial_days').notNull().default(0),
  classesPerWeek: integer('classes_per_week'),
  sortOrder: integer('sort_order').notNull().default(0),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

/**
 * Preços são versionados: alterar o valor cria uma nova linha e desativa a
 * anterior. Assinaturas existentes continuam apontando para o preço antigo.
 */
export const planPrices = pgTable(
  'plan_prices',
  {
    id: id(),
    planId: integer('plan_id')
      .notNull()
      .references(() => plans.id, { onDelete: 'cascade' }),
    interval: text('interval', { enum: ['monthly', 'quarterly', 'semiannual', 'yearly'] }).notNull(),
    amountCents: integer('amount_cents').notNull(),
    version: integer('version').notNull().default(1),
    active: boolean('active').notNull().default(true),
    createdAt: createdAt(),
  },
  (t) => [index('plan_prices_plan_idx').on(t.planId)],
)

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: id(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    planId: integer('plan_id')
      .notNull()
      .references(() => plans.id),
    planPriceId: integer('plan_price_id')
      .notNull()
      .references(() => planPrices.id),
    status: text('status', { enum: ['pending', 'trialing', 'active', 'past_due', 'canceled'] })
      .notNull()
      .default('pending'),
    provider: text('provider').notNull().default('manual'),
    providerCustomerId: text('provider_customer_id'),
    providerSubscriptionId: text('provider_subscription_id'),
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
    canceledAt: timestamp('canceled_at', { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('subscriptions_user_idx').on(t.userId)],
)

export const payments = pgTable(
  'payments',
  {
    id: id(),
    subscriptionId: integer('subscription_id')
      .notNull()
      .references(() => subscriptions.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    amountCents: integer('amount_cents').notNull(),
    method: text('method'), // PIX | BOLETO | CREDIT_CARD | manual
    status: text('status', { enum: ['pending', 'paid', 'overdue', 'refunded', 'canceled'] })
      .notNull()
      .default('pending'),
    dueDate: date('due_date'),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    providerPaymentId: text('provider_payment_id').unique(),
    invoiceUrl: text('invoice_url'),
    createdAt: createdAt(),
  },
  (t) => [index('payments_user_idx').on(t.userId)],
)

// ── Treinos (academia) ──────────────────────────────────────
export const workouts = pgTable('workouts', {
  id: id(),
  title: text('title').notNull(),
  description: text('description'),
  /** ex: "A", "B", "Superiores" */
  tag: text('tag'),
  /** perfil a que a ficha se destina (modelo por nível/objetivo) */
  level: text('level', { enum: TRAINING_LEVELS }),
  goal: text('goal', { enum: TRAINING_GOALS }),
  createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

/** Banco de exercícios (catálogo da CL Academy + criados pela equipe). */
export const exercises = pgTable(
  'exercises',
  {
    id: id(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    muscleGroup: text('muscle_group', { enum: MUSCLE_GROUPS }).notNull(),
    equipment: text('equipment', { enum: EQUIPMENTS }).notNull().default('outros'),
    level: text('level', { enum: TRAINING_LEVELS }).notNull().default('iniciante'),
    /** dica de execução */
    instructions: text('instructions'),
    /** fotos do movimento (início e fim); alternadas viram animação */
    images: jsonb('images').$type<string[]>().notNull().default([]),
    videoUrl: text('video_url'),
    /** vídeos licenciados de um provedor externo (hoje: MuscleWiki) */
    externalSource: text('external_source', { enum: ['musclewiki'] }),
    externalId: integer('external_id'),
    /** metadados dos vídeos (ângulo, gênero, URL de stream); renovados a cada 25 dias */
    externalMedia: jsonb('external_media').$type<{ url: string; angle: string; gender: string }[]>(),
    externalSyncedAt: timestamp('external_synced_at', { withTimezone: true }),
    /** 'catalogo' = veio com o app · 'equipe' = criado pela CL Academy */
    source: text('source', { enum: ['catalogo', 'equipe'] }).notNull().default('equipe'),
    active: boolean('active').notNull().default(true),
    createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('exercises_group_idx').on(t.muscleGroup)],
)

export const workoutItems = pgTable('workout_items', {
  id: id(),
  workoutId: integer('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  position: integer('position').notNull().default(0),
  /** exercício do banco (o nome fica copiado aqui, para a ficha não mudar se o exercício for editado) */
  exerciseId: integer('exercise_id').references(() => exercises.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  sets: integer('sets'),
  reps: text('reps'), // "10-12", "30s"
  load: text('load'), // "20kg", "moderada"
  restSeconds: integer('rest_seconds'),
  notes: text('notes'),
  videoUrl: text('video_url'),
})

// ── Planilhas de corrida (corrida / assessoria) ─────────────
export const runPlans = pgTable('run_plans', {
  id: id(),
  title: text('title').notNull(),
  description: text('description'),
  goal: text('goal'), // "10K sub 50", "Meia maratona"
  weeks: integer('weeks').notNull().default(4),
  createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

export const runSessions = pgTable('run_sessions', {
  id: id(),
  runPlanId: integer('run_plan_id')
    .notNull()
    .references(() => runPlans.id, { onDelete: 'cascade' }),
  week: integer('week').notNull().default(1),
  /** 0 = domingo … 6 = sábado */
  weekday: integer('weekday').notNull().default(1),
  type: text('type', {
    enum: ['rodagem', 'intervalado', 'longao', 'regenerativo', 'tiro', 'fartlek', 'prova'],
  })
    .notNull()
    .default('rodagem'),
  distanceKm: real('distance_km'),
  durationMin: integer('duration_min'),
  targetPaceSec: integer('target_pace_sec'),
  description: text('description'),
})

// ── Atribuições professor → aluno ───────────────────────────
export const assignments = pgTable(
  'assignments',
  {
    id: id(),
    alunoId: integer('aluno_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    professorId: integer('professor_id').references(() => users.id, { onDelete: 'set null' }),
    workoutId: integer('workout_id').references(() => workouts.id, { onDelete: 'cascade' }),
    runPlanId: integer('run_plan_id').references(() => runPlans.id, { onDelete: 'cascade' }),
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    /** dias da semana em que o treino de academia deve ser feito */
    weekdays: jsonb('weekdays').$type<number[]>().notNull().default([]),
    active: boolean('active').notNull().default(true),
    notes: text('notes'),
    createdAt: createdAt(),
  },
  (t) => [index('assignments_aluno_idx').on(t.alunoId)],
)

// ── Registros / check-ins ───────────────────────────────────
export const activityLogs = pgTable(
  'activity_logs',
  {
    id: id(),
    alunoId: integer('aluno_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    assignmentId: integer('assignment_id').references(() => assignments.id, { onDelete: 'set null' }),
    workoutId: integer('workout_id').references(() => workouts.id, { onDelete: 'set null' }),
    runSessionId: integer('run_session_id').references(() => runSessions.id, { onDelete: 'set null' }),
    kind: text('kind', { enum: ['treino', 'corrida', 'checkin'] }).notNull(),
    title: text('title'),
    performedAt: timestamp('performed_at', { withTimezone: true }).notNull().defaultNow(),
    distanceKm: real('distance_km'),
    durationMin: integer('duration_min'),
    avgPaceSec: integer('avg_pace_sec'),
    /** percepção de esforço 1-10 */
    rpe: integer('rpe'),
    /** exercícios marcados na execução do treino (modo "iniciar treino") */
    exercises: jsonb('exercises').$type<{ name: string; sets: number | null; setsDone: number; done: boolean }[]>(),
    notes: text('notes'),
    feedback: text('feedback'),
    feedbackBy: integer('feedback_by').references(() => users.id, { onDelete: 'set null' }),
    source: text('source').notNull().default('manual'), // manual | strava
    externalId: text('external_id'),
    /** aparelho que gravou (ex.: "Garmin Forerunner 265", "Apple Watch Series 9"), vindo do Strava */
    device: text('device'),
    /** frequência cardíaca média (bpm) */
    avgHr: integer('avg_hr'),
    /** ganho de elevação (m) */
    elevationM: integer('elevation_m'),
    createdAt: createdAt(),
  },
  (t) => [
    index('activity_logs_aluno_idx').on(t.alunoId),
    uniqueIndex('activity_logs_external_idx').on(t.source, t.externalId),
  ],
)

// ── Integrações / notificações / configurações ──────────────
export const pushSubscriptions = pgTable('push_subscriptions', {
  id: id(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  endpoint: text('endpoint').notNull().unique(),
  keys: jsonb('keys').$type<{ p256dh: string; auth: string }>().notNull(),
  createdAt: createdAt(),
})

export const stravaConnections = pgTable('strava_connections', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  athleteId: text('athlete_id').notNull(),
  athleteName: text('athlete_name'),
  connectedAt: timestamp('connected_at', { withTimezone: true }).defaultNow(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  expiresAt: integer('expires_at').notNull(),
  lastSyncAt: timestamp('last_sync_at', { withTimezone: true }),
})

export const notifications = pgTable(
  'notifications',
  {
    id: id(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    body: text('body'),
    url: text('url'),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index('notifications_user_idx').on(t.userId)],
)

export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
})

// ── Relações ────────────────────────────────────────────────
export const plansRelations = relations(plans, ({ many }) => ({ prices: many(planPrices) }))
export const planPricesRelations = relations(planPrices, ({ one }) => ({
  plan: one(plans, { fields: [planPrices.planId], references: [plans.id] }),
}))
export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
  plan: one(plans, { fields: [subscriptions.planId], references: [plans.id] }),
  price: one(planPrices, { fields: [subscriptions.planPriceId], references: [planPrices.id] }),
  payments: many(payments),
}))
export const paymentsRelations = relations(payments, ({ one }) => ({
  subscription: one(subscriptions, { fields: [payments.subscriptionId], references: [subscriptions.id] }),
  user: one(users, { fields: [payments.userId], references: [users.id] }),
}))
export const workoutsRelations = relations(workouts, ({ many }) => ({ items: many(workoutItems) }))
export const workoutItemsRelations = relations(workoutItems, ({ one }) => ({
  workout: one(workouts, { fields: [workoutItems.workoutId], references: [workouts.id] }),
  exercise: one(exercises, { fields: [workoutItems.exerciseId], references: [exercises.id] }),
}))
export const runPlansRelations = relations(runPlans, ({ many }) => ({ sessions: many(runSessions) }))
export const runSessionsRelations = relations(runSessions, ({ one }) => ({
  runPlan: one(runPlans, { fields: [runSessions.runPlanId], references: [runPlans.id] }),
}))
export const assignmentsRelations = relations(assignments, ({ one }) => ({
  aluno: one(users, { fields: [assignments.alunoId], references: [users.id] }),
  professor: one(users, { fields: [assignments.professorId], references: [users.id] }),
  workout: one(workouts, { fields: [assignments.workoutId], references: [workouts.id] }),
  runPlan: one(runPlans, { fields: [assignments.runPlanId], references: [runPlans.id] }),
}))
export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  aluno: one(users, { fields: [activityLogs.alunoId], references: [users.id] }),
  workout: one(workouts, { fields: [activityLogs.workoutId], references: [workouts.id] }),
  runSession: one(runSessions, { fields: [activityLogs.runSessionId], references: [runSessions.id] }),
}))
