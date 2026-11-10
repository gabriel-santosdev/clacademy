/**
 * Execução de um treino de força: iniciar, pausar, marcar séries/exercícios e
 * finalizar. Estado serializável (fica salvo no aparelho). Puro.
 */

export interface SessionExercise {
  name: string
  sets: number | null
  restSeconds: number | null
}

export interface WorkoutSessionState {
  key: string
  /** epoch ms do início */
  startedAt: number
  /** epoch ms em que foi pausado (null = rodando) */
  pausedAt: number | null
  /** tempo total já pausado, em ms */
  pausedMs: number
  /** séries feitas por exercício (índice da ficha) */
  setsDone: number[]
  /** exercício marcado como feito */
  done: boolean[]
  /** fim do descanso em andamento (epoch ms) */
  restUntil: number | null
}

/** Sessões abertas há mais tempo que isso são descartadas (treino esquecido aberto). */
export const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000

export function sessionKey(assignmentId: number, workoutId: number) {
  return `cl-workout-session:${assignmentId}:${workoutId}`
}

export function startSession(key: string, count: number, now = Date.now()): WorkoutSessionState {
  return {
    key,
    startedAt: now,
    pausedAt: null,
    pausedMs: 0,
    setsDone: Array(count).fill(0),
    done: Array(count).fill(false),
    restUntil: null,
  }
}

/** Valida o que veio do armazenamento; descarta formatos estranhos ou sessões velhas. */
export function restoreSession(raw: unknown, key: string, count: number, now = Date.now()): WorkoutSessionState | null {
  if (!raw || typeof raw !== 'object') return null
  const s = raw as Partial<WorkoutSessionState>
  if (s.key !== key || typeof s.startedAt !== 'number' || now - s.startedAt > SESSION_MAX_AGE_MS) return null
  if (!Array.isArray(s.setsDone) || !Array.isArray(s.done) || s.setsDone.length !== count || s.done.length !== count) return null
  return {
    key,
    startedAt: s.startedAt,
    pausedAt: typeof s.pausedAt === 'number' ? s.pausedAt : null,
    pausedMs: typeof s.pausedMs === 'number' ? s.pausedMs : 0,
    setsDone: s.setsDone.map((n) => Math.max(0, Number(n) || 0)),
    done: s.done.map(Boolean),
    restUntil: typeof s.restUntil === 'number' ? s.restUntil : null,
  }
}

export function elapsedMs(s: WorkoutSessionState, now = Date.now()) {
  const end = s.pausedAt ?? now
  return Math.max(0, end - s.startedAt - s.pausedMs)
}

export function pauseSession(s: WorkoutSessionState, now = Date.now()) {
  if (s.pausedAt == null) {
    s.pausedAt = now
    s.restUntil = null
  }
}

export function resumeSession(s: WorkoutSessionState, now = Date.now()) {
  if (s.pausedAt != null) {
    s.pausedMs += now - s.pausedAt
    s.pausedAt = null
  }
}

/** Segundos restantes de descanso (0 = sem descanso). */
export function restLeft(s: WorkoutSessionState, now = Date.now()) {
  return s.restUntil ? Math.max(0, Math.ceil((s.restUntil - now) / 1000)) : 0
}

/**
 * Toca na próxima série do exercício. Ao completar todas, marca o exercício.
 * Depois de uma série (que não seja a última), começa o descanso da ficha.
 * Com todas feitas, um toque zera as séries (para corrigir engano).
 */
export function tapSet(s: WorkoutSessionState, i: number, ex: SessionExercise, now = Date.now()) {
  const total = ex.sets ?? 0
  if (total <= 0) return toggleExercise(s, i, ex)
  if (s.setsDone[i]! >= total) {
    s.setsDone[i] = 0
    s.done[i] = false
    return
  }
  s.setsDone[i]! += 1
  if (s.setsDone[i]! >= total) {
    s.done[i] = true
    s.restUntil = null
  } else if (ex.restSeconds) {
    s.restUntil = now + ex.restSeconds * 1000
  }
}

/** Marca/desmarca o exercício inteiro (todas as séries). */
export function toggleExercise(s: WorkoutSessionState, i: number, ex: SessionExercise) {
  const next = !s.done[i]
  s.done[i] = next
  s.setsDone[i] = next ? (ex.sets ?? 0) : 0
}

export function sessionProgress(s: WorkoutSessionState) {
  const total = s.done.length
  const done = s.done.filter(Boolean).length
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 }
}

/** Minutos para o registro (mínimo 1 se o treino foi iniciado). */
export function sessionMinutes(s: WorkoutSessionState, now = Date.now()) {
  return Math.max(1, Math.round(elapsedMs(s, now) / 60000))
}

/** Resumo enviado junto com o registro, para o professor ver o que foi feito. */
export function sessionExercisesPayload(s: WorkoutSessionState, items: SessionExercise[]) {
  return items.map((ex, i) => ({
    name: ex.name,
    sets: ex.sets,
    setsDone: s.setsDone[i] ?? 0,
    done: !!s.done[i],
  }))
}

/** "12:05" ou "1:02:05" */
export function formatClock(ms: number) {
  const total = Math.floor(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const sec = total % 60
  const mm = h ? String(m).padStart(2, '0') : String(m)
  return `${h ? `${h}:` : ''}${mm}:${String(sec).padStart(2, '0')}`
}
