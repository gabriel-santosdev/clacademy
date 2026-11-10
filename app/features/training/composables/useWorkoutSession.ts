import type { SessionExercise, WorkoutSessionState } from '../domain/session'

/*
 * Sessões em andamento, compartilhadas entre telas (Hoje e Meus treinos) e
 * salvas no aparelho: fechar o app no meio do treino não perde o progresso.
 */
const sessions = reactive<Record<string, WorkoutSessionState | null>>({})

function readStored(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeStored(s: WorkoutSessionState | null, key: string) {
  try {
    if (s) localStorage.setItem(key, JSON.stringify(s))
    else localStorage.removeItem(key)
  } catch {
    /* modo privado / armazenamento cheio: segue só em memória */
  }
}

/** Encerra a sessão (depois de registrar o treino ou ao descartar). */
export function clearWorkoutSession(key: string | undefined) {
  if (!key) return
  sessions[key] = null
  writeStored(null, key)
}

/** Execução de um treino: cronômetro com pausa, séries, checks e descanso. */
export function useWorkoutSession(key: MaybeRefOrGetter<string>, items: MaybeRefOrGetter<SessionExercise[]>) {
  const k = computed(() => toValue(key))
  const list = computed(() => toValue(items))

  if (import.meta.client && !(k.value in sessions)) {
    sessions[k.value] = restoreSession(readStored(k.value), k.value, list.value.length)
  }

  const state = computed(() => sessions[k.value] ?? null)
  const started = computed(() => !!state.value)
  const paused = computed(() => state.value?.pausedAt != null)

  /* relógio: só anda com sessão rodando */
  const now = ref(Date.now())
  let timer: ReturnType<typeof setInterval> | undefined
  watch(
    () => started.value && !paused.value,
    (running) => {
      clearInterval(timer)
      now.value = Date.now()
      if (running) timer = setInterval(() => (now.value = Date.now()), 500)
    },
    { immediate: true },
  )
  onScopeDispose(() => clearInterval(timer))

  const elapsed = computed(() => (state.value ? formatClock(elapsedMs(state.value, now.value)) : '0:00'))
  const rest = computed(() => (state.value ? restLeft(state.value, now.value) : 0))
  const progress = computed(() => (state.value ? sessionProgress(state.value) : { done: 0, total: list.value.length, pct: 0 }))

  /* avisa no celular quando o descanso acaba */
  watch(rest, (left, before) => {
    if (before > 0 && left === 0 && state.value?.restUntil) {
      state.value.restUntil = null
      persist()
      try {
        navigator.vibrate?.([180, 80, 180])
      } catch {
        /* sem vibração */
      }
    }
  })

  function persist() {
    writeStored(state.value, k.value)
  }

  function mutate(fn: (s: WorkoutSessionState) => void) {
    if (!state.value) return
    fn(state.value)
    persist()
  }

  return {
    state,
    started,
    paused,
    elapsed,
    rest,
    progress,
    start() {
      sessions[k.value] = startSession(k.value, list.value.length)
      persist()
    },
    pause: () => mutate((s) => pauseSession(s)),
    resume: () => mutate((s) => resumeSession(s)),
    tapSet: (i: number) => mutate((s) => tapSet(s, i, list.value[i]!)),
    toggle: (i: number) => mutate((s) => toggleExercise(s, i, list.value[i]!)),
    skipRest: () => mutate((s) => (s.restUntil = null)),
    discard: () => clearWorkoutSession(k.value),
    /** Dados para o registro: duração e o que foi feito. Pausa o cronômetro. */
    finish() {
      if (!state.value) return null
      pauseSession(state.value)
      persist()
      return {
        durationMin: sessionMinutes(state.value),
        exercises: sessionExercisesPayload(state.value, list.value),
      }
    },
  }
}
