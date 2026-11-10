import type { LogContext, LogForm } from '../domain/activity'

/** Estado de abertura do diálogo de registro (qual treino/sessão está sendo registrado). */
export function useActivityLogger() {
  const visible = ref(false)
  const context = ref<LogContext>({ kind: 'checkin' })

  function open(ctx: LogContext) {
    context.value = ctx
    visible.value = true
  }

  return { visible, context, open }
}

/** Formulário e envio de um registro de atividade. */
export function useActivityLogForm(context: Ref<LogContext>, onSaved: () => void) {
  const form = reactive<LogForm>(emptyLogForm(context.value))
  const reset = () => Object.assign(form, emptyLogForm(context.value))

  const title = computed(() => logDialogTitle(context.value.kind))
  const free = computed(() => isFreeLog(context.value))
  const effort = computed(() => rpeLabel(form.rpe))

  const save = useAction(async () => {
    await trainingApi.logActivity(logFormToPayload(context.value, form))
    clearWorkoutSession(context.value.sessionKey)
    onSaved()
  }, 'Treino registrado! 💪')

  return { form, reset, title, free, effort, save }
}
